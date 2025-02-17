import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin,
  });

  const config = new DocumentBuilder()
    .setTitle('Sistema de agendamentos')
    .setDescription('Documentação para a API de agendamentos')
    .setVersion('1.0')
    .addTag('appointments')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
