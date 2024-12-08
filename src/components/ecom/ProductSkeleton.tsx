import React from "react";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";

const ProductSkeleton = () => {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="lg:mb-12 cursor-pointer group duration-300 border-2 border-transparent rounded-xl animate-pulse"
        >
          {/* Image skeleton */}
          <div className="relative h-[300px] lg:h-[500px] rounded-xl bg-gray-300" />
          {/* Top button skeleton */}
          <div className="absolute top-3 right-3 bg-gray-300 flex items-center justify-center size-10 shadow-sm rounded-full" />
          {/* Badge skeleton */}
          <div className="absolute left-3 bottom-3">
            <div className="inline-flex items-center border px-2.5 py-0.5 text-xs shadow bg-gray-300 rounded-full">
              &nbsp;
            </div>
          </div>
          {/* Product details skeleton */}
          <div className="flex flex-col gap-1 p-[15px]">
            {/* Title skeleton */}
            <div className="h-6 bg-gray-300 w-3/4 rounded" />
            {/* Code skeleton */}
            <div className="flex gap-2 text-sm items-center">
              <div className="h-4 bg-gray-300 w-1/2 rounded" />
            </div>
            {/* Price skeleton */}
            <div className="h-5 bg-gray-300 w-1/3 rounded" />
          </div>
          {/* Wishlist button skeleton */}
          <div>
            <div className="items-center select-none justify-center rounded-md bg-gray-300 h-9 px-4 py-2 hidden" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductSkeleton;
