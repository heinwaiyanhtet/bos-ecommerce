"use client";

import { BreadCrumbComponent, Container, Heading } from "@/components/ecom";
import PaginationEcom from "@/components/ecom/PaginationEcom";
import ProductSkeleton from "@/components/ecom/ProductSkeleton";
import ErrorComponent from "@/components/ErrorComponent";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import { LucideFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import useSWR from "swr";
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
import Image from "next/image";
import { Button } from "@/components/ui/button";

const SearchPage = ({ params }: { params: any }) => {
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
    `${Backend_URL}/ecommerce-Products/riddle?search=${decodeURIComponent(
      params.name
    )}&page=${page}${
      orderBy !== null
        ? `&orderBy=${orderBy}&orderDirection=${orderDirection}`
        : ""
    }&limit=${12}`,
    getData,
    {
      errorRetryCount: 1,
    }
  );

  const [currentPage, setCurrentPage] = useState(Number(page));

  const handleSortingChange = (value: string) => {
    if (value == " ") {
      router.push(`/search/${params.name}?page=1`);
    } else {
      setSorting(value);
      router.push(`/search/${params.name}?page=1&${value}`);
    }
  };

  const handlePageChange = (newPage: number) => {
    sorting == ""
      ? router.push(`/search/${params.name}?page=${newPage}`)
      : router.push(`/search/${params.name}?page=${newPage}&${sorting}`);
  };

  return (
    <div className=" !my-12 ">
      <Container>
        {decodeURIComponent(params.name) !== "undefined" && (
          <BreadCrumbComponent
            path="Home"
            currentPage={decodeURIComponent(params.name)}
          />
        )}
        {data?.data?.length > 0 && (
          <Heading
            header={`FOUND ${data?.total || 0} Product${
              data?.total === 1 ? "" : "s"
            } matching "${decodeURIComponent(params.name)}"`}
            desc={""}
            className=" pt-4"
          />
        )}
      </Container>

      {data?.data?.length == 0 ? (
        <div className=" flex justify-center items-center flex-col gap-3 h-[90vh] ">
          <Image alt="Icon" src="/svg3.svg" width={300} height={300} />
          <p className=" text-stone-800 font-serif text-xl">
            No matches found for &quot;{decodeURIComponent(params.name)}&quot;
          </p>
          <p className=" text-center text-stone-500 text-sm">
            It looks like we don&apos;t have any items matching your search.
          </p>
          <Button
            onClick={() => {
              router.push("/");
            }}
            className=" bg-gold-400 hover:bg-[#e2be6a] rounded-full"
          >
            Go Back Home
          </Button>
        </div>
      ) : (
        <div className="">
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
              <Container>
                {isLoading ? (
                  <div className=" mb-12 grid grid-cols-2 gap-x-3 gap-y-12 lg:grid-cols-4">
                    <ProductSkeleton />
                  </div>
                ) : (
                  <div className="grid grid-cols-12 gap-2 lg:gap-4">
                    {data?.data.map(
                      ({
                        name,
                        gender,
                        productBrand,
                        salePrice,
                        id,
                        medias,
                        productCode,
                        discountPrice,
                        productVariants,
                      }: any) => (
                        <div
                          className="col-span-6 lg:col-span-3 row-span-1"
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
                )}
              </Container>
              <div className=" pb-24 pt-4">
                <Container>
                  <div className="flex gap-2 justify-end items-center">
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
      )}
    </div>
  );
};

export default SearchPage;
