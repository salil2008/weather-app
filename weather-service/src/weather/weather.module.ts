import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';

import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [WeatherController],
  providers: [WeatherService],
})
export class WeatherModule {}
