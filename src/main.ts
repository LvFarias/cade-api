import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js'; // Lembre-se do .js no ESM!
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS para requisições frontend no futuro
  app.enableCors();

  // Habilita a validação automática de DTOs usando class-validator
  app.useGlobalPipes(new ValidationPipe());

  // Configuração base do Swagger
  const config = new DocumentBuilder()
    .setTitle('Cade? API')
    .setDescription('API centralizada de rastreio de encomendas (Open Source)')
    .setVersion('1.0')
    .addBearerAuth() // Habilita o campo para inserir o Bearer Token (JWT)
    .build();

  // Gera o documento JSON e monta a interface na rota /docs
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação Swagger disponível em http://localhost:${PORT}/docs`);
}
bootstrap();