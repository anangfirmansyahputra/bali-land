import { Button } from "./ui/button";
import {
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function Menubar() {
  return (
    <div className="absolute z-[999] w-full">
      <div className=" m-3 flex items-center gap-5 justify-between">
        <div className="bg-gray-100 p-3 flex-1 rounded-lg flex items-center justify-between">
          <h1 className="text-slate-800 text-2xl font-extrabold">Island.Properties</h1>
          <div>
            <Button variant={"ghost"} className="font-bold">Service <ChevronDown size={20} className="ml-1" /></Button>
            <Button className="font-bold">Add to your property</Button>
          </div>
        </div>
        <Button size={"icon"} variant={"secondary"} className="rounded-full">
          <SlidersHorizontal />
        </Button>
      </div>
    </div>
  )
}
