import type { Forecast, OfficeSite, TemperatureUnit } from '../weather.types';
import type { WeatherApi } from './WeatherApi';

const forecastEndpoint = 'https://api.open-meteo.com/v1/forecast';

export function buildForecastUrl(
  site: OfficeSite,
  unit: TemperatureUnit,
) {
  const searchParams = new URLSearchParams({
    latitude: String(site.latitude),
    longitude: String(site.longitude),
    current:
      'temperature_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    temperature_unit: unit,
    wind_speed_unit: 'kmh',
    timezone: 'auto',
    forecast_days: '5',
  });
  return `${forecastEndpoint}?${searchParams.toString()}`;
}

export function mapOpenMeteoForecast(_payload: unknown): Forecast {
  throw new Error('Completa il mapping Open-Meteo nel TODO 07.');
}

export function createOpenMeteoWeatherApi(
  fetchImpl: typeof fetch = globalThis.fetch,
): WeatherApi {
  return {
    async getForecast(site, unit, signal) {
      const response = await fetchImpl(buildForecastUrl(site, unit), {
        signal,
      });

      if (!response.ok) {
        throw new Error(`Richiesta meteo non riuscita (${response.status}).`);
      }

      const payload: unknown = await response.json();
      return mapOpenMeteoForecast(payload);
    },
  };
}