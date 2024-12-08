import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import useSWR from "swr";
import Image from "next/image";
import Container from "./Container";

const Banner = () => {
  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const { data, error, isLoading } = useSWR(
    `${Backend_URL}/api/v1/sliders`,
    getData
  );

  return (
    <Container>
      <div className=" rounded-xl overflow-hidden my-12 border-2  border-gold-400">
        <Carousel
          plugins={[
            Autoplay({
              delay: 1500,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {error || isLoading ? (
              <CarouselItem className=" h-[400px] lg:h-[600px] flex  justify-center items-center lg:w-[1260px] bg-neutral-200 animate-pulse"></CarouselItem>
            ) : (
              <>
                {data?.data
                  ?.sort((a: any, b: any) => a.sorting - b.sorting)
                  .map(({ id, desktopImage, mobileImage }: any) => (
                    <CarouselItem
                      key={id}
                      className=" lg:h-[650px] w-full flex justify-center items-center "
                    >
                      <Image
                        src={desktopImage}
                        className=" hidden lg:block w-full object-cover object-top lg:h-[650px]"
                        alt="banner photo"
                        width={800}
                        height={800}
                      />
                      <Image
                        src={mobileImage}
                        className=" lg:hidden block w-full object-cover object-top  !h-[400px]"
                        alt="banner photo"
                        width={800}
                        height={800}
                      />
                    </CarouselItem>
                  ))}
              </>
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </Container>
  );
};

export default Banner;
