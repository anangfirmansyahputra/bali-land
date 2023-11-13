"use client";

import supabase from "@/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Map } from "mapbox-gl";
import { Button } from "./ui/button";
import { LandPlot, SlidersHorizontal } from "lucide-react";

interface ZoneFilterProps {
  setZoneActive: React.Dispatch<React.SetStateAction<string>>;
  map: Map
}

export default function ZoneFilter({ setZoneActive, map }: ZoneFilterProps) {
  const [zoneCode, setZoneCode] = useState<any[]>([]);

  const getData = async () => {
    const { data, error } = await supabase.rpc("get_unique_zoning_areas", {});
    setZoneCode(data);
  };

  const handleZoneActiveChange = (newZoneActive: string) => {
    // Mengatur nilai zoneActive ke newZoneActive
    setZoneActive(newZoneActive);

    // Memanggil map.setFilter dengan filter yang diperbarui
    if (map) {
      map.setFilter("zoning_areas_fills", [
        "case",
        ["==", newZoneActive, "all"],
        true,
        ["==", ["get", "zoneCode"], newZoneActive],
      ]);

      map.setFilter("zoning_areas_outline", [
        "case",
        ["==", newZoneActive, "all"],
        true,
        ["==", ["get", "zoneCode"], newZoneActive],
      ]);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild className="hidden sm:inline">
        <Button variant={"ghost"}>Zone Filter</Button>
      </DialogTrigger>
      <DialogTrigger className="block sm:hidden">
      <Button size={"icon"} variant={"secondary"} className="rounded-full">
          <LandPlot />
        </Button>
      </DialogTrigger>
      <DialogContent className="z-[999]">
        <DialogHeader className="border-b">
          <DialogTitle className="text-center pb-2">Filters</DialogTitle>
        </DialogHeader>
          <Select onValueChange={e => handleZoneActiveChange(e)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select zone" />
            </SelectTrigger>
            <SelectContent className="z-[999]">
              <SelectItem value="all">All</SelectItem>
              {zoneCode &&
                zoneCode.map((item: any) => (
                  <SelectItem value={item.zone_code} key={item.zone_code}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
      </DialogContent>
    </Dialog>
  );
}
