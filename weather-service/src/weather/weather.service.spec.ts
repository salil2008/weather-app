import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { WeatherQuery } from '../types';
import { SharedModule } from '../shared/shared.module';

describe('CatsService', () => {
  let weatherService: WeatherService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherService],
      imports: [SharedModule],
    }).compile();
    weatherService = module.get<WeatherService>(WeatherService);
  });

  describe('getDailyForecast', () => {
    it('should return an array of data points of daily temperature forcast for 7 days', async () => {
      const payload: WeatherQuery = {
        latitude: '44.34',
        longitude: '10.99',
        hourly: 'temperature_2m',
      };
      const response = await weatherService.getDailyForecast(payload);
      expect(response).toBeTruthy();
      expect(response.results.length).toBeGreaterThan(0);
    });

    it('should return an array of data points of daily rain forcast for 7 days', async () => {
      const payload: WeatherQuery = {
        latitude: '44.34',
        longitude: '10.99',
        hourly: 'rain',
      };
      const response = await weatherService.getDailyForecast(payload);
      expect(response).toBeTruthy();
    });
  });

  describe('getGeoLocation', () => {
    it('should return an array of data points with averages', async () => {
      const payload: string = 'mumbai';
      const response = await weatherService.getGeoLocation(payload);
      expect(response).toBeTruthy();
      expect(response.results.length).toBeGreaterThan(0);
    });
  });

  describe('getHistoricalData', () => {
    it('should return an array of data points with averages', async () => {
      const payload: WeatherQuery = {
        latitude: '44.34',
        longitude: '10.99',
        start_date: '2015-01-01',
        end_date: '2019-12-31',
        hourly: 'temperature_2m',
      };
      const response = await weatherService.getHistoricalData(payload);
      expect(response).toBeTruthy();
      expect(response.results.length).toBeGreaterThan(0);
    });
  });
});
