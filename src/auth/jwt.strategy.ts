import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'cade-super-secret-key-2026',
    });
  }

  async validate(payload: any) {
    // O retorno deste método é injetado no objeto "req.user" nas rotas protegidas
    return { userId: payload.sub, email: payload.email };
  }
}