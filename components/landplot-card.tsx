import Image from "next/image";
import { Badge } from "./ui/badge";
import { Map } from "mapbox-gl";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import Slider from "react-slick";
import { Button } from "./ui/button";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

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
}: // map
LandplotCardProps) {
  const handleFly = (center: [number, number]) => {
    // map.flyTo({
    //   center,
    //   zoom: 18,
    // });
  };

  const randomPrice = Math.floor(Math.random() * (1000 - 150 + 1)) + 150;

  return (
    <section className="w-full relative plot h-fit">
      <Button
        className="absolute top-3 z-[50] right-3 rounded-full w-7 h-7"
        size={"icon"}
        variant={"ghost"}
      >
        <Heart size={15} className="text-white fill-[#00000080]" />
      </Button>
      <Slider {...settings} className="overflow-hidden rounded-xl">
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
        <p className="text-sm font-semibold">${randomPrice}K</p>
      </div>
    </section>
  );
}
