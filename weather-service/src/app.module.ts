import { SharedModule } from './shared/shared.module';
import { WeatherModule } from './weather/weather.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [SharedModule, WeatherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
