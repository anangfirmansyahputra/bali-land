"use client"

import badungDistrict from '@/data/badung-district.json';
import badung from '@/data/badung.json';
import extendedMasking from '@/data/extended-masking.json';
import landPlots2 from '@/data/land-plots.json';
import masking from '@/data/masking.json';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import InfoPanel from './info-panel';
import Menubar from './menu-bar';

export default function MapView() {
  const [instanceMap, setInstanceMap] = useState<Map>();
  const [showInfoPanel, setShowInfoPanel] = useState<Boolean>(true)

  const draw = new MapboxDraw();

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
    // @ts-ignore
    let hoveredPolygonIdDistrict = null;

    map.on('load', () => {
      map.getCanvas().style.cursor = 'auto';

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

      // Masking
      map.addSource('masking', {
        type: "geojson",
        // @ts-ignore
        data: masking
      })

      map.addLayer({
        id: "masking-layer",
        type: "fill",
        source: "masking",
        layout: {},
        paint: {
          "fill-color": "#fff",
          "fill-opacity": 1
        }
      })

      // District
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
        id: "district-borders",
        type: "line",
        minzoom: 6,
        maxzoom: 10,
        source: "district",
        layout: {},
        paint: {
          "line-color": "#4B0082",
          "line-width": 2
        }
      })

      // Badung village
      map.addSource('badung-district', {
        type: "geojson",
        // @ts-ignore
        data: badungDistrict,
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
          hoveredPolygonId = e.features[0].id
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

      map.on('mouseenter', 'landPlots', function () {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'landPlots', function () {
        map.getCanvas().style.cursor = 'auto';
      });

      map.on('mouseenter', 'badung-district-fills', function () {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'badung-district-fills', function () {
        map.getCanvas().style.cursor = 'auto';
      });

      map.on('mouseenter', 'district-fills', function () {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'district-fills', function () {
        map.getCanvas().style.cursor = 'auto';
      });

      map.on('click', 'district-fills', function (e: any) {
        const clickedFeature = e.features[0];

        if (clickedFeature) {
          map.flyTo({
            center: e.lngLat,
            zoom: 10,
          });
        }
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

        // const popup = new mapboxgl.Popup({
        //   closeButton: false,
        //   closeOnClick: false,
        //   className: "custom-popup",
        // })
        //   // @ts-ignore
        //   .setLngLat(center)
        //   .setHTML(`
        //     <div class="custom-popup-container">
        //       <div>$${randomPrice}K</div>
        //       <div class="land-card">
        //         <img src="/assets/vila.jpg" class="land-card-img" />
        //         <div class="land-card-content">
        //           <div>
        //             <div>&${randomPrice},000</div>
        //             <div>123</div>
        //           </div>
        //           <div>Cozy 2 bedroom villa</div>
        //           <div>
        //             <div>
        //               <div>
        //               </div>
        //               <div>0 1 2 3 4 5</div>
        //             </div>
        //             <div>
        //               <div>
        //               </div>
        //               <div>0 1 2 3 4 5</div>
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   `)
        //   .addTo(map)

        marker.getElement().addEventListener('click', function () {
          map.flyTo({
            // @ts-ignore
            center: center,
            zoom: 18,
          });
        })

      })
    });

    return () => map.remove();
  }, []);

  return (
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
  );
}
