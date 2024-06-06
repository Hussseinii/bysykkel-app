import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { getStationStatus, getStations } from "../services/bikeStationService";
import { StationStatus, Station, StationStatusResponse } from "../types/models";
import { convertFromUnix } from "../utils/dateUtils";

const BikeStationStatusList = () => {
  const [StationStatusResponse, setStationStatusResponse] = useState<StationStatusResponse | null>(null);
  const stationStatus: StationStatus[] = StationStatusResponse?.data.stations || [];
  const [stations, setStations] = useState<Map<string, Station>>(new Map());
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const statusResponse = await getStationStatus();
      setStationStatusResponse(statusResponse);

      const stationData = await getStations();
      setStations(stationData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching station status:", error);
      setLoading(false);
    }
  };

  //sort stationstatus by name
  stationStatus.sort((a, b) => {
    const stationA = stations.get(a.station_id);
    const stationB = stations.get(b.station_id);
    if (stationA && stationB) {
      return stationA.name.localeCompare(stationB.name);
    }
    return 0;
  });

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 30 * 60 * 1000); // Polling every 30 minutes;

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (stationStatus.length === 0) {
    return (
      <div>
        <p>No bike stations found.</p>
        <p>Please check back later for updates.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ margin: "10px" }}>
        <h1> Oslo Bysykkel: oversikt over tilgjengelige sykler og låser </h1>
        <p>Antall stasjoner: {stations.size}</p>
        <p>
          Sist oppdatert:{" "}
          {StationStatusResponse
            ? convertFromUnix(StationStatusResponse.last_updated)
            : "N/A"}
        </p>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Available Locks</TableCell>
              <TableCell>Available Bikes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stationStatus.map((rack) => {
              const station = stations.get(rack.station_id);

              return (
                <TableRow key={rack.station_id}>
                  <TableCell>{station?.name}</TableCell>
                  <TableCell>{station?.address}</TableCell>
                  <TableCell>{station?.capacity}</TableCell>
                  <TableCell>{rack.num_docks_available}</TableCell>
                  <TableCell>{rack.num_bikes_available}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BikeStationStatusList;
