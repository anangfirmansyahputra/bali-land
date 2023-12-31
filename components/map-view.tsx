"use client";

import badung from "@/data/badung.json";
import extendedMasking from "@/data/extended-masking.json";
import masking from "@/data/masking.json";
import supabase from "@/supabase";
import { ChevronUp } from "lucide-react";
import mapboxgl, { Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import wkx from "wkx";
import InfoPanel from "./info-panel";
import Menubar from "./menu-bar";
import PlotPopup from "./plot-popup";
import PlotPopUpMobile from "./plot-popup-mobile";
import InfoPanelSkeleton from "./skeleton/info-panel-skeleton";
import MenuBarSkeleton from "./skeleton/menu-bar-skeleton";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardHeader } from "./ui/card";
import { useRouter } from "next/navigation";

export default function MapView() {
  const router = useRouter()
  
  
  const [instanceMap, setInstanceMap] = useState<Map>();
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [plots, setPlots] = useState<any[]>([]);
  const [plotActive, setPlotActive] = useState<number | null>(null);
  const [zoneActive, setZoneActive] = useState<string>("all");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [popupActive, setPopupActive] = useState<any | null>(null);
  const [isDrag, setIsDrag] = useState(false)
  let activePopup: mapboxgl.Popup | null = null;
  let markers: any[] = [];
  let activeMarker:any | null = null;

  let hoveredPolygonIdDistrict: any = null;
  let hoveredPolygonIdPlot: string | number | null = null;

  const getDataBadung = async (map: Map) => {
    const { data: badung } = await supabase.from("badung_districts").select();

    map.addSource("badung-district", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: badung,
      },
    } as mapboxgl.GeoJSONSourceRaw);

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
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.5,
        ],
      },
    });

    map.addLayer({
      id: "badung-district-borders",
      type: "line",
      source: "badung-district",
      layout: {},
      maxzoom: 14,
      minzoom: 10,
      paint: {
        "line-color": "#fff",
        "line-width": 2,
      },
    });

    map.on("mousemove", "badung-district-fills", (e) => {
      if (e.features?.length || 0 > 0) {
        if (hoveredPolygonIdDistrict !== null) {
          map.setFeatureState(
            { source: "badung-district", id: hoveredPolygonIdDistrict },
            { hover: false }
          );
        }

        if (e.features) {
          hoveredPolygonIdDistrict = e.features[0].id;
        }
        map.setFeatureState(
          { source: "badung-district", id: hoveredPolygonIdDistrict },
          { hover: true }
        );
      }
    });

    map.on("mouseleave", "badung-district-fills", () => {
      if (hoveredPolygonIdDistrict !== null) {
        map.setFeatureState(
          { source: "badung-district", id: hoveredPolygonIdDistrict },
          { hover: false }
        );
      }
      hoveredPolygonIdDistrict = null;
    });

    map.on("mouseenter", "badung-district-fills", function () {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "badung-district-fills", function () {
      map.getCanvas().style.cursor = "auto";
    });
  };

  const getDataZoningArea = async (map: Map) => {
    let data: any = [];
    let start = 0;
    let size = 1000;
    let hasMore = true;

    while (hasMore) {
      const {
        data: plots,
        error,
        count,
      } = await supabase
        .from("zoning_areas")
        .select("*", { count: "exact" })
        .range(start, start + size - 1);

      if (error) throw error;

      data = [...data, ...plots];
      start += size;
      hasMore = (count ?? 0) > start;
    }

    map.addSource("zoning_areas", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: data.map((item: any) => {
          const information = JSON.parse(item.information);

          return {
            type: "Feature",
            geometry: wkx.Geometry.parse(
              Buffer.from(item.zoning_geom, "hex")
            ).toGeoJSON(),
            properties: {
              zoneCode: item.zone_code,
              color:
                information.zone.color.replaceAll(" ", ",").split(",")
                  .length === 3
                  ? `rgb(${information.zone.color.replaceAll(" ", ",")})`
                  : `rgba(${information.zone.color.replaceAll(" ", ",")})`,
            },
          };
        }),
      },
    });

    map.addLayer({
      id: "zoning_areas_fills",
      type: "fill",
      source: "zoning_areas",
      layout: {},
      minzoom: 14,
      paint: {
        "fill-color": [
          "case",
          ["==", zoneActive, "all"],
          ["get", "color"],
          [
            "case",
            ["==", ["get", "zoneCode"], zoneActive],
            ["get", "color"],
            "transparent",
          ],
        ],
        "fill-opacity": 0.3,
      },
    });

    map.addLayer({
      id: "zoning_areas_outline",
      type: "line",
      source: "zoning_areas",
      layout: {},
      minzoom: 14,
      paint: {
        "line-color": [
          "case",
          ["==", zoneActive, "all"],
          ["get", "color"],
          [
            "case",
            ["==", ["get", "zoneCode"], zoneActive],
            ["get", "color"],
            "transparent",
          ],
        ],
        "line-opacity": 1,
      },
    });
  };

  const getDataLandplots = async () => {
    let data: any = [];
    let start = 0;
    let size = 1000;
    let hasMore = true;

    while (hasMore) {
      const {
        data: plots,
        error,
        count,
      } = await supabase
        .from("plots")
        .select("*", { count: "exact" })
        .range(start, start + size - 1);

      if (error) throw error;

      data = [...data, ...plots];
      start += size;
      hasMore = (count ?? 0) > start;
    }

    setPlots(data);
  };

  const getDataNearby = async (
    longitude: number,
    latitude: number,
    distance: number,
    map: Map,
    zoom: number
  ) => {
    setIsDrag(true);
    for (const marker of markers) {
      if (activeMarker !== null) {
        if (marker !== activeMarker) {
          marker.remove();
        }
      } else {
        marker.remove();
      }
    }

    let data: any[] = [];
    let start = 0;
    let size = 1000;
    let hasMore = true;

    if (zoom > 13) {   
      while (hasMore) {
        const {
          data: plots,
          error,
          count,
        } = await supabase
          .rpc("get_data_nearby", {
            longitude,
            latitude,
            distance: zoom > 13 ? 1000 : 800 
          })
          .select("*")
          .range(start, start + size - 1);
  
        if (error) throw error;
  
        data = [...data, ...plots];
        start += size;
        hasMore = (count ?? 0) > start;
      }
    } else {
      const {data:far} = await supabase.rpc('get_data_farthest', {
        longitude,
        latitude,
        limit: zoom > 12 ? 30 : 5,
      })

      data = far
    }

    if (data.length <= 4) {
      const {data:far} = await supabase.rpc('get_data_farthest', {
        longitude,
        latitude,
        limit: 30,
      })

      data = far
    }

    if (map.getLayer('plots-fills')) {
      map.removeLayer('plots-fills');
    }
    if (map.getLayer('plots-outline')) {
      map.removeLayer('plots-outline');
    }
    if (map.getSource('plots')) {
      map.removeSource('plots');
    }

    map.addSource("plots", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: data?.map((item: any) => {
          return {
            type: "Feature",
            geometry: item.geometry,
            properties: {
              center: wkx.Geometry.parse(
                Buffer.from(item.center, "hex")
              ).toGeoJSON(),
              id: item.id,
            },
          };
        }),
      },
    } as mapboxgl.GeoJSONSourceRaw);

    map.addLayer({
      id: "plots-fills",
      type: "fill",
      source: "plots",
      minzoom: 14,
      paint: {
        "fill-color": "#4B0082",
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.7,
          0.5,
        ],
      },
    });

    map.addLayer({
      id: "plots-outline",
      type: "line",
      minzoom: 14,
      source: "plots",
      layout: {},
      paint: {
        "line-color": "#fff",
        "line-width": 2,
      },
    });

    map.on("mouseenter", "plots-fills", function () {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "plots-fills", function () {
      map.getCanvas().style.cursor = "auto";
    });

    data.forEach((plot: any) => {
      const center = wkx.Geometry.parse(
        Buffer.from(plot.center, "hex")
      ).toGeoJSON();
      const randomPrice = Math.floor(Math.random() * (1000 - 150 + 1)) + 150;
      const randomNum = Math.random() < 0.5 ? 1 : 0;
      let randomMarker;

      if (randomNum === 1) {
        const customMarker = document.createElement("div");
        customMarker.className = "custom-marker";
        customMarker.innerHTML = `$${randomPrice}K`;
        customMarker.dataset.plotId = plot.id;
        randomMarker = customMarker;
      } else {
        const customMarker = document.createElement("div");
        customMarker.className = "custom-marker-hidden";
        customMarker.innerHTML = `$${randomPrice}K`;
        customMarker.dataset.plotId = plot.id;
        randomMarker = customMarker;
      }

      const marker = new mapboxgl.Marker({
        element: randomMarker,
      })
        .setLngLat((center as any).coordinates)
        .addTo(map);
      
      markers.push(marker);
      marker.getElement().addEventListener("click", function () {
        if (activePopup) {
          activePopup.remove();
        }
        setPlotActive(plot.id);
        activeMarker = marker;

        if (isMobile) {
          const data = {
            ...plot,
            price: randomPrice,
            onClose: () => {
              setPopupActive(null);
              setPlotActive(null);
            },
          };
          setPopupActive(data);
        }

        if (!isMobile) {
          // setShowInfoPanel(false);

          const data = {
            ...plot,
            price: randomPrice,
          };
          const container = document.createElement("div");
          const popup = new mapboxgl.Popup({
            closeOnClick: false,
            closeButton: false,
            offset: 40,
            focusAfterOpen: true,
          }).setLngLat((center as any).coordinates);
          createRoot(container).render(
            <PlotPopup
              handleNavigate={handleNavigate}
              data={data}
              onClose={() => {
                popup.remove();
                setPlotActive(null);
              }}
            />
          );

          popup.setDOMContent(container);

          
          marker.setPopup(popup);

          activePopup = popup;
        }
      });
    });

    setIsDrag(false)
    return data
  };

  const handleMediaQueryChange = (mediaQuery: MediaQueryListEvent) => {
    if (mediaQuery.matches) {
      setIsLoading(true);
      setIsMobile(true);
    } else {
      setIsLoading(true);
      setPopupActive(null);
      setIsMobile(false);
    }
  };

  const handleNavigate = (url: string) => {
    router.push(url);
  }

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || "";
    const mediaQuery = window.matchMedia(`(max-width: 744px)`);
    // @ts-ignore
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addListener(handleMediaQueryChange);

    const map: Map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [115.087004, -8.337301],
      zoom: 9,
      maxBounds: [
        [114.2, -9.1],
        [116.2, -8.2],
      ],
      attributionControl: false
    });

    map.dragPan.disable()

    setInstanceMap(map);

    let hoveredPolygonId: any = null;

    map.on("load", async () => {
      await getDataBadung(map);
      await getDataZoningArea(map);
      await getDataLandplots();

      const zoom = map.getZoom();
        const { lat, lng } = map.getCenter();
        await getDataNearby(lng, lat, 1000, map, zoom);

      map.getCanvas().style.cursor = "auto";

      // Masking
      map.addLayer({
        id: "masking-layer",
        type: "fill",
        source: {
          type: "geojson",
          data: masking,
        },
        layout: {},
        paint: {
          "fill-color": "#fff",
          "fill-opacity": 1,
        },
      } as mapboxgl.AnyLayer );

      // Regency
      map.addSource("regency", {
        type: "geojson",
        data: badung,
      } as any);

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
            ["boolean", ["feature-state", "hover"], false],
            0.7,
            0.5,
          ],
        },
      });

      map.addLayer({
        id: "regency-borders",
        type: "line",
        minzoom: 6,
        maxzoom: 10,
        source: "regency",
        layout: {},
        paint: {
          "line-color": "#4B0082",
          "line-width": 2,
        },
      });

      // Extended Masking
      map.addLayer({
        id: "masking-extended",
        type: "fill",
        source: {
          type: "geojson",
          data: extendedMasking,
        },
        layout: {},
        paint: {
          "fill-color": "#fff",
        },
      } as mapboxgl.AnyLayer);

      map.on("mousemove", "regency-fills", (e) => {
        if (e.features?.length || 0 > 0) {
          if (hoveredPolygonId !== null) {
            map.setFeatureState(
              { source: "regency", id: hoveredPolygonId },
              { hover: false }
            );
          }

          if (e.features) {
            hoveredPolygonId = e.features[0].id;
          }
          map.setFeatureState(
            { source: "regency", id: hoveredPolygonId },
            { hover: true }
          );
        }
      });

      map.on("mouseleave", "regency-fills", () => {
        if (hoveredPolygonId !== null) {
          map.setFeatureState(
            { source: "regency", id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = null;
      });

      map.on("mouseenter", "regency-fills", function () {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "regency-fills", function () {
        map.getCanvas().style.cursor = "auto";
      });

      setIsLoading(false);

      map.on('zoom', async () => {
        const zoom = map.getZoom();
        const { lat, lng } = map.getCenter();
        await getDataNearby(lng, lat, 1000, map, zoom);
      })

      map.on("dragend", async () => {
        const { lat, lng } = map.getCenter();
        const zoom = map.getZoom()  
        await getDataNearby(lng, lat, 1000, map, zoom);
      });
      map.dragPan.enable()
    });

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
      map.remove();
    };
  }, [isMobile]);

  useEffect(() => {
    const markers = document.getElementsByClassName("custom-marker");
    const markersHidden = document.getElementsByClassName(
      "custom-marker-hidden"
    );
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];

      const isActive =
        plotActive &&
        Number((marker as HTMLElement).dataset.plotId) === plotActive;

      if (isActive) {
        marker.classList.add("active-marker");
      } else {
        marker.classList.remove("active-marker");
      }
    }

    for (let i = 0; i < markersHidden.length; i++) {
      const marker = markersHidden[i];

      const isActive =
        plotActive &&
        Number((marker as HTMLElement).dataset.plotId) === plotActive;

      if (isActive) {
        marker.classList.add("active-marker");
      } else {
        marker.classList.remove("active-marker");
      }
    }
  }, [plotActive]);

  return (
    <>
      <div className="relative w-full h-screen">
          {isLoading ? (
            <MenuBarSkeleton />
          ) : (
            instanceMap && 
            <Menubar setZoneActive={setZoneActive} map={instanceMap} />
          )}
          {isLoading ? (
            <InfoPanelSkeleton />
          ) : (
            showInfoPanel && <InfoPanel
              plots={plots}
              setShowInfoPanel={setShowInfoPanel}
            />
          )}
          <Card className="fixed right-3 left-3 bottom-0 z-[51] lg:w-[60%] xl:w-[50%] 2xl:w-[30%]">
            <CardHeader className="p-2" onClick={() => setShowInfoPanel(true)}>
              <Button variant={"ghost"}>
                <ChevronUp />
              </Button>
            </CardHeader>
          </Card>
        {isDrag && <Badge className="absolute z-[999] left-1/2 transform -translate-x-1/2 top-7 sm:top-[88px] bg-black px-5 py-2">Loading...</Badge> }
        <div id="map" style={{ width: "100vw", height: "100vh" }}></div>
        {isMobile && popupActive && <PlotPopUpMobile data={popupActive} />}
      </div>
    </>
  );
}
