"use client";

import { BreadCrumbComponent, Container, Heading } from "@/components/ecom";
import PaginationEcom from "@/components/ecom/PaginationEcom";
import ProductSkeleton from "@/components/ecom/ProductSkeleton";
import ErrorComponent from "@/components/ErrorComponent";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import { LucideFilter, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import useSWR from "swr";
import { useAppProvider } from "@/app/Provider/AppProvider";
import ControlSheet from "@/components/ecom/ControlSheet";
import FilterForm from "@/components/ecom/FilterForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import ProductCard from "@/components/ecom/ProductCard";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const BrandsPage = ({ params }: { params: any }) => {
  const [limit, setLimit] = useState(8);
  const [sorting, setSorting] = useState("");

  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const closeRef = useRef<HTMLButtonElement | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  const { data, isLoading, error } = useSWR(
    `${Backend_URL}/ecommerce-Products/riddle?sortBrand=${params.slug[1]}
        ${sorting !== "default" ? `${sorting}` : ""}&page=${page}&limit=${10}`,
    getData
  );

  const [currentPage, setCurrentPage] = useState(Number(page));

  const {
    data: bannerData,
    isLoading: bannerLoading,
    error: bannerErrors,
  } = useSWR(`${Backend_URL}/banners`, getData);

  return (
    <div className=" mt-12">
      <Container>
        <div className=" flex flex-col gap-[15px]">
          <BreadCrumbComponent
            path="Home"
            currentPage={decodeURIComponent(params.slug[0])}
          />

          <Heading
            header={`Products of ${decodeURIComponent(params.slug[0])}`}
            desc={`${decodeURIComponent(params.slug[0])}`}
          />
        </div>
      </Container>

      <div className=" mb-8">
        <Container>
          <div className="flex justify-end items-center">
            <div className=" flex items-center justify-end gap-3">
              <ControlSheet
                closeRef={closeRef}
                buttonName={
                  <>
                    <LucideFilter size={20} />
                    <span className=" ms-1">Filter Products</span>
                  </>
                }
                title="Filter"
                desc="Refine Your Style with Our Curated Fashion Filters"
              >
                <FilterForm closeRef={closeRef} />
              </ControlSheet>

              <div
                onClick={(e) => e.preventDefault()}
                className="col-span-full space-y-1.5"
              >
                <Select
                  value={sorting}
                  onValueChange={(newSorting) => {
                    console.log(newSorting);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort Products" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="orderBy=id&orderDirection=asc">
                      Oldest to newest
                    </SelectItem>
                    <SelectItem value="orderBy=id&orderDirection=desc">
                      Latest to oldest
                    </SelectItem>

                    <SelectItem value="orderBy=salePrice&orderDirection=desc">
                      Price low to high
                    </SelectItem>
                    <SelectItem value="orderBy=salePrice&orderDirection=asc">
                      Price high to low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {error ? (
        <ErrorComponent refetch={() => {}} />
      ) : (
        <>
          <Container className="lg:mb-16">
            {isLoading ? (
              <div className=" mb-12 grid grid-cols-2 gap-x-3 gap-y-12 lg:grid-cols-4">
                <ProductSkeleton />
              </div>
            ) : (
              <>
                {Number(page) == 1 ? (
                  <>
                    <div className="grid  grid-cols-12 gap-4">
                      <div style={{ order: 4 }} className="col-span-full ">
                        <Carousel
                          plugins={[
                            Autoplay({
                              delay: 1500,
                            }),
                          ]}
                          className="w-full mb-4 h-[500px] rounded-xl border-gold-400 border-2 overflow-hidden"
                        >
                          <CarouselContent>
                            {bannerLoading || bannerErrors ? (
                              <CarouselItem className="  flex justify-center items-center "></CarouselItem>
                            ) : (
                              <>
                                {/* <CarouselContent> */}
                                {bannerData?.data.map(({ id, url }: any) => (
                                  <CarouselItem
                                    key={id}
                                    className=" h-full w-full flex justify-center items-center "
                                  >
                                    <Image
                                      src={url}
                                      className=" w-full h-full rounded-xl object-top object-cover "
                                      alt="banner photo"
                                      width={800}
                                      height={800}
                                    />
                                  </CarouselItem>
                                ))}
                                {/* </CarouselContent> */}
                              </>
                            )}
                          </CarouselContent>
                        </Carousel>
                      </div>

                      {data?.data.map(
                        (
                          {
                            name,
                            gender,
                            productBrand,
                            salePrice,
                            id,
                            medias,
                            productCode,
                            discountPrice,
                            productVariants,
                          }: any,
                          index: number
                        ) => (
                          <div
                            style={{ order: index >= 4 ? index + 1 : index }}
                            className={`col-span-6 lg:col-span-3`}
                            key={id}
                          >
                            <ProductCard
                              id={id}
                              name={name}
                              productBrand={productBrand}
                              salePrice={salePrice}
                              medias={medias}
                              discountPrice={discountPrice}
                              productCode={productCode}
                              productVariants={productVariants}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-12 gap-6 ">
                    {data?.data.map(
                      (
                        {
                          name,
                          gender,
                          productBrand,
                          salePrice,
                          id,
                          medias,
                          productCode,
                          discountPrice,
                          productVariants,
                        }: any,
                        index: number
                      ) => (
                        <div className={`col-span-6 lg:col-span-3`} key={id}>
                          <ProductCard
                            id={id}
                            name={name}
                            productBrand={productBrand}
                            salePrice={salePrice}
                            medias={medias}
                            discountPrice={discountPrice}
                            productCode={productCode}
                            productVariants={productVariants}
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </Container>

          <div className=" mb-24">
            <Container>
              <div className="flex gap-2 justify-center items-center">
                <div>
                  <PaginationEcom
                    currentPage={Number(page)}
                    totalPages={data?.totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      router.replace(`/${params.slug[0]}?page=${page}`);
                    }}
                  />
                </div>
              </div>
            </Container>
          </div>
        </>
      )}
    </div>
  );
};

export default BrandsPage;
