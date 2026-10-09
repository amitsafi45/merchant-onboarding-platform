import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', { infer: true }) ?? 3000;
  const globalPrefix = 'merchant-onboarding/api';
  // Base URL
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Merchant Onboarding Platform API')
    .setDescription('The Merchant Onboarding Platform API description')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
  await app.listen(port, () => {
    console.log(
      `Application is running on: http://localhost:${port}/${globalPrefix}`,
    );
    console.log(
      `Swagger docs available at: http://localhost:${port}/${globalPrefix}/docs`,
    );
  });
}
bootstrap();
