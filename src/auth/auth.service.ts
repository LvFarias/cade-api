import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import bcrypt from 'bcrypt';
import { RegisterDto } from './dtos/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new ConflictException('E-mail já cadastrado.');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        cpf: dto.cpf,
        passwordHash,
        deviceId: dto.deviceId,
      },
    });

    return this.login(dto.email, dto.password);
  }

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, cpf: true, deviceId: true },
    });
    return user;
  }

  async updateProfile(
    userId: string,
    data: { name?: string; deviceId?: string },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { name: data.name, deviceId: data.deviceId },
      select: { id: true, name: true, email: true },
    });
  }

  async anonymizeUser(userId: string) {
    // LGPD: Substitui dados sensíveis por hashes/nulls sem quebrar relacionamentos do banco[cite: 1]
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: 'Usuário Excluído',
        email: `deleted_${userId}@anonymized.local`,
        cpf: null,
        passwordHash: '',
        deviceId: null,
        isAnonymized: true,
      },
    });
    return { message: 'Conta anonimizada e desativada com sucesso.' };
  }
}
