import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Task Craft')
  .setDescription('Task Craft API Description')
  .setVersion('0.1')
  .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document)
  
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  })

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
