import Image from "next/image";
import { Badge } from "./ui/badge";
import { Map } from "mapbox-gl";

interface LandplotCardProps {
  // map: Map;
  center: [number, number];
}

export default function LandplotCard({
  center,
  // map
}: LandplotCardProps) {
  const handleFly = (center: [number, number]) => {
    // map.flyTo({
    //   center,
    //   zoom: 18,
    // });
  }

  const randomPrice = Math.floor(Math.random() * (1000 - 150 + 1)) + 150

  return (
    <div
      className="xs:flex space-x-2 w-full border rounded-lg p-2 overflow-hidden items-center cursor-pointer transition-all hover:border-primary"
      onClick={() => handleFly(center)}
    >
      <div className="aspect-video w-full xs:w-fit xs:aspect-square h-[180px] xs:h-[150px] relative overflow-hidden">
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
