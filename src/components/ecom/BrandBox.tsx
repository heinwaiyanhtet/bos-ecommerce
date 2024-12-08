import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import useSWR from "swr";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import { useRouter } from "next/navigation";
import Container from "./Container";
import Heading from "./Heading";

const BrandBox = () => {
  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const { data, isLoading, error } = useSWR(
    `${Backend_URL}/product-brands/all`,
    getData
  );

  const router = useRouter();

  return (
    <Container className=" mb-24">
      <Heading
        className=" mb-8"
        header="Choose your favorite brand"
        desc="Select popular brands to find the one that suits your style and preferences."
      />
      <div className=" grid grid-cols-2 lg:grid-cols-6 gap-2 lg:gap-4">
        {data?.data.map(
          ({
            name,
            media,
            id,
          }: {
            name: string;
            id: number;
            media: {
              url: string;
            };
          }) => {
            return (
              <div
                key={id}
                className=" col-span-1 h-[150px] flex justify-center items-center duration-300 hover:scale-90 active:scale-95"
              >
                <Image
                  onClick={() => {
                    router.push(`/brands/${name}/${id}?page=1`);
                  }}
                  src={media?.url}
                  width={300}
                  // className=" h-[80px] lg:h-[100px] w-[80px] rounded-full lg:w-[100px] object-cover border-2 border-black"
                  className=" h-[150px] w-full  border-2 rounded-xl object-cover object-center bg-black border-gold-400"
                  height={300}
                  alt=""
                />
              </div>
            );
          }
        )}
      </div>
    </Container>
  );
};

export default BrandBox;
