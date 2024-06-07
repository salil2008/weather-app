import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private readonly httpService: HttpService) {}

  async post(url: string, data: any, options: any): Promise<any> {
    return firstValueFrom(this.httpService.post(url, data, options));
  }

  async get(url: string, options: any): Promise<any> {
    return firstValueFrom(this.httpService.get(url, options));
  }

  async put(url: string, data: any, options: any): Promise<any> {
    return firstValueFrom(this.httpService.put(url, data, options));
  }

  async delete(url: string, data: any, options: any): Promise<any> {
    return firstValueFrom(this.httpService.delete(url, options));
  }
}
