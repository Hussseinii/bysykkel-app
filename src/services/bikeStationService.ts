import { Station, StationStatusResponse } from "../types/models";

const API_URL = "https://gbfs.urbansharing.com/oslobysykkel.no";

export const getStationStatus = async (): Promise<StationStatusResponse> => {
  try {
    const response = await fetch(`${API_URL}/station_status.json`);

    if (!response.ok) {
      throw new Error(`Error fetching station status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const getStations = async (): Promise<Map<string, Station>> => {
  try {
    const response = await fetch(`${API_URL}/station_information.json`);

    if (!response.ok) {
      throw new Error(`Error fetching stations: ${response.status}`);
    }
    const data = await response.json();

    const stationMap = new Map<string, Station>();

    data.data.stations.forEach((station: Station) => {
      stationMap.set(station.station_id, station);
    });

    return stationMap;
  } catch (error) {
    throw error;
  }
};

export default getStationStatus;
