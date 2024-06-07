interface Ping {
  status: string;
  message: string;
  date: Date;
}

interface WeatherQuery {
  latitude: string;
  longitude: string;
  hourly?: string;
  start_date?: string;
  end_date?: string;
}

export { Ping, WeatherQuery };
