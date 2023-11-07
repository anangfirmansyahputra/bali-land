import landPlot from '@/data/land-plots.json';
import {
  X,
  ChevronUp
} from 'lucide-react';
import { Map } from "mapbox-gl";
import LandplotCard from "./landplot-card";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "./ui/card";
import { motion } from "framer-motion";

interface InfoPanelProps {
  map: Map;
  setShowInfoPanel: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
}

export default function InfoPanel({
  map,
  setShowInfoPanel,
  isActive

}: InfoPanelProps) {

  if (map) {

    return (
      <Card role='button' className={`fixed z-[50] h-[calc(100vh-10px)] max-w-max sm:h-[calc(100vh-88px)] lg:w-[60%] xl:w-[50%] 2xl:w-[30%] ${!isActive ? "top-[calc(100%-56px)]" : "top-0 mt-[88px]"} transition-all duration-500 left-3 right-3 flex flex-col rounded-none rounded-t-lg`}>
        {!isActive && (
          <CardHeader className='p-2' onClick={() => setShowInfoPanel(true)}>
            <Button variant={"ghost"}>
              <ChevronUp />
            </Button>
          </CardHeader>
        )}
        {isActive && (
          <CardHeader className='py-2 px-6'>
            <div className={`flex items-center justify-between`}>
              <CardTitle>Info Panel</CardTitle>
              <Button onClick={() => setShowInfoPanel(false)} size={"icon"} variant={"ghost"} className="rounded-full">
                <X />
              </Button>
            </div>
          </CardHeader>
        )}
        <CardContent className={`space-y-2 overflow-y-auto`}>
          {/* @ts-ignore */}
          {landPlot.map((landPlot) => {
            const center: [any, any] = parseFloat(landPlot.center.lat) < 0 ? [
              parseFloat(landPlot.center.lng),
              landPlot.center.lat,
            ] : [landPlot.center.lat, parseFloat(landPlot.center.lng)]

            return (
              <LandplotCard
                key={landPlot.id}
                center={center}
                map={map}
              />
            )
          }
          )}
        </CardContent>
      </Card>
    )
  }
}
