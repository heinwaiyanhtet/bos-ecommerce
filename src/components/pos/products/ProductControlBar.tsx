"use client";

import ConfirmBox from "@/components/ConfirmBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import { debounce, get } from "lodash";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

const ProductControlBar = ({
  isSelected,
  searchInputValue,
  setSearchInputValue,
  drop,
}: {
  isSelected: boolean;
  searchInputValue: string;
  setSearchInputValue: React.Dispatch<React.SetStateAction<string>>;
  drop: () => void;
}) => {
  const router = useRouter();

  const getData = (url: string) => getFetchForEcom(url);

  // Use useCallback to memoize the debounced function
  const handleOnChange = useCallback(
    debounce((value) => {
      setSearchInputValue(value);
    }, 500),
    []
  );

  // Re-run SWR only when searchInputValue changes
  const { data } = useSWR(
    searchInputValue
      ? `${Backend_URL}/ecommerce-products/suggest/?search=${searchInputValue}`
      : null,
    getData
  );

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isClickingSuggestion, setIsClickingSuggestion] = useState(false);

  const handleOnBlur = () => {
    if (!isClickingSuggestion) {
      setShowSuggestions(false);
    }
  };

  const handleOnFocus = (e: any) => {
    if (e.target.value) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (data?.length > 0) {
      setShowSuggestions(true);
    }
  }, [data]);

  return (
    <div className="flex justify-between">
      <div className="flex relative gap-3">
        <Input
          placeholder="Search..."
          defaultValue={searchInputValue}
          onChange={(e) => handleOnChange(e.target.value)}
        />

        {isSelected && (
          <ConfirmBox
            buttonName={
              <>
                <Trash2 width={16} /> <span className="ms-1">Delete</span>
              </>
            }
            buttonSize="sm"
            buttonVariant={"outline"}
            confirmTitle={"Are you sure?"}
            confirmDescription={"This action can't be undone!"}
            confirmButtonText={"Yes, delete this."}
            run={drop}
          />
        )}

        <div
          className={`${
            showSuggestions
              ? "opacity-100 h-auto block translate-y-8 pointer-events-auto"
              : "opacity-0 h-0 translate-y-10 pointer-events-none"
          } duration-300 fixed border w-[300px] border-gray-300 bg-white p-2.5 flex flex-col z-[1000] divide-y`}
          onMouseDown={() => setIsClickingSuggestion(true)}
          onMouseUp={() => setIsClickingSuggestion(false)}
          // onFocus={(e) => handleOnFocus(e)}
        >
          {data?.map((item: any, index: number) => (
            <Button
              variant={"ghost"}
              onClick={async (e) => {
                e.stopPropagation();
                // await setDebouncedValue(item.name);
                await handleOnChange(item.name);
                setShowSuggestions(false);
              }}
              key={index}
              className=" flex justify-start text-start"
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>
      <Button
        onClick={() => router.push("/pos/app/products/add-new-product-step/1")}
      >
        <PlusCircle className="me-1" />
        Add Product
      </Button>
    </div>
  );
};

export default ProductControlBar;
