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

const GeneralizedPage = ({ params }: { params: any }) => {
  const [limit, setLimit] = useState(8);
  const [sorting, setSorting] = useState("");

  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const closeRef = useRef<HTMLButtonElement | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const orderBy = searchParams.get("orderBy");
  const orderDirection = searchParams.get("orderDirection");

  const { data, isLoading, error } = useSWR(
    `${Backend_URL}/ecommerce-Products/riddle/${
      params.slug[0]
    }?page=${page}&limit=${12}${
      orderBy !== null
        ? `&orderBy=${orderBy}&orderDirection=${orderDirection}`
        : ""
    }`,
    getData
  );

  console.log(data);

  const [currentPage, setCurrentPage] = useState(Number(page));

  const {
    data: bannerData,
    isLoading: bannerLoading,
    error: bannerErrors,
  } = useSWR(`${Backend_URL}/banners`, getData);

  const handleSortingChange = (value: string) => {
    if (value == " ") {
      router.push(`/shop/${params.slug[0]}?page=1`);
    } else {
      setSorting(value);
      router.push(`/shop/${params.slug[0]}?page=1&${value}`);
    }
  };

  const handlePageChange = (newPage: number) => {
    sorting == ""
      ? router.push(`/shop/${params.slug[0]}?page=${newPage}`)
      : router.push(`/shop/${params.slug[0]}?page=${newPage}&${sorting}`);
  };

  return (
    <div className=" mt-12">
      <Container>
        <div className=" flex flex-col gap-4">
          <BreadCrumbComponent
            path="Home"
            currentPage={params.slug[0] == "new-in" ? "New In" : params.slug[0]}
          />

          {params.slug[0] == "new-in" && (
            <Heading
              header={`Fresh Drops, Fresh Looks`}
              desc={`Discover What's New - The Latest Styles, Just In.`}
            />
          )}
          {params.slug[0] == "men" && (
            <Heading
              header={`Unleash Your Inner Boss`}
              desc={`Man's styles that are all about making moves and looking good.`}
            />
          )}
          {params.slug[0] == "women" && (
            <Heading
              header={`Empower Your Elegance`}
              desc={`Explore the Women's Collection - Bold, Beautiful, and Unapologetically You.`}
            />
          )}
          {params.slug[0] == "unisex" && (
            <Heading
              header={`For Everyone, Everywhere`}
              desc={`Styles that break the rules and fit every vibe.`}
            />
          )}
        </div>
      </Container>

      <div className=" my-8">
        <Container>
          <div className="flex justify-end items-center">
            <div className=" flex items-center justify-end gap-3">
              <ControlSheet
                closeRef={closeRef}
                buttonName={
                  <>
                    <LucideFilter size={20} />
                    <span className=" text-xs lg:text-sm ms-1">
                      Filter Products
                    </span>
                  </>
                }
                title="Filter"
                desc="Refine Your Style with Our Curated Fashion Filters"
              >
                <FilterForm closeRef={closeRef} />
              </ControlSheet>

              <div
                onClick={(e) => e.preventDefault()}
                className="col-span-full  space-y-1.5"
              >
                <Select
                  onValueChange={(e) => {
                    handleSortingChange(e);
                  }}
                >
                  <SelectTrigger className=" font-medium">
                    <SelectValue
                      className=" !text-xs"
                      placeholder="Sort Products"
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value=" ">Default</SelectItem>
                    <SelectItem value="orderBy=id&orderDirection=desc">
                      Latest to oldest
                    </SelectItem>
                    <SelectItem value="orderBy=id&orderDirection=asc">
                      Oldest to latest
                    </SelectItem>
                    <SelectItem value="orderBy=salePrice&orderDirection=asc">
                      Price low to high
                    </SelectItem>
                    <SelectItem value="orderBy=salePrice&orderDirection=desc">
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
                    <div className="grid grid-cols-12 gap-2 lg:gap-4">
                      <div style={{ order: 4 }} className="col-span-full ">
                        <Carousel
                          plugins={[
                            Autoplay({
                              delay: 1500,
                            }),
                          ]}
                          className="w-full mb-4 lg:h-[500px] rounded-xl border-gold-400 border-2 overflow-hidden"
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
                  <div className="grid grid-cols-12 gap-2 lg:gap-4 ">
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

          <div className=" mb-24 pt-4">
            <Container>
              <div className="flex gap-2 justify-center items-center">
                <div>
                  <PaginationEcom
                    currentPage={Number(page)}
                    totalPages={data?.totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      handlePageChange(page);
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

export default GeneralizedPage;
