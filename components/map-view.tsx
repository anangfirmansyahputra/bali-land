"use client"

import badung from '@/data/badung.json';
import geolocations from '@/data/geolocations.json';
import landPlots from '@/data/landPlots.json';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import ModalDetail from './modal-detail';
import ModalActivities from './modal-activities';
import ModalDetailActivity from './modal-detail-activity';

export default function MapView() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showActivities, setShowActivities] = useState<boolean>(false)
  const [showDetailActivity, setShowDetailActivity] = useState<boolean>(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "";

    let marker = new mapboxgl.Marker();

    const map = new mapboxgl.Map({
      container: "map",
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [115.105546, -8.6417714],
      zoom: 9,
    });

    // @ts-ignore
    let hoveredPolygonId = null;

    const addLandPlotsLayer = () => {
      map.addSource('landPlots', {
        'type': 'geojson',
        // @ts-ignore
        data: {
          type: "FeatureCollection",
          // @ts-ignore
          features: landPlots.map((landPlot) => {
            const zoneCode = landPlot.territorials.geom[0].zone.code;
            const territorials = JSON.parse(landPlot.territorials.geom[0].geojson);
            // @ts-ignore
            const certificate = JSON.parse(landPlot.certificate)
            return {
              type: "Feature",
              properties: {
                zoneCode: zoneCode,
                data: {
                  ...landPlot.territorials.geom[0],
                  geojson: null,
                  center: landPlot.center
                }
              },
              geometry: certificate ? certificate.features[0].geometry : territorials
            }
          })
        }
      });

      map.addLayer({
        id: 'landPlots',
        type: 'fill',
        source: 'landPlots',
        layout: {},
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'zoneCode'], 'W'], '#002366',
            ['==', ['get', 'zoneCode'], 'BA'], '#192bc2',
            ['==', ['get', 'zoneCode'], 'BJ'], '#de0a26',
            '#ffffff'
          ],
          'fill-opacity': 0.5,
        },
      });

      map.addLayer({
        id: 'outline',
        type: 'line',
        source: 'landPlots',
        layout: {},
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'zoneCode'], 'W'], '#002366',
            ['==', ['get', 'zoneCode'], 'BA'], '#192bc2',
            ['==', ['get', 'zoneCode'], 'BJ'], '#de0a26',
            "#fff"
          ],
          'line-width': 2,
        },
      });
    }

    const addGeolocationLayer = () => {
      map.addSource('geolocations', {
        type: 'geojson',
        // @ts-ignore
        data: {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: geolocations
          },
        },
      });

      map.addLayer({
        id: 'geolocations',
        type: 'fill',
        source: 'geolocations',
        layout: {},
        paint: {
          'fill-color': '#0080ff',
          'fill-opacity': 0.2,
        },
      });

      map.addLayer({
        id: 'outlineGeolocations',
        type: 'line',
        source: 'geolocations',
        layout: {},
        paint: {
          'line-color': '#0080ff',
          'line-width': 2,
        },
      });
    }

    const addDistrict = () => {
      map.addSource('district', {
        type: "geojson",
        // @ts-ignore
        data: badung
      })

      map.addLayer({
        id: "district-fills",
        type: "fill",
        source: "district",
        layout: {},
        paint: {
          "fill-color": "#fff",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", 'hover'], false],
            0.7,
            0.5
          ]
        }
      })

      map.addLayer({
        id: "district-borders",
        type: "line",
        source: "district",
        layout: {},
        paint: {
          "line-color": "#fff",
          "line-width": 2
        }
      })
    }

    map.on('load', () => {
      addDistrict()
      map.getCanvas().style.cursor = 'auto';

      map.on('mousemove', 'district-fills', (e) => {
        if (e.features?.length || 0 > 0) {
          // @ts-ignore
          if (hoveredPolygonId !== null) {
            map.setFeatureState(
              // @ts-ignore
              { source: "district", id: hoveredPolygonId },
              { hover: false }
            )
          }
          // @ts-ignore
          hoveredPolygonId = e.features[0].properties.id_kabkota
          map.setFeatureState(
            { source: "district", id: hoveredPolygonId },
            { hover: true }
          )
        }
      })

      map.on('mouseleave', 'district-fills', () => {
        // @ts-ignore
        if (hoveredPolygonId !== null) {
          map.setFeatureState(
            // @ts-ignore
            { source: 'district', id: hoveredPolygonId },
            { hover: false }
          )
        }
        hoveredPolygonId = null;
      })

      map.on('mouseenter', 'landPlots', function () {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'landPlots', function () {
        map.getCanvas().style.cursor = 'auto';
      });

      map.on('mouseenter', 'district-fills', function () {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'district-fills', function () {
        map.getCanvas().style.cursor = 'auto';
      });

      map.on('dragstart', function () {
        map.getCanvas().style.cursor = 'grabbing';
      });

      map.on('dragend', function () {
        map.getCanvas().style.cursor = 'auto';
      });

      map.on('click', 'district-fills', function (e: any) {
        const clickedFeature = e.features[0];

        if (clickedFeature) {
          map.flyTo({
            center: e.lngLat,
            zoom: 14,
          });
        }
      });

      map.on('click', 'landPlots', (e: any) => {
        const information = JSON.parse(e.features[0].properties.data);
        setShowModal(true);
        setData(information);


        marker.setLngLat(information.center.lat > 90 ? {
          lat: information.center.lng,
          lng: information.center.lat,
        } : information.center)
          .addTo(map)

        map.flyTo({
          center: information.center.lat > 90 ? {
            lat: information.center.lng,
            lng: information.center.lat,
          } : information.center,
          zoom: 17,
          duration: 2000
        });
      })

      map.on('zoom', () => {
        const currentZoom = map.getZoom();

        if (currentZoom >= 14) {
          if (!map.getLayer('landPlots')) {
            addLandPlotsLayer()
          }
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
        }
        else if (currentZoom > 9 && currentZoom <= 14) {
          if (map.getLayer('district-borders')) {
            map.removeLayer('district-borders')
          }
          if (map.getSource('district-borders')) {
            map.removeSource('district-borders');
          }
          if (map.getLayer('district-fills')) {
            map.removeLayer('district-fills')
          }
          if (map.getSource('district-fills')) {
            map.removeSource('district-fills');
          }
          if (map.getLayer('outline')) {
            map.removeLayer('outline')
          }
          if (map.getSource('outline')) {
            map.removeSource('outline');
          }
          if (map.getLayer('landPlots')) {
            map.removeLayer('landPlots')
          }
          if (map.getSource('landPlots')) {
            map.removeSource('landPlots');
          }
          if (!map.getLayer('geolocations')) {
            addGeolocationLayer()
          }
        }
        else if (currentZoom < 9) {
          if (!map.getLayer("district-fills")) {
            map.addLayer({
              id: "district-fills",
              type: "fill",
              source: "district",
              layout: {},
              paint: {
                "fill-color": "#fff",
                "fill-opacity": [
                  "case",
                  ["boolean", ["feature-state", 'hover'], false],
                  0.7,
                  0.5
                ]
              }
            })

            map.addLayer({
              id: "district-borders",
              type: "line",
              source: "district",
              layout: {},
              paint: {
                "line-color": "#fff",
                "line-width": 2
              }
            })
          }

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
        }
      });
    });

    return () => map.remove();
  }, []);

  return (
    <div className='relative w-full h-screen'>
      {showModal && (
        <ModalDetail
          data={data}
          setShowModal={setShowModal}
          setShowActivities={setShowActivities}
        />
      )}
      {showActivities && (
        <ModalActivities
          data={data}
          setShowActivities={setShowActivities}
          setShowDetailActivity={setShowDetailActivity}
        />
      )}
      {/* {showDetailActivity && (
        <ModalDetailActivity
          data={data}
          setShowDetailActivity={setShowDetailActivity}
        />
      )} */}
      <div id='map' style={{ width: '100vw', height: '100vh' }}></div>
    </div>
  );
}
