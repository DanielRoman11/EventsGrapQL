import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EntityNotFoundErrorFilter } from './entitiy-not-found-error.filter';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    // logger: ['verbose', 'debug', 'error', 'warn'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new EntityNotFoundErrorFilter());
  app.useLogger(new Logger('AppContext', { timestamp: true }));

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  logger.verbose(`Application running on ${await app.getUrl()}`);
}
bootstrap();
