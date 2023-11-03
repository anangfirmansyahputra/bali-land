"use client";

import mapboxgl, { Map } from "mapbox-gl";
import React, { ReactNode, useEffect } from "react"

interface CustomPopupProps {
  lngLat: [number, number];
  closeOnClick: boolean;
  map: Map | null;
  children: React.ReactNode
}

export default function CustomPopup({
}) {
  return <div>Test</div>
}
