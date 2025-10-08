import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.enableCors({
    origin: ['http://localhost:3000',
      process.env.FRONTEND_URL || '',
     ],
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
  });

  //
  
  // Swagger UI static files
  const swaggerDistPath = join(require.resolve('swagger-ui-dist'), '..');

  const config = new DocumentBuilder()
    .setTitle('Personalized Candles API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger JSON Path
  const httpAdapter = app.getHttpAdapter();
  if (httpAdapter.getType() === 'express') {
    const expressApp = httpAdapter.getInstance();
    expressApp.get('/swagger-json', (req: Request, res: Response) => {
      res.json(document);
    });
  }

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'API Docs',
    customCssUrl: '/docs/swagger-ui.css',
    customJs: [
      '/docs/swagger-ui-bundle.js',
      '/docs/swagger-ui-init.js',
    ],
    swaggerOptions: {
      spec: document,
      url: '/swagger-json',
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
