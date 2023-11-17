"use client";

import { motion } from 'framer-motion';
import { Heart, Star, X } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PlotPopUpMobile {
  data: any;
}

export default function PlotPopUpMobile({ data }: PlotPopUpMobile) {
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        data.onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    
  }, [data.onClose]);
  
  useEffect(() => {
    setShow(true);
  }, [])
  
  return (
      <div
        // ref={popupRef}
        className={cn('fixed z-[52] bottom-[70px] w-full flex items-center justify-center duration-500 transition-opacity', show ? "opacity-100" : "opacity-0")}
      >
      <Card 
        className="relative max-w-[400px] w-full p-0 overflow-hidden border-none mx-5 " 
        role='button' 
        onClick={(e) => {
          router.push(`/villa/${data.id}`);
        }}
      >
        <Button
          className="absolute top-3 z-[50] left-3 rounded-full w-6 h-6"
          size={"icon"}
          variant={"secondary"}
          onClick={(e) => {
            e.stopPropagation();
            setShow(false)
            setTimeout(() => {
              data.onClose()
            }, 500)
          }}
        >
          <X size={12} />
        </Button>
        <CardContent className="flex p-0">
          <div className="w-[126px] h-[126px] relative">
            <Image
              src={"/assets/vila.jpg"}
              fill
              alt="vila"
              className="object-cover transition-opacity opacity-0 duration-[2s]"
              onLoadingComplete={(image) => image.classList.remove('opacity-0')}
            />
          </div>
          <div className="p-2 flex-1 flex flex-col justify-between truncate">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-sm">Vila Resort</CardTitle>
                <CardDescription>Vila for rent</CardDescription>
              </div>
              <Button
                className="rounded-full w-7 h-7"
                size={"icon"}
                variant={"ghost"}
              >
                <Heart size={15} className="text-white fill-[#00000080]" onClick={(e) => {
                  e.stopPropagation();
                }} />
              </Button>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-light">Posted (15 Nov 2023)</p>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">${data.price}K</CardTitle>
                <div className="flex gap-1 items-center">
                  <Star className="fill-black w-3 h-3" />
                  <span className="text-sm font-light">4,5</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
  );
}
