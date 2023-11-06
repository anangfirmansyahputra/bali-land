import Image from "next/image";
import { X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "./ui/card";
import { Badge } from '@/components/ui/badge';
import { Map } from "mapbox-gl";
import landPlot from '@/data/land-plots.json';
import { Button } from "./ui/button";

interface InfoPanelProps {
  map: Map;
  setShowInfoPanel: React.Dispatch<React.SetStateAction<Boolean>>;
  isActive: Boolean;
}

export default function InfoPanel({
  map,
  setShowInfoPanel,

}: InfoPanelProps) {
  const handleFly = (center: [number, number]) => {
    map.flyTo({
      center,
      zoom: 18,
    });
  }
  if (map) {

    return (
      <Card className="fadeIn absolute z-[50] h-[calc(100vh-10px)] max-w-max sm:h-[calc(100vh-88px)] lg:w-[60%] xl:w-[50%] 2xl:w-[30%] bottom-0 left-3 right-3 flex flex-col rounded-none rounded-t-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Info Panel</CardTitle>
            <Button onClick={() => setShowInfoPanel(false)} size={"icon"} variant={"ghost"} className="rounded-full">
              <X />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 overflow-y-auto">
          {/* @ts-ignore */}
          {landPlot.map((landPlot) => {
            const center = parseFloat(landPlot.center.lat) < 0 ? [
              parseFloat(landPlot.center.lng),
              landPlot.center.lat,
            ] : [landPlot.center.lat, parseFloat(landPlot.center.lng)]
            const randomPrice = Math.floor(Math.random() * (1000 - 150 + 1)) + 150

            return (
              <div
                key={landPlot.id}
                className="flex space-x-2 w-full border rounded-lg p-2 overflow-hidden items-center cursor-pointer transition-all hover:border-primary"
                // @ts-ignore
                onClick={() => handleFly(center)}
              >
                <div className="aspect-square h-[100px] sm:h-[150px] relative overflow-hidden">
                  <Image src={"/assets/vila.jpg"} alt="vila" fill className="object-cover" />
                </div>
                <div className="space-y-1 flex-1 truncate text-ellipsis  overflow-y-auto">
                  <h1 className="text-base sm:text-xl">Tampaksiring, Indonesia</h1>
                  <p className="text-xs sm:text-sm text-slate-600">Stay with Ari * Hosting for 7 years</p>
                  <div className="space-x-1">
                    <Badge variant={"outline"}>
                      Vila
                    </Badge>
                    <Badge variant={"default"}>
                      ${randomPrice}K
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">Lorem ipsum d sit amet consectetur, adipisicing elit. Officia illo asperiores quod doloremque sit dolorem tempora molestiae eaque. Rerum vitae animi deserunt officiis praesentium laboriosam, architecto placeat quasi, minima aliquam ducimus a nobis recusandae quos? A eligendi neque modi voluptatum deleniti asperiores, ex dolores id, corporis sapiente quaerat minima veniam.</p>
                </div>
              </div>
            )
          }
          )}
        </CardContent>
      </Card>
    )
  }
}
