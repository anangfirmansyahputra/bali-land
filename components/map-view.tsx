"use client"

import badung from '@/data/badung.json';
import extendedMasking from '@/data/extended-masking.json';
import landPlots2 from '@/data/land-plots.json';
import masking from '@/data/masking.json';
import supabase from '@/supabase';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import InfoPanel from './info-panel';
import Loading from './loading';
import Menubar from './menu-bar';

export default function MapView() {
  const [instanceMap, setInstanceMap] = useState<Map>();
  const [showInfoPanel, setShowInfoPanel] = useState<Boolean>(true)
  const [isLoading, setIsLoading] = useState<Boolean>(true)
  // @ts-ignore
  let hoveredPolygonIdDistrict = null;

  const getDataBadung = async (map: Map) => {
    const { data: badung } = await supabase.from('badung_districts').select();

    // Badung village
    map.addSource('badung-district', {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        // @ts-ignore
        features: badung,
      }
    })

    map.addLayer({
      id: "badung-district-fills",
      type: "fill",
      source: "badung-district",
      minzoom: 10,
      maxzoom: 14,
      layout: {},
      paint: {
        "fill-color": "#4B0082",
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", 'hover'], false],
          0.7,
          0.5
        ]
      }
    })

    map.addLayer({
      id: "badung-district-borders",
      type: "line",
      source: "badung-district",
      layout: {},
      maxzoom: 14,
      minzoom: 10,
      paint: {
        "line-color": "#fff",
        "line-width": 2
      }
    })

    map.on('mousemove', 'badung-district-fills', (e) => {
      if (e.features?.length || 0 > 0) {
        // @ts-ignore
        if (hoveredPolygonIdDistrict !== null) {
          map.setFeatureState(
            // @ts-ignore
            { source: "badung-district", id: hoveredPolygonIdDistrict },
            { hover: false }
          )
        }

        // @ts-ignore
        hoveredPolygonIdDistrict = e.features[0].id
        map.setFeatureState(
          { source: "badung-district", id: hoveredPolygonIdDistrict },
          { hover: true }
        )
      }
    })

    map.on('mouseleave', 'badung-district-fills', () => {
      // @ts-ignore
      if (hoveredPolygonIdDistrict !== null) {
        map.setFeatureState(
          // @ts-ignore
          { source: 'badung-district', id: hoveredPolygonIdDistrict },
          { hover: false }
        )
      }
      hoveredPolygonIdDistrict = null;
    })

    map.on('mouseenter', 'badung-district-fills', function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'badung-district-fills', function () {
      map.getCanvas().style.cursor = 'auto';
    });

    map.on('click', 'badung-district-fills', function (e: any) {
      const clickedFeature = e.features[0];

      if (clickedFeature) {
        map.flyTo({
          center: e.lngLat,
          zoom: 15,
        });
      }
    });
  }

  const getDataLandplots = async (map: Map) => {
    // Land Plots
    map.addSource('landPlots', {
      'type': 'geojson',
      // @ts-ignore
      data: {
        type: "FeatureCollection",
        // @ts-ignore
        features: landPlots2.map((landPlot) => {
          const zoneCode = landPlot.territorials.geom[0].zone.code;
          const territorials = JSON.parse(landPlot?.territorials?.geom?.[0]?.geojson);
          // @ts-ignore
          const certificate = JSON.parse(landPlot?.certificate)
          let polygon;

          if (zoneCode === "BJ" || zoneCode === "BA" || zoneCode === "SS") {
            polygon = territorials
          } else {
            polygon = certificate?.features?.[0]?.geometry || null
          }

          if (polygon !== undefined && polygon !== null) {
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
              geometry: polygon
            };
          }
          return null;
        }).filter((feature: any) => feature !== null)
      }
    });

    map.addLayer({
      id: 'landPlots',
      type: 'fill',
      source: 'landPlots',
      layout: {},
      minzoom: 14,
      paint: {
        'fill-color': [
          'case',
          ['==', ['get', 'zoneCode'], 'BA'], '#192bc2',
          ['==', ['get', 'zoneCode'], 'BJ'], '#de0a26',
          ['==', ['get', 'zoneCode'], 'SS'], '#192bc2',
          '#4B0082'
        ],
        'fill-opacity': 0.5,
      },
    });

    map.addLayer({
      id: 'outline',
      type: 'line',
      minzoom: 14,
      source: 'landPlots',
      layout: {},
      paint: {
        'line-color': [
          'case',
          ['==', ['get', 'zoneCode'], 'BA'], '#192bc2',
          ['==', ['get', 'zoneCode'], 'BJ'], '#de0a26',
          ['==', ['get', 'zoneCode'], 'SS'], '#192bc2',
          "#fff"
        ],
        'line-width': 2,
      },
    });

    map.on('mouseenter', 'landPlots', function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'landPlots', function () {
      map.getCanvas().style.cursor = 'auto';
    });

    map.on('click', 'landPlots', (e: any) => {
      const information = JSON.parse(e.features[0].properties.data);

      map.flyTo({
        center: information.center.lat > 90 ? {
          lat: information.center.lng,
          lng: information.center.lat,
        } : information.center,
        zoom: 18,
        duration: 2000
      });
    })

    // @ts-ignore
    landPlots2.forEach((landPlot) => {
      // @ts-ignore
      const center = parseFloat(landPlot.center.lat) < 0 ? [
        parseFloat(landPlot.center.lng),
        landPlot.center.lat,
      ] : [landPlot.center.lat, parseFloat(landPlot.center.lng)]

      const randomPrice = Math.floor(Math.random() * (1000 - 150 + 1)) + 150

      const customMarker = document.createElement('div');
      customMarker.className = "custom-marker";
      customMarker.innerHTML = `$${randomPrice}K`;

      const marker = new mapboxgl.Marker({
        element: customMarker,
        anchor: "bottom"
      })
        // @ts-ignore
        .setLngLat(center)
        .addTo(map)

      marker.getElement().addEventListener('click', function () {
        map.flyTo({
          // @ts-ignore
          center: center,
          zoom: 18,
        });
      })

    })
  }

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "";

    const map: Map = new mapboxgl.Map({
      container: "map",
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [115.087004, -8.337301],
      zoom: 9,
      maxBounds: [
        [114.2, -9.1],
        [116.2, -8.2]
      ],
    });

    setInstanceMap(map)

    // @ts-ignore
    let hoveredPolygonId = null;

    map.on('load', () => {
      getDataBadung(map)
      getDataLandplots(map)

      setIsLoading(false)

      map.getCanvas().style.cursor = 'auto';

      // Masking
      map.addLayer({
        id: "masking-layer",
        type: "fill",
        source: {
          type: "geojson",
          // @ts-ignore
          data: masking

        },
        layout: {},
        paint: {
          "fill-color": "#fff",
          "fill-opacity": 1
        }
      })

      // Regency
      map.addSource('regency', {
        type: "geojson",
        // @ts-ignore
        data: badung
      })

      map.addLayer({
        id: "regency-fills",
        type: "fill",
        source: "regency",
        layout: {},
        minzoom: 6,
        maxzoom: 10,
        paint: {
          "fill-color": "#4B0082",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", 'hover'], false],
            0.7,
            0.5
          ]
        }
      })

      map.addLayer({
        id: "regency-borders",
        type: "line",
        minzoom: 6,
        maxzoom: 10,
        source: "regency",
        layout: {},
        paint: {
          "line-color": "#4B0082",
          "line-width": 2
        }
      })

      // Traffic
      map.addLayer({
        id: "traffic-layer",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [
                [
                  -9.015302333420587,
                  114.60937499999999
                ],
                [
                  -8.971897294083012,
                  115.75195312500001
                ]
              ]
            }
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': "#ff0000",
          "line-width": 5
        }
      });

      // Extended Masking
      map.addLayer({
        id: "masking-extended",
        type: "fill",
        source: {
          type: "geojson",
          // @ts-ignore
          data: extendedMasking
        },
        layout: {},
        paint: {
          "fill-color": "#fff",
        }
      })

      map.on('mousemove', 'regency-fills', (e) => {
        if (e.features?.length || 0 > 0) {
          // @ts-ignore
          if (hoveredPolygonId !== null) {
            map.setFeatureState(
              // @ts-ignore
              { source: "regency", id: hoveredPolygonId },
              { hover: false }
            )
          }
          // @ts-ignore
          hoveredPolygonId = e.features[0].id
          map.setFeatureState(
            { source: "regency", id: hoveredPolygonId },
            { hover: true }
          )
        }
      })

      map.on('mouseleave', 'regency-fills', () => {
        // @ts-ignore
        if (hoveredPolygonId !== null) {
          map.setFeatureState(
            // @ts-ignore
            { source: 'regency', id: hoveredPolygonId },
            { hover: false }
          )
        }
        hoveredPolygonId = null;
      })

      map.on('mouseenter', 'regency-fills', function () {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'regency-fills', function () {
        map.getCanvas().style.cursor = 'auto';
      });

      map.on('click', 'regency-fills', function (e: any) {
        const clickedFeature = e.features[0];

        if (clickedFeature) {
          map.flyTo({
            center: e.lngLat,
            zoom: 10,
          });
        }
      });
    });

    return () => map.remove();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <div className='relative w-full h-screen'>
        <Menubar
          setShowInfoPanel={setShowInfoPanel}
        />
        {showInfoPanel && (
          <InfoPanel
            // @ts-ignore
            map={instanceMap}
            isActive={showInfoPanel}
            setShowInfoPanel={setShowInfoPanel}
          />
        )}
        <div id='map' style={{ width: '100vw', height: '100vh' }}></div>
      </div>
    </>
  );
}
