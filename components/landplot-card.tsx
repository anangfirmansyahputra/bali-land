import Image from "next/image";
import { Badge } from "./ui/badge";
import { Map } from "mapbox-gl";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import Slider from "react-slick";
import { Button } from "./ui/button";

interface LandplotCardProps {
  // map: Map;
  center: [number, number];
}

function CustomArrow(props: any) {
  const { className, style, onClick, side, onClose } = props;

  return (
    <div
      className={`absolute z-[50] top-[50%] arrow-btn opacity-0 transition-opacity ${
        side === "next" ? "right-3" : "left-3"
      }`}
      style={{ ...style }}
      onClick={onClick}
    >
      {side === "prev" ? (
        <Button
          size={"icon"}
          variant={"secondary"}
          className="rounded-full w-7 h-7"
        >
          <ChevronLeft size={15} />
        </Button>
      ) : (
        <Button
          size={"icon"}
          variant={"secondary"}
          className="rounded-full w-7 h-7"
        >
          <ChevronRight size={15} />
        </Button>
      )}
    </div>
  );
}

var settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <CustomArrow side="next" />,
  prevArrow: <CustomArrow side="prev" />,
};

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
    // <div
    //   className="xs:flex space-x-2 w-full border rounded-lg p-2 overflow-hidden items-center cursor-pointer transition-all hover:border-primary"
    //   onClick={() => handleFly(center)}
    // >
    //   <div className="aspect-video w-full xs:w-fit xs:aspect-square h-[180px] xs:h-[150px] relative overflow-hidden">
    //     <Image src={"/assets/vila.jpg"} alt="vila" fill className="object-cover" />
    //   </div>
    //   <div className="space-y-1 flex-1 truncate text-ellipsis  overflow-y-auto">
    //     <h1 className="text-base sm:text-xl">Tampaksiring, Indonesia</h1>
    //     <p className="text-xs sm:text-sm text-slate-600">Stay with Ari * Hosting for 7 years</p>
    //     <div className="space-x-1">
    //       <Badge variant={"outline"}>
    //         Vila
    //       </Badge>
    //       <Badge variant={"default"}>
    //         ${randomPrice}K
    //       </Badge>
    //     </div>
    //     <p className="text-xs sm:text-sm text-slate-600">Lorem ipsum d sit amet consectetur, adipisicing elit. Officia illo asperiores quod doloremque sit dolorem tempora molestiae eaque. Rerum vitae animi deserunt officiis praesentium laboriosam, architecto placeat quasi, minima aliquam ducimus a nobis recusandae quos? A eligendi neque modi voluptatum deleniti asperiores, ex dolores id, corporis sapiente quaerat minima veniam.</p>
    //   </div>
    // </div>
    <section className="w-full relative plot h-fit">
      {/* <div className="w-full aspect-square relative rounded-xl overflow-hidden">
        <Image fill src={"/assets/vila.jpg"} alt="vila" className="object-cover" />sss
      </div> */}
              <Button
          className="absolute top-3 z-[50] right-3 rounded-full w-7 h-7"
          size={"icon"}
          variant={"ghost"}
        >
          <Heart size={15} className="text-white fill-[#00000080]" />
        </Button>
        <Slider
          {...settings}
          className="overflow-hidden rounded-xl"
        >
          <div className="w-full aspect-square relative rounded-xl">
            <Image
              fill
              src="/assets/vila.jpg"
              className="object-cover"
              alt="vila"
            />
          </div>
          <div className="w-full aspect-square relative rounded-xl">
            <Image
              fill
              src="/assets/vila2.jpg"
              className="object-cover"
              alt="vila"
            />
          </div>
        </Slider>
      <div className="mt-2">
        <div className="flex items-start justify-between">
        <p className="text-sm font-semibold leading-5">Lorem, ipsum dolor.</p>
        <div className="flex items-center space-x-1">
          <Star size={12} className="fill-black" />
          <p className="text-sm font-light">4.95</p>
        </div>
        </div>
        <p className="text-sm text-gray-500">Beach and ocean views</p>
        <p className="text-sm text-gray-500">Nov 21 - 26</p>
        <p className="text-sm font-semibold">$500K</p>
      </div>
    </section>
  )
}
