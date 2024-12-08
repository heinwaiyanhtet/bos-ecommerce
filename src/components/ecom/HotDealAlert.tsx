"use client";
import React, { useRef } from "react";
import Heading from "./Heading";
import { useRouter } from "next/navigation";
import Container from "./Container";
import { Button } from "../ui/button";
import { IconLeft, IconRight } from "react-day-picker";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import ProductCard from "./ProductCard";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";

const HotDealAlert = ({ data, isLoading }: any) => {
  const next = useRef<HTMLButtonElement | null>(null);
  const previous = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();
  return (
    <div className=" space-y-4 pb-24">
      <div className=" flex justify-between items-center">
        <Heading header="You Might Also Like" desc="Check this out!" />
        <div className=" hidden lg:flex gap-2">
          <Button
            className="rounded-full size-10 p-0 bg-transparent hover:bg-[#c4a35820] border-2 border-gold-400 text-lg text-gold-400 d-flex justify-items-center"
            onClick={() => previous.current && previous.current.click()}
          >
            <LucideArrowLeft className="size-5" />
          </Button>
          <Button
            className="rounded-full size-10 p-0 bg-transparent hover:bg-[#c4a35820] border-2 border-gold-400 text-lg text-gold-400 d-flex justify-items-center"
            onClick={() => next.current && next.current.click()}
          >
            <LucideArrowRight className="size-5" />
          </Button>
        </div>
      </div>
      <div>
        <div className="flex justify-center object-contain items-center">
          <Carousel
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {isLoading ? (
                <CarouselItem className="cursor-pointer basis-[50%] lg:basis-[25%]">
                  <div className=" py-12"></div>
                </CarouselItem>
              ) : (
                data?.data?.map(
                  (
                    {
                      name,
                      medias,
                      productBrand,
                      id,
                      salePrice,
                      productCode,
                      productVariants,
                    }: any,
                    index: number
                  ) => (
                    <CarouselItem
                      key={index}
                      className="cursor-pointer basis-[50%] lg:basis-[25%]"
                    >
                      <ProductCard
                        id={id}
                        productVariants={productVariants}
                        productCode={productCode}
                        name={name}
                        productBrand={productBrand}
                        salePrice={salePrice}
                        medias={medias}
                      />
                    </CarouselItem>
                  )
                )
              )}
            </CarouselContent>
            <div className=" hidden">
              <CarouselNext ref={next} />
              <CarouselPrevious ref={previous} />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default HotDealAlert;
