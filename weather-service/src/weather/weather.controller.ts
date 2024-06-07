import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherQuery } from 'src/types';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}
  @Get('daily-forecast')
  getDailyForecast(@Query() query: WeatherQuery): any {
    return this.weatherService.getDailyForecast(query);
  }

  @Get('historical-data')
  getHistoricalData(@Query() query: WeatherQuery): any {
    return this.weatherService.getHistoricalData(query);
  }

  @Get('search')
  getGeoLocation(@Query('searchText') searchText: string): any {
    return this.weatherService.getGeoLocation(searchText);
  }
}
