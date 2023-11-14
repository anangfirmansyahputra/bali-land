"use client";

import {
  Home,
  LandPlot,
  SlidersHorizontal,
  Warehouse
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider";
import { useState } from 'react';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { cn } from '../lib/utils';

const propertyTypes = [
  {
    id: 1,
    name: "Landplot",
    icon: <LandPlot className='w-6 h-6' />,
    value: "l"
  },
  {
    id: 2,
    name: "House",
    icon: <Home className='w-6 h-6' />,
    value: "h"
  },
  {
    id: 3,
    name: "Villa",
    icon: <Warehouse className='w-6 h-6' />,
    value: "v"
  },

]

export default function FilterSheet() {
  const [maxPrice, setMaxPrice] = useState<Number>(0);
  const [beds, setBeds] = useState<Number>(0);
  const [bathrooms, setBathrooms] = useState<Number>(0);
  const [type, setType] = useState<String>("l")

  return (
    <Dialog>
      <DialogTrigger asChild className='z-[999]'>
        <Button size={"icon"} variant={"secondary"} className="rounded-full">
          <SlidersHorizontal />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="z-[999]"
      >
        <DialogHeader className='border-b'>
          <DialogTitle className="text-center pb-2">Filters</DialogTitle>
        </DialogHeader>
        <div className='max-h-[60vh] pl-3 pr-5 overflow-y-auto'>
        <div className="mt-8 pb-8 border-b">
          <DialogTitle>Price Range</DialogTitle>
          <DialogDescription>
            Nightly prices before fees and taxes
          </DialogDescription>
          <div className='mt-5 space-y-4'>
            <Slider
              defaultValue={[Number(maxPrice)]}
              max={1000}
              step={1}
              onValueChange={(e) => setMaxPrice(Number(e[0]))}
            />
            <div className='flex gap-2 items-center'>
              <Input
                value={`$ 0`}
                onChange={e => null}
              />
              <div>-</div>
              <Input
                value={`$ ${Number(maxPrice)}`}
                onChange={e => null}
              />
            </div>
          </div>
        </div>
        <div className='mt-8 pb-8 border-b'>
          <DialogTitle>Property Type</DialogTitle>
          <div className='grid grid-cols-3 gap-2 mt-8'>
            {propertyTypes.map((item) => (
              <div
                key={item.id}
                className={cn("border p-3 rounded-lg cursor-pointer hover:border-black space-y-3 transition-all", type === item.value && "border-black")}
                onClick={() => setType(item.value)}
              >
                <h4 className='text-base font-medium'>{item.name}</h4>
                {item.icon}
              </div>
            ))}
          </div>
        </div>
        {type !== "l" && (
          <div className="mt-8 pb-8 border-b">
            <DialogTitle>Beds and bathrooms</DialogTitle>
            <DialogDescription>Beds</DialogDescription>
            <div className='flex flex-wrap gap-2 mt-5'>
              <Button
                size={"sm"}
                variant={beds === 0 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBeds(0)}
              >
                Any
              </Button>
              <Button
                size={"sm"}
                variant={beds === 1 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBeds(1)}
              >
                1
              </Button>
              <Button
                size={"sm"}
                variant={beds === 2 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBeds(2)}
              >
                2
              </Button>
              <Button
                size={"sm"}
                variant={beds === 3 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBeds(3)}
              >
                3
              </Button>
              <Button
                size={"sm"}
                variant={beds === 4 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBeds(4)}
              >
                4
              </Button>
              <Button
                size={"sm"}
                variant={beds === 5 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBeds(5)}
              >
                5
              </Button>
              <Button
                size={"sm"}
                variant={beds === 6 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBeds(6)}
              >
                6
              </Button>
              <Button
                size={"sm"}
                variant={beds === 7 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBeds(7)}
              >
                7
              </Button>
              <Button
                size={"sm"}
                variant={beds === 8 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBeds(8)}
              >
                8+
              </Button>
            </div>
            <DialogDescription className='mt-5'>Bathrooms</DialogDescription>
            <div className='flex flex-wrap gap-2 mt-5'>
              <Button
                size={"sm"}
                variant={bathrooms === 0 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBathrooms(0)}
              >
                Any
              </Button>
              <Button
                size={"sm"}
                variant={bathrooms === 1 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBathrooms(1)}
              >
                1
              </Button>
              <Button
                size={"sm"}
                variant={bathrooms === 2 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBathrooms(2)}
              >
                2
              </Button>
              <Button
                size={"sm"}
                variant={bathrooms === 3 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBathrooms(3)}
              >
                3
              </Button>
              <Button
                size={"sm"}
                variant={bathrooms === 4 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBathrooms(4)}
              >
                4
              </Button>
              <Button
                size={"sm"}
                variant={bathrooms === 5 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBathrooms(5)}
              >
                5
              </Button>
              <Button
                size={"sm"}
                variant={bathrooms === 6 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBathrooms(6)}
              >
                6
              </Button>
              <Button
                size={"sm"}
                variant={bathrooms === 7 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBathrooms(7)}
              >
                7
              </Button>
              <Button
                size={"sm"}
                variant={bathrooms === 8 ? "default" : "secondary"}
                className='rounded-full px-5 hover:bg-primary hover:text-white'
                onClick={() => setBathrooms(8)}
              >
                8+
              </Button>
            </div>
          </div>
        )}
        </div>
        <DialogFooter>
          <Button
            variant={"link"}
          >
            Clear All
          </Button>
          <Button>Show Place</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}
