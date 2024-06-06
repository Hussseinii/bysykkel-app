export interface StationStatus {
  station_id: string;
  is_installed: boolean;
  is_renting: boolean;
  is_returning: boolean;
  last_reported: number;
  num_vehicles_available: number;
  num_bikes_available: number;
  num_docks_available: number;
  vehicle_types_available: any[];
}

export interface Station {
  station_id: string;
  name: string;
  address: string;
  capacity: number;
}

export interface Data {
  stations: StationStatus[];
}

export interface StationStatusResponse {
  last_updated: number;
  data: Data;
}
