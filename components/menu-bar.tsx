import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Map } from "mapbox-gl";
import FilterSheet from "@/components/filter-sheet";
import { Button } from "@/components/ui/button";

interface MenubarProps {
  setZoneActive: React.Dispatch<React.SetStateAction<string>>;
  map: Map;
}

export default function Menubar({ setZoneActive, map }: MenubarProps) {
  return (
    <div className="absolute z-[53] w-full">
      <div className="m-3 hidden sm:flex items-center gap-5 justify-end sm:justify-between h-full">
        <div className="shadow-xl bg-white p-3 flex-1 rounded-lg hidden sm:flex items-center justify-between">
          <h1 className="text-slate-800 text-base lg:text-2xl font-extrabold">
            Island.Properties
          </h1>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="mr-2">
                <Button variant={"ghost"} className="font-bold">
                  Service <ChevronDown size={20} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-3">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className="font-bold">Add to your property</Button>
          </div>
        </div>
        <FilterSheet />
      </div>
      <div className="w-fit fixed right-3 top-6 sm:hidden flex gap-2">
        <FilterSheet />
      </div>
    </div>
  );
}
