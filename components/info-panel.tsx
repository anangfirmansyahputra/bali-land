import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, X } from "lucide-react";
import wkx from "wkx";
import LandplotCard from "./landplot-card";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

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
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowInfoPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    
  }, [setShowInfoPanel]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
      
    if ((scrollTop + clientHeight + 2) >  scrollHeight) {
      setDisplayedPlots(prevDisplayedPlots => prevDisplayedPlots + 10);
    }
  };
  
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          ref={popupRef}
          key="child"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.1 }}
          className="fixed z-[60] h-[calc(100vh-10px)] sm:h-[calc(100vh-88px)] lg:w-[60%] xl:w-[50%] 2xl:w-[30%] bottom-0 top-0 mt-[88px] left-3 right-3 "
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
            <CardContent className="p-0 pl-5 pr-4">
              <ScrollArea 
                className="w-full h-[calc(100vh-150px)] sm:h-[calc(100vh-150px)] pr-5"
                onScroll={handleScroll}
              >
              <div
                className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5"
              >
                {plots.slice(0, displayedPlots).map((plot: any) => {
                  const center = wkx.Geometry.parse(
                    Buffer.from(plot.center, "hex")
                  ).toGeoJSON();
                  return (
                    <LandplotCard
                      key={plot.id}
                      center={(center as any).coordinates}
                    />
                  );
                })}
              </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
  // }
}

