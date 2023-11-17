import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, X } from "lucide-react";
import wkx from "wkx";
import LandplotCard from "./landplot-card";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface InfoPanelProps {
  setShowInfoPanel: React.Dispatch<React.SetStateAction<boolean>>;
  plots: any[];
}

export default function InfoPanel({
  setShowInfoPanel,
  plots,
}: InfoPanelProps) {
  const [displayedPlots, setDisplayedPlots] = useState(10);
  const popupRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShow(false)
        setTimeout(() => {
          setShowInfoPanel(false);
        }, 500)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowInfoPanel]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

    if (scrollTop + clientHeight + 2 > scrollHeight) {
      setDisplayedPlots((prevDisplayedPlots) => prevDisplayedPlots + 10);
    }
  };

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Card
      role="button"
      className={cn(
        `fixed transition-all ease-in-out duration-300 z-[60] h-[calc(100vh-10px)] sm:h-[calc(100vh-88px)] lg:w-[60%] xl:w-[50%] 2xl:w-[30%] mt-[88px] left-3 right-3`,
        show ? "top-0" : "top-full"
      )}
    >
      <CardHeader className="py-2 px-1">
        <div className={`flex items-center justify-between`}>
          <CardTitle className="ml-4">Info Panel</CardTitle>
          <Button
            onClick={() => {
              setShow(false);
              setTimeout(() => {
                setShowInfoPanel(false);
              }, 500);
            }}
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
          <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
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
  );
}
