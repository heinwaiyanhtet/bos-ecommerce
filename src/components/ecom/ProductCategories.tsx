"use client";
import React, { useRef } from "react";
import Container from "./Container";
import Heading from "./Heading";
import { Button } from "../ui/button";
import { IconLeft, IconRight } from "react-day-picker";
import { Backend_URL, getFetch, getFetchForEcom } from "@/lib/fetch";
import useSWR from "swr";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideSquareArrowLeft,
  LucideSquareArrowRight,
} from "lucide-react";

const ProductCategories = () => {
  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    `${Backend_URL}/ecommerce-categories`,
    getData
  );

  const next = useRef<HTMLButtonElement | null>(null);
  const previous = useRef<HTMLButtonElement | null>(null);

  console.log(data);

  return (
    <section className=" lg:p-24 py-24 px-3 bg-stone-100">
      <Container>
        <div className=" flex flex-col gap-[40px]">
          <div className=" flex justify-between items-center">
            <Heading
              header="shop by categories"
              desc="Browse by category to find exactly what you need."
            />
            <div className=" hidden  lg:flex gap-2">
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
                  {error || isLoading || data?.length == 0 ? (
                    <CarouselItem className=" h-[500px]  bg-neutral-200">
                      <div className=" py-12"></div>
                    </CarouselItem>
                  ) : (
                    data?.map(
                      (
                        { name, media, productCategory, id }: any,
                        index: number
                      ) => (
                        <CarouselItem
                          key={index}
                          onClick={() =>
                            router.push(
                              `/categories/${name.toLowerCase()}/${
                                productCategory.id
                              }/${id}?page=1`
                            )
                          }
                          className="cursor-pointer basis-[50%] lg:basis-[25%]"
                        >
                          <div className=" relative group">
                            <Image
                              alt=""
                              src={media.url}
                              width={500}
                              height={500}
                              className={`aspect-square  rounded-xl object-cover border-2 bg-no-repeat hover:scale-95 duration-300 bg-cover hover:bg-[110%] bg-top border-gold-400 overflow-hidden relative flex justify-center items-center `}
                            />
                            <Button className=" font-serif absolute top-0 right-0 left-0 bottom-0 m-auto  font-medium  bg-gold-400 hover:bg-[#9e8446] text-white rounded-full flex justify-center gap-3 w-[150px] text-base lg:text-base  ">
                              {name}
                            </Button>
                          </div>
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
      </Container>
    </section>
  );
};

export default ProductCategories;
