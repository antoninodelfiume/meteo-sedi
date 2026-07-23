import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import { officeSites } from "../sites";
import type { OfficeSite, TemperatureUnit } from "../weather.types";

type WeatherWorkspaceValue = {
  selectedSiteId: string;
  selectedSite: OfficeSite;
  temperatureUnit: TemperatureUnit;
  selectSite: (siteId: string) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
};

const WeatherWorkspaceContext = createContext<
  WeatherWorkspaceValue | undefined
>(undefined);

export function WeatherWorkspaceProvider({ children }: PropsWithChildren) {
  const [selectedSiteId, setSelectedSiteId] = useState(officeSites[0].id);
  const [temperatureUnit, setTemperatureUnitState] =
    useState<TemperatureUnit>("celsius");

  const selectedSite =
    officeSites.find((site) => site.id === selectedSiteId) ?? officeSites[0];

  function selectSite(siteId: string) {
    if (officeSites.some((site) => site.id === siteId)) {
      setSelectedSiteId(siteId);
    }
  }

  function setTemperatureUnit(unit: TemperatureUnit) {
    setTemperatureUnitState(unit);
  }
  return (
    <WeatherWorkspaceContext.Provider
      value={{
        selectedSiteId,
        selectedSite,
        temperatureUnit,
        selectSite,
        setTemperatureUnit,
      }}
    >
      {children}
    </WeatherWorkspaceContext.Provider>
  );
}

export function useWeatherWorkspace() {
  const value = useContext(WeatherWorkspaceContext);

  if (!value) {
    throw new Error(
      "useWeatherWorkspace deve essere usato dentro WeatherWorkspaceProvider",
    );
  }

  return value;
}
