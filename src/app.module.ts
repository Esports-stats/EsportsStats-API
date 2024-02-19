import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

import { validate } from 'config/env.validation';
import configuration from 'config/configuration';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from 'middleware/logger.middleware';

import { LeaguesSynchroModule } from './leagues/leagues-synchro.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      cache: true,
      load: [configuration],
      validate,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    LeaguesSynchroModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
