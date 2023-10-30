"use client"

import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import landPlots from '@/data/landPlots.json';
import geolocations from '@/data/geolocations.json';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

export default function MapView() {
  const draw = new MapboxDraw();

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "";

    const map = new mapboxgl.Map({
      container: "map",
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [115.105546, -8.6417714],
      zoom: 9,
    });

    const addLandPlotsLayer = () => {
      map.addSource('landPlots', {
        'type': 'geojson',
        // @ts-ignore
        'data': {
          'type': 'Feature',
          'geometry': {
            'type': 'MultiPolygon',
            'coordinates': landPlots.map((landPlot) => {
              const coordinate = JSON.parse(landPlot?.certificate);
              return coordinate.features[0].geometry.coordinates[0];
            }),
          },
        },
      });

      // Add a new layer to visualize the polygon.
      map.addLayer({
        'id': 'landPlots',
        'type': 'fill',
        'source': 'landPlots', // reference the data source
        'layout': {},
        'paint': {
          'fill-color': '#0080ff', // blue color fill
          'fill-opacity': 0.2,
        },
      });

      // Add a black outline around the polygon.
      map.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': 'landPlots',
        'layout': {},
        'paint': {
          'line-color': '#0080ff',
          'line-width': 2,
        },
      });
    }

    const addGeolocationLayer = () => {
      map.addSource('geolocations', {
        'type': 'geojson',
        // @ts-ignore
        "data": {
          "type": 'Feature',
          "geometry": {
            "type": 'MultiPolygon',
            // @ts-ignore
            "coordinates": geolocations
          },
        },
      });

      // Add a new layer to visualize the polygon.
      map.addLayer({
        'id': 'geolocations',
        'type': 'fill',
        'source': 'geolocations', // reference the data source
        'layout': {},
        'paint': {
          'fill-color': '#0080ff', // blue color fill
          'fill-opacity': 0.2,
        },
      });

      // Add a black outline around the polygon.
      map.addLayer({
        'id': 'outlineGeolocations',
        'type': 'line',
        'source': 'geolocations',
        'layout': {},
        'paint': {
          'line-color': '#0080ff',
          'line-width': 2,
        },
      });
    }

    map.on('load', () => {
      // addLandPlotsLayer()
      addGeolocationLayer()

      map.on('zoom', () => {
        const currentZoom = map.getZoom();
        if (currentZoom < 14) {
          if (map.getLayer('outline')) {
            map.removeLayer('outline');
          }
          if (map.getSource('outline')) {
            map.removeSource('outline');
          }
          if (map.getLayer('landPlots')) {
            map.removeLayer('landPlots');
          }
          if (map.getSource('landPlots')) {
            map.removeSource('landPlots');
          }
          if (!map.getLayer('geolocations')) {
            addGeolocationLayer()
          }
        } else {
          if (map.getLayer('outlineGeolocations')) {
            map.removeLayer('outlineGeolocations');
          }
          if (map.getSource('outlineGeolocations')) {
            map.removeSource('outlineGeolocations');
          }
          if (map.getLayer('geolocations')) {
            map.removeLayer('geolocations');
          }
          if (map.getSource('geolocations')) {
            map.removeSource('geolocations');
          }
          if (!map.getLayer('landPlots')) {
            addLandPlotsLayer()
          }
        }
      });

      map.addControl(draw, 'top-right')

      map.on('draw.create', (e) => {
        const drawnPolygonCoordinates = e.features[0].geometry.coordinates;
        console.log('Drawn Polygon Coordinates:', drawnPolygonCoordinates);
      });
    });

    return () => map.remove();
  }, []);

  return <div id='map' style={{ width: '100vw', height: '100vh' }}></div>;
}
