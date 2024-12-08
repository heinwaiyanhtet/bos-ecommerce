import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import useSWR from "swr";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { ChevronRight, Dot, Trash, Trash2, X, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

const SearchProducts = ({ closeRef }: any) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [recentSuggestions, setRecentSuggestions] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    ref.current?.focus();
    // Load suggestions from typeof window !== "undefined" && localStorage on mount
    const storedSuggestions =
      typeof window !== "undefined" &&
      localStorage.getItem("recentSuggestions");
    if (storedSuggestions) {
      setRecentSuggestions(JSON.parse(storedSuggestions));
    }
  }, []);

  const getSuggestData = (url: string) => getFetchForEcom(url);

  const { data, isLoading } = useSWR(
    searchInputValue !== ""
      ? `${Backend_URL}/ecommerce-products/suggest/?search=${searchInputValue}`
      : null,
    getSuggestData,
    {
      shouldRetryOnError: false,
    }
  );

  const handleSearchInput = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(e.target.value);
    },
    500
  );

  const handleSuggestionClick = (name: string) => {
    // Navigate to the clicked suggestion

    // Add to recent suggestions
    const updatedSuggestions = Array.from(
      new Set([name, ...recentSuggestions])
    ).slice(0, 5);

    setRecentSuggestions(updatedSuggestions);
    typeof window !== "undefined" &&
      localStorage.setItem(
        "recentSuggestions",
        JSON.stringify(updatedSuggestions)
      );
    closeRef?.current.click();
    router.push(`/search/${name}?page=1`);
  };

  const handleDeleteSuggestion = (name: string) => {
    const filteredSuggestions = recentSuggestions.filter(
      (suggestion) => suggestion !== name
    );
    setRecentSuggestions(filteredSuggestions);
    typeof window !== "undefined" &&
      localStorage.setItem(
        "recentSuggestions",
        JSON.stringify(filteredSuggestions)
      );
  };

  console.log(data);

  return (
    <div className=" h-full">
      <div>
        <Input
          ref={ref}
          onChange={handleSearchInput}
          placeholder="Find Your Products"
          className=" mb-6 h-12 shadow w-full focus-visible:ring-gold-400"
        />

        {/* Suggestions from Search */}

        <div>
          {data?.length > 0 && (
            <div className="mb-3">
              <p className="font-medium ">
                Products including{" "}
                <span className="  ">&quot;{searchInputValue}&quot;</span> (
                {data?.length})
              </p>
            </div>
          )}

          <div className="  h-[300px] overflow-auto">
            {data?.length == 0 ? (
              <>
                {!isLoading && data?.length < 1 && (
                  <div className=" flex justify-center flex-col gap-3 items-center">
                    <Image
                      src={"/svg6.svg"}
                      alt="Icon"
                      width={200}
                      height={200}
                      className=""
                    />
                    <p>
                      <span className=" text-xl font-medium">
                        No result found for &quot;{searchInputValue}&quot;
                      </span>
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className=" flex flex-col gap-3">
                {data?.map((data: any, index: number) => (
                  <div
                    key={index}
                    className="cursor-pointer px-1 flex items-center gap-3 justify-start hover:bg-gold-100 p-1 rounded-xl duration-300"
                    onClick={() => handleSuggestionClick(data.name)}
                  >
                    <Image
                      src={data?.media?.url}
                      alt=""
                      width={50}
                      height={50}
                      className=" !w-12 !h-12 object-cover object-top rounded-xl border border-gold-400"
                    />
                    <p>
                      <span className=" font-medium">{data?.name}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <>
          {data?.length > 0 && (
            <>
              {searchInputValue !== "" && (
                <div
                  onClick={() => handleSuggestionClick(searchInputValue)}
                  className=" border-y hover:bg-stone-100 cursor-pointer mt-auto"
                >
                  <div className="flex justify-between items-center p-2">
                    <p>
                      See all result for
                      <span className=" font-medium">
                        &quot;{searchInputValue}&quot;
                      </span>
                    </p>

                    <Button
                      className="rounded-full size-10 p-0 bg-transparent hover:bg-[#c4a35820] border-2 border-gold-400 text-lg text-gold-400 d-flex justify-items-center"
                      variant={"outline"}
                      size={"icon"}
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </>

        {/* Recent Suggestions */}
        {recentSuggestions.length > 0 && (
          <div className="mt-3 hidden lg:block">
            <p className="font-medium mb-3">Recent Searches</p>
            <ul className="flex flex-wrap gap-3">
              {recentSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className=" bg-stone-300 cursor-pointer flex relative justify-center rounded-full group px-8 py-2 items-center"
                >
                  <span
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex !text-xs items-center"
                  >
                    {suggestion}
                  </span>
                  <span className=" absolute opacity-0 right-2 rounded-full duration-300 group-hover:opacity-100 top-2.5  text-black ">
                    <Trash2
                      size={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSuggestion(suggestion);
                      }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className=" mt-3 block lg:hidden">
          <p className="font-medium text-start mb-3">Recent Searches</p>
          {recentSuggestions.length > 0 && (
            <ul className="flex flex-col">
              {recentSuggestions?.map((word, index: number) => (
                <li
                  key={index}
                  className=" bg-stone-300 mb-3 cursor-pointer flex  w-full justify-between rounded-full group px-5 py-2 items-center"
                >
                  <span
                    onClick={() => handleSuggestionClick(word)}
                    className="flex !text-xs items-center"
                  >
                    {word}
                  </span>
                  <span className=" opacity-100 justify-between right-2 rounded-full duration-300 top-2.5 text-black ">
                    <Trash2
                      size={20}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSuggestion(word);
                      }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchProducts;
