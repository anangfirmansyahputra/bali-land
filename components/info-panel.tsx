import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, X } from "lucide-react";
import wkx from "wkx";
import LandplotCard from "./landplot-card";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";

interface InfoPanelProps {
  // map: Map;
  setShowInfoPanel: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  plots: any[];
}

export default function InfoPanel({
  // map,
  setShowInfoPanel,
  isActive,
  plots,
}: InfoPanelProps) {
  const [displayedPlots, setDisplayedPlots] = useState(10);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
      
    if ((scrollTop + clientHeight + 2) >  scrollHeight) {
      setDisplayedPlots(prevDisplayedPlots => prevDisplayedPlots + 10);
    }
  };
  
  // if (map) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="child"
          initial={{ opacity: 0, y: 100 }} // Muncul dari bawah dengan perubahan posisi y sebesar 20
          animate={{ opacity: 1, y: 0 }} // Tampil normal tanpa perubahan posisi y
          exit={{ opacity: 0, y: -100 }} // Menghilang ke atas dengan perubahan posisi y sebesar -20
          transition={{ duration: 0.1 }}
          className="fixed z-[52] h-[calc(100vh-10px)] max-w-max sm:h-[calc(100vh-88px)] lg:w-[60%] xl:w-[50%] 2xl:w-[30%] top-0 mt-[88px] left-3 right-3 "
        >
          <Card
            role="button"
            className={`flex flex-col rounded-none rounded-t-lg`}
          >
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
            <CardContent
              onScroll={handleScroll}
              className={`space-y-2 p-0 pr-2 xs:pr-5 h-[calc(100vh-150px)] sm:h-[calc(100vh-88px)] overflow-y-auto mx-4`}
            >
              {/* @ts-ignore */}
              {plots.slice(0, displayedPlots).map((plot: any) => {
                const center = wkx.Geometry.parse(
                  Buffer.from(plot.center, "hex")
                ).toGeoJSON();

                return (
                  <LandplotCard
                    key={plot.id}
                    // @ts-ignore
                    center={center.coordinates}
                    // map={map}
                  />
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
  // }
}
