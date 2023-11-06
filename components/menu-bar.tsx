import { Button } from "./ui/button";
import {
  SlidersHorizontal,
  ChevronDown,
  Info
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FilterSheet from "./filter-sheet";

interface MenubarProps {
  setShowInfoPanel: React.Dispatch<React.SetStateAction<Boolean>>;
}

export default function Menubar({
  setShowInfoPanel
}: MenubarProps) {

  return (
    <div className="absolute z-[50] w-full">
      <div className="m-3 flex items-center gap-5 justify-end sm:justify-between h-full">
        <Button variant={"secondary"} className="rounded-full sm:hidden" size={"icon"} onClick={() => setShowInfoPanel(true)}>
          <Info />
        </Button>
        <div className="shadow-xl bg-white p-3 flex-1 rounded-lg hidden sm:flex items-center justify-between">
          <h1 className="text-slate-800 text-2xl font-extrabold">Island.Properties</h1>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
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
    </div>
  )
}
