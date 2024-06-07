import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { fetchWeatherApi } from 'openmeteo';
import { ApiService } from '../shared/api.service';
import { WeatherQuery } from '../types';

@Injectable()
export class WeatherService {
  constructor(private readonly apiService: ApiService) {}
  private WEATHER_VARS_LABELS = {
    temperature_2m: { xAxis: 'temperature', yAxis: 'time' },
    rain: { xAxis: 'rain', yAxis: 'time' },
  };

  private average(results: any[]) {
    const sums = {},
      counts = {},
      final = { results: [] };
    let name: string;
    for (const element of results) {
      name = element.x;
      if (!(name in sums)) {
        sums[name] = 0;
        counts[name] = 0;
      }
      sums[name] += element.y;
      counts[name]++;
    }

    for (name in sums) {
      final.results.push({ x: name, y: sums[name] / counts[name] });
    }
    return final;
  }

  private processWeatherData(
    responses: any[],
    xAxis: string,
    yAxis: string,
    dateFormat: string,
  ) {
    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      results: {
        [yAxis]: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval(),
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        [xAxis]: hourly.variables(0)!.valuesArray()!,
      },
    };

    const finalResponse = [];

    for (let i = 0; i < weatherData.results.time.length; i++) {
      finalResponse.push({
        x: moment(weatherData.results[yAxis][i]).format(dateFormat),
        y: weatherData.results[xAxis][i],
      });
    }

    return this.average(finalResponse);
  }

  async getDailyForecast(query: WeatherQuery) {
    try {
      if (!this.WEATHER_VARS_LABELS[query?.hourly])
        throw new Error('Invalid weather variable.');

      const { xAxis, yAxis } = this.WEATHER_VARS_LABELS[query?.hourly];
      const params = {
        ...query,
      };
      const url = 'https://api.open-meteo.com/v1/forecast';
      const responses = await fetchWeatherApi(url, params);

      return this.processWeatherData(responses, xAxis, yAxis, 'YYYY-MM-DD');
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getHistoricalData(query: WeatherQuery) {
    try {
      if (!this.WEATHER_VARS_LABELS[query?.hourly])
        throw new Error('Invalid weather variable.');

      const { xAxis, yAxis } = this.WEATHER_VARS_LABELS[query?.hourly];
      const params = {
        ...query,
      };
      const url = 'https://archive-api.open-meteo.com/v1/archive';
      const responses = await fetchWeatherApi(url, params);

      return this.processWeatherData(responses, xAxis, yAxis, 'YYYY');
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getGeoLocation(searchText: string) {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${searchText}`;
      const options = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await this.apiService.get(url, options);
      return data;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}
