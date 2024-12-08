"use client";

import {
  BreadCrumbComponent,
  Container,
  Heading,
  Products,
} from "@/components/ecom";
import PaginationEcom from "@/components/ecom/PaginationEcom";
import ProductSkeleton from "@/components/ecom/ProductSkeleton";
import ErrorComponent from "@/components/ErrorComponent";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import { LucideFilter, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import useSWR from "swr";
import ControlSheet from "@/components/ecom/ControlSheet";
import FilterForm from "@/components/ecom/FilterForm";
import { useAppProvider } from "@/app/Provider/AppProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductCard from "@/components/ecom/ProductCard";

const FilteredPage = ({ params }: { params: any }) => {
  const { searchInputValue, setSearchInputValue } = useAppProvider();

  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const sortBy = searchParams.get("sortBy");
  const orderDirection = searchParams.get("orderDirection");

  const [sorting, setSorting] = useState("");

  const closeRef = useRef<HTMLButtonElement | null>(null);

  const router = useRouter();

  const decodedString = decodeURIComponent(params.slug[0]);

  const [currentPage, setCurrentPage] = useState(Number(params.slug[1]));

  const newString = decodedString.replace(/&page=\d+/, "");

  const { data, isLoading, error } = useSWR(
    `${Backend_URL}/ecommerce-Products/riddle?${decodedString}&page=${page}${
      sortBy !== null
        ? `&sortBy=${sortBy}&orderDirection=${orderDirection}`
        : ""
    }&limit=${12}`,
    getData
  );

  const handleSortingChange = (value: string) => {
    if (value == " ") {
      router.push(`${newString}?page=1`);
    } else {
      setSorting(value);
      router.push(`${newString}?page=1&${value}`);
    }
  };

  const handlePageChange = (newPage: number) => {
    sorting == ""
      ? router.push(`${newString}?page=${newPage}`)
      : router.push(`${newString}?page=${newPage}&${sorting}`);
  };
  return (
    <div className=" py-8 space-y-4">
      <Container>
        <Heading
          header={`FOUND ${data?.total || 0} ${
            data?.total > 1 ? "Products" : "Product"
          }`}
          desc={`the latest and greatest products to enhance your lifestyle!`}
        />
      </Container>

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
                      <SelectItem value="sortBy=id&orderDirection=desc">
                        Latest to oldest
                      </SelectItem>
                      <SelectItem value="sortBy=id&orderDirection=asc">
                        Oldest to latest
                      </SelectItem>
                      <SelectItem value="sortBy=salePrice&orderDirection=asc">
                        Price low to high
                      </SelectItem>
                      <SelectItem value="sortBy=salePrice&orderDirection=desc">
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
    </div>
  );
};

export default FilteredPage;
