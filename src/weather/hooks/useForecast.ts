import { useEffect, useState } from 'react';
import type { WeatherApi } from '../services/WeatherApi';
import type {
  ForecastViewState,
  OfficeSite,
  TemperatureUnit,
} from '../weather.types';

const initialState: ForecastViewState = {
  status: 'idle',
  data: null,
  error: null,
};

const pendingAction = () => undefined;

function isAbortError(error: unknown) {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      error.name === 'AbortError')
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'Errore imprevisto durante il caricamento.';
}

export function useForecast(
  api: WeatherApi,
  site: OfficeSite,
  unit: TemperatureUnit,
) {
  const [state, setState] = useState<ForecastViewState>(initialState);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', data: null, error: null });

    void api
      .getForecast(site, unit, controller.signal)
      .then((forecast) => {
        if (controller.signal.aborted) return;
        setState({ status: 'success', data: forecast, error: null });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return;
        setState({
          status: 'error',
          data: null,
          error: getErrorMessage(error),
        });
      });

    return () => {
      controller.abort();
    };
  }, [api, site, unit]);

  return {
    ...state,
    retry: pendingAction,
    refresh: pendingAction,
  };
}