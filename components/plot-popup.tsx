"use client";

import { ChevronLeft, ChevronRight, Heart, Star, X } from "lucide-react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

interface PlotPopupProps {
  data: any;
  onClose: () => void;
  handleNavigate: (url:string) => void;
}

function CustomArrow(props: any) {
  const { className, style, onClick, side, onClose } = props;

  return (
    <div
      className={`absolute z-[50] top-[50%] arrow-btn opacity-0 transition-opacity ${
        side === "next" ? "right-3" : "left-3"
      }`}
      style={{ ...style }}

    >
      {side === "prev" ? (
        <Button
          size={"icon"}
          variant={"secondary"}
          className="rounded-full w-7 h-7"
              onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
          >
          <ChevronLeft size={15} />
        </Button>
      ) : (
        <Button
        size={"icon"}
        variant={"secondary"}
        className="rounded-full w-7 h-7"
            onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
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

export default function PlotPopup({ data, onClose, handleNavigate }: PlotPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(true);
  const [show, setShow] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShow(false);
        setTimeout(() => {
          onClose();
        }, 500)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    setShow(true)
  }, [])

  return (

      <Card 
      // ref={popupRef}
        role="button" 
        className={cn("p-0 border-none max-w-[327px] relative z-[49] plot duration-500 transition-opacity", show ? "opacity-1" : "opacity-0" )}
        onClick={() => handleNavigate(`/villa/123`)}
      >
        <Button
          className="absolute top-3 z-[50] right-3 rounded-full w-7 h-7"
          size={"icon"}
          variant={"ghost"}
        >
          <Heart 
            size={15} 
            className="text-white fill-[#00000080]" 
            onClick={(e) => {
              e.stopPropagation()
          }} />
        </Button>
        <Button
          className="absolute top-3 z-[50] left-3 rounded-full w-7 h-7"
          size={"icon"}
          variant={"secondary"}
          onClick={(e) => {
            e.stopPropagation()
            setShow(false);
            setTimeout(() => {
              onClose();
            }, 500)
          }}
        >
          <X size={15} />
        </Button>
        <Slider
          {...settings}
          className="w-full h-full rounded-t-lg relative overflow-hidden"
        >
          <div className="relative w-full aspect-video rounded-t-lg  bg-transparent">
            {imageLoaded ? (
              <Image
                fill
                src="/assets/vila.jpg"
                className="object-cover transition-opacity opacity-0 duration-[2s]"
                onLoadingComplete={(image) => image.classList.remove('opacity-0')}
                alt="vila"
                priority
              />
            ) : <Skeleton className="w-full h-full" />}
          </div>
          <div className="relative w-full aspect-video rounded-t-lg bg-transparent">
            <Image
              fill
              src="/assets/vila2.jpg"
              className="object-cover transition-opacity opacity-0 duration-[2s]"
              alt="vila"
              onLoadingComplete={(image) => image.classList.remove('opacity-0')}
              priority
            />
          </div>
        </Slider>
        <CardContent className="mt-2 px-3 pb-3 space-y-1 border-none">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Vila Resort</CardTitle>
            <div className="flex gap-1 items-center">
              <Star className="fill-black w-3 h-3" />
              <span className="text-sm">4,5</span>
            </div>
          </div>
          <CardDescription className="w-full truncate">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic,
            quibusdam. Ducimus accusantium exercitationem laboriosam assumenda
            aut tenetur quae iste odit, ipsam fugiat voluptatum, placeat ratione
            delectus a, quo quidem soluta aliquid unde reiciendis iusto minus
            quisquam omnis quaerat? Temporibus officia neque, quam quibusdam
            optio pariatur error dolores quos. Veritatis iusto nobis alias at
            autem odit dolorum similique repellendus, dolore reiciendis ea
            blanditiis exercitationem deserunt pariatur vel. Illo, obcaecati?
            Cupiditate consequuntur sunt minus dolorem saepe? Modi odit
            similique officiis iure, doloremque culpa atque repellendus cumque
            molestias, eligendi eum. Aut, perferendis. Provident sit expedita
            quo maxime sint, autem voluptate ea porro quas debitis doloremque
            rem architecto consectetur, dolores, eligendi quam cupiditate
            accusamus. Quibusdam illum inventore cum libero repellat
            consequuntur, voluptatibus commodi nulla aliquid unde nobis nihil
            officiis quam dolores mollitia pariatur nam, incidunt ex placeat
            labore praesentium optio iste, at corrupti? Illo, eos, voluptatum
            asperiores delectus recusandae doloremque, perspiciatis sunt
            molestiae adipisci illum rerum voluptates! Ullam sequi accusamus
            libero repudiandae voluptas minus dignissimos delectus mollitia
            saepe, hic nihil cumque adipisci quaerat debitis sunt nostrum
            dolorum accusantium rem natus tenetur sapiente veritatis. Cumque
            itaque, quae illo et deserunt tenetur rem vitae! Enim sit laudantium
            hic consequuntur nisi quis veniam suscipit ipsam repellendus
            voluptas?
          </CardDescription>
          <p className="font-medium text-sm">${data.price}K</p>
        </CardContent>
      </Card>
  );
}
