import { X, ChevronUp } from "lucide-react";
import { Map } from "mapbox-gl";
import LandplotCard from "./landplot-card";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import wkx from "wkx";

interface InfoPanelProps {
  map: Map;
  setShowInfoPanel: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  plots: any[];
}

export default function InfoPanel({
  map,
  setShowInfoPanel,
  isActive,
  plots,
}: InfoPanelProps) {
  if (map) {
    return (
      <Card
        role="button"
        className={`fixed z-[50] h-[calc(100vh-10px)] max-w-max sm:h-[calc(100vh-88px)] lg:w-[60%] xl:w-[50%] 2xl:w-[30%] ${!isActive ? "top-[calc(100%-56px)]" : "top-0 mt-[88px]"
          } transition-all duration-500 left-3 right-3 flex flex-col rounded-none rounded-t-lg`}
      >
        {!isActive && (
          <CardHeader className="p-2" onClick={() => setShowInfoPanel(true)}>
            <Button variant={"ghost"}>
              <ChevronUp />
            </Button>
          </CardHeader>
        )}
        {isActive && (
          <CardHeader className="py-2 px-1">
            <div className={`flex items-center justify-between`}>
              <CardTitle className="ml-4">Info Panel</CardTitle>
              <Button
                onClick={() => setShowInfoPanel(false)}
                size={"icon"}
                variant={"ghost"}
                className="rounded-full"
              >
                <X />
              </Button>
            </div>
          </CardHeader>
        )}
        <CardContent className={`space-y-2 p-0 pr-5 overflow-y-auto mx-4`}>
          {/* @ts-ignore */}
          {plots.map((plot: any) => {
            const center = wkx.Geometry.parse(
              Buffer.from(plot.center, "hex")
            ).toGeoJSON();

            return (
              <LandplotCard
                key={plot.id}
                // @ts-ignore
                center={center.coordinates}
                map={map}
              />
            );
          })}
        </CardContent>
      </Card>
    );
  }
}
