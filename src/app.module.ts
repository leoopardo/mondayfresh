import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [configuration],
});

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    configModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
