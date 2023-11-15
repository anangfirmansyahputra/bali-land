"use client";

import { ChevronLeft, ChevronRight, Heart, Star, X } from "lucide-react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useParams, useRouter } from 'next/navigation';

interface PlotPopupProps {
  data: any;
  onClose: () => void;
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

export default function PlotPopup({ data, onClose }: PlotPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={popupRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-0 border-none max-w-[327px] relative z-[49] plot">
        <Button
          className="absolute top-3 z-[50] right-3 rounded-full w-7 h-7"
          size={"icon"}
          variant={"ghost"}
        >
          <Heart size={15} className="text-white fill-[#00000080]" />
        </Button>
        <Button
          className="absolute top-3 z-[50] left-3 rounded-full w-7 h-7"
          size={"icon"}
          variant={"secondary"}
          onClick={onClose}
        >
          <X size={15} />
        </Button>
        <Slider
          {...settings}
          className="w-full h-full rounded-t-lg relative overflow-hidden"
        >
          <div className="relative w-full aspect-video rounded-t-lg  bg-transparent">
            <Image
              fill
              src="/assets/vila.jpg"
              className="object-cover"
              alt="vila"
            />
          </div>
          <div className="relative w-full aspect-video rounded-t-lg bg-transparent">
            <Image
              fill
              src="/assets/vila2.jpg"
              className="object-cover"
              alt="vila"
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
    </motion.div>
  );
}
