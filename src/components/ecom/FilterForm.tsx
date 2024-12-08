import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import useSWR from "swr";
import { Backend_URL, getFetch, getFetchForEcom } from "@/lib/fetch";
import FilterItem from "./FilterItem";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { useAppProvider } from "@/app/Provider/AppProvider";

const FilterForm = ({ closeRef }: any) => {
  const { searchInputValue, setSearchInputValue } = useAppProvider();
  const [isClient, setIsClient] = useState(false);
  const [genders, setGenders] = useState<string[]>([]);
  const [brands, setBrands] = useState<(string | number)[]>([]);
  const [brandName, setBrandName] = useState<string[]>([]);
  const [type, setType] = useState<(string | number)[]>([]);
  const [size, setSize] = useState<(string | number)[]>([]);
  const [category, setCategory] = useState<(string | number)[]>([]);
  const [fitting, setFitting] = useState<(string | number)[]>([]);
  const [range, setRange] = useState([0, 0]);
  const [open, setOpen] = useState<number[]>([1, 2, 3, 4]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [fittingData, setFittingData] = useState<any[]>([]);
  const [sizeData, setSizeData] = useState<any>([]);
  const [categoryName, setCategoryName] = useState<string[]>([]);
  const [typeName, setTypeName] = useState<string[]>([]);
  const [openSelect, setOpenSelect] = useState(false);

  const router = useRouter();

  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const { data: brandData, isLoading: brandLoading } = useSWR(
    `${Backend_URL}/product-brands/all`,
    getData
  );

  const { data: typesData, isLoading: typesLoading } = useSWR(
    `${Backend_URL}/product-types/alls`,
    getData
  );

  // Load saved filter values from localStorage
  useEffect(() => {
    const savedFilters = isClient && localStorage.getItem("filters");
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      setGenders(filters.genders || []);
      setBrands(filters.brands || []);
      setType(filters.type || []);
      setRange(filters.range || [0, 0]);
      setBrandName(filters.brandName || []);
      setSize(filters.size || [1, 5]);
      setCategory(filters.category || [1, 5]);
      setCategoryName(filters.categoryName || []);
      setTypeName(filters.typeName || []);
      setFitting(filters.fitting || [1, 5]);
      if (typesData && filters.type && filters.type.length > 0) {
        setCategoryData(
          typesData.data
            .filter((el: any) => filters.type.includes(el.id))
            .flatMap((el: any) => el.productCategories)
        );
      }
    }
  }, [isClient, typesData]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGenderChange = (value: string) => {
    setGenders((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleBrandChange = (value: string | number) => {
    setBrands((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleTypeChange = (value: string | number) => {
    // Update the selected types
    const updatedTypes = type.includes(value)
      ? type.filter((item) => item !== value)
      : [...type, value];

    setType(updatedTypes);

    // If no type is selected, log all categories, otherwise log the selected categories
    const selectedCategories =
      updatedTypes.length === 0
        ? typesData.data
            ?.filter((el: any) => el.isArchived == null && el.productCategories)
            ?.flatMap((el: any) => el.productCategories)
            ?.filter((el: any) => el.isArchived == null && el.productCategories)
        : typesData.data
            ?.filter((el: any) => el.isArchived == null && el.productCategories)
            ?.filter((el: any) => updatedTypes.includes(el.id))
            ?.flatMap((el: any) => el.productCategories)
            ?.filter((el: any) => el.isArchived == null && el.productFittings);

    console.log(selectedCategories);

    setCategoryData(selectedCategories);
    setCategory([]);
    setCategoryName([]);
    setFittingData([]);
    setFitting([]);
    setSize([]);
    setSizeData([]);
  };

  const handleSizesChange = (value: string | number) => {
    setSize((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleCategoryChange = (value: string | number) => {
    // Update the selected types
    const updatedCategory = category.includes(value)
      ? category.filter((item) => item !== value)
      : [value];

    setCategory(updatedCategory);

    // If no category is selected, log all product fittings; otherwise, log the selected ones
    const selectedCategories =
      updatedCategory.length === 0
        ? categoryData.flatMap((el: any) => el.productFittings) // Log all product fittings if no category is selected
        : categoryData
            .filter((el: any) => updatedCategory.includes(el.id))
            .flatMap((el: any) => el.productFittings);

    // Convert Set to an array before setting the state
    setFittingData(
      selectedCategories.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      )
    );
    setFitting([]);
    setSize([]);
    setSizeData([]);
  };

  const handleFittingChange = (value: string | number) => {
    const updatedFitting = fitting.includes(value)
      ? fitting.filter((item) => item !== value)
      : [...fitting, value];

    setFitting(updatedFitting);

    const selectedFitting = fittingData
      ?.filter((el: any) => updatedFitting.includes(el.id))
      ?.flatMap((el: any) => el.productSizings)
      ?.filter((el: any) => el.isArchived == null);

    setSizeData(
      selectedFitting.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      )
    );

    setSize([]);
  };

  // Function to handle input changes

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Save filter values to localStorage
    isClient &&
      localStorage.setItem(
        "filters",
        JSON.stringify({
          genders,
          brands,
          type,
          range,
          open,
          brandName,
          size,
          category,
          categoryName,
          fitting,
          typeName,
        })
      );

    // Create an array to hold the query parameters
    const queryParams = [];

    // Add selected xgenders to the query parameters
    if (genders.length > 0) {
      console.log(genders.includes("Unisex"));
      if (!genders.includes("Unisex")) {
        queryParams.push(
          `sortGender=${genders.join(",").toLowerCase()},unisex`
        );
      } else {
        queryParams.push(`sortGender=${genders.join(",").toLowerCase()}`);
      }
    }

    // Add selected brands to the query parameters
    if (brands.length > 0) {
      queryParams.push(`sortBrand=${brands.join(",")}`);
    }

    // Add selected types to the query parameters
    if (type.length > 0) {
      queryParams.push(`sortType=${type.join(",")}`);
    }

    if (category.length > 0) {
      queryParams.push(`sortCategory=${category.join(",")}`);
    }

    if (fitting.length > 0) {
      queryParams.push(`sortFitting=${fitting.join(",")}`);
    }

    if (size.length > 0) {
      queryParams.push(`sortSizing=${size.join(",")}`);
    }

    const queryString =
      queryParams.length > 0 ? `/${queryParams.join("&")}` : "";

    // Add nameSegments to the URL if there are any
    let fullPath = `/products-filter`;

    if (
      genders.length == 0 &&
      brands.length == 0 &&
      type.length == 0 &&
      range[1] == 0 &&
      size.length == 0 &&
      category.length == 0
    ) {
      router.push(`${fullPath}/all?page=1`);
      setSearchInputValue("");
    } else {
      fullPath = `/products-filter${queryString}?page=1`;
      router.push(fullPath);
      setSearchInputValue("");
    }
  };

  return (
    <form className=" h-[90%] relative overflow-hidden" onSubmit={handleSubmit}>
      <div className="space-y-4 h-[90%] overflow-hidden overflow-y-auto">
        <div className="space-y-1.5">
          <div
            onClick={() => {
              if (open.includes(1)) {
                setOpen(open.filter((el) => el !== 1));
              } else {
                setOpen([...open, 1]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Gender</Label>
            {open.includes(1) ? <ChevronUp /> : <ChevronDown />}
          </div>

          {open.includes(1) && (
            <div className="grid grid-cols-2 gap-3">
              <FilterItem
                run={handleGenderChange}
                name="Men"
                value="Men"
                isChecked={genders.includes("Men")}
              />

              <FilterItem
                run={handleGenderChange}
                name="Women"
                value="Women"
                isChecked={genders.includes("Women")}
              />

              <FilterItem
                run={handleGenderChange}
                name="Unisex"
                value="Unisex"
                isChecked={genders.includes("Unisex")}
              />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <div
            onClick={() => {
              if (open.includes(2)) {
                setOpen(open.filter((el) => el !== 2));
              } else {
                setOpen([...open, 2]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Brands</Label>
            {open.includes(2) ? <ChevronUp /> : <ChevronDown />}
          </div>

          {open.includes(2) && (
            <div className="grid grid-cols-2 gap-3">
              {!brandLoading &&
                brandData?.data?.map(
                  ({ id, name }: { id: number; name: string }) => (
                    <div
                      key={id}
                      className="flex items-center select-none space-x-2 bg-secondary p-3"
                    >
                      <Checkbox
                        id={name}
                        checked={brands.includes(id)}
                        onCheckedChange={() => {
                          handleBrandChange(id);
                          setBrandName((prev) =>
                            prev.includes(name)
                              ? prev.filter((item) => item !== name)
                              : [...prev, name]
                          );
                        }}
                      />
                      <label
                        htmlFor={name}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {name}
                      </label>
                    </div>
                  )
                )}
            </div>
          )}
        </div>

        {/* types */}

        <div className="space-y-1.5">
          <div
            onClick={() => {
              if (open.includes(3)) {
                setOpen(open.filter((el) => el !== 3));
              } else {
                setOpen([...open, 3]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Product Types</Label>
            {open.includes(3) ? <ChevronUp /> : <ChevronDown />}
          </div>
          {open.includes(3) && (
            <div className="grid grid-cols-2 gap-3">
              {!typesLoading &&
                typesData.data
                  ?.filter((el: any) => el.isArchived == null)
                  .map(({ id, name }: { id: number; name: string }) => (
                    <FilterItem
                      key={id}
                      run={() => {
                        handleTypeChange(id);
                        setTypeName((prev) =>
                          prev.includes(name)
                            ? prev.filter((item) => item !== name)
                            : [...prev, name]
                        );
                      }}
                      name={name}
                      value={id}
                      isChecked={type.includes(id)}
                    />
                  ))}
            </div>
          )}
        </div>

        {/* categories */}
        <div className="space-y-1.5">
          <div
            onClick={() => {
              if (open.includes(5)) {
                setOpen(open.filter((el) => el !== 5));
              } else {
                setOpen([...open, 5]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Product Categories</Label>
            {open.includes(5) ? <ChevronUp /> : <ChevronDown />}
          </div>

          {open.includes(5) && (
            <div className=" w-full">
              <Popover open={openSelect} onOpenChange={setOpenSelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between !rounded-md"
                  >
                    {categoryName.length > 0
                      ? categoryName
                      : "Please Select Type First!"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Category..."
                      className="h-9"
                    />
                    <CommandEmpty>No category found!</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {categoryData?.map(({ id, name }: any) => (
                          <CommandItem
                            className={cn(
                              category[0] === id ? "bg-accent" : ""
                            )}
                            key={id}
                            value={name}
                            onSelect={() => {
                              const selectedCategory = categoryData.find(
                                (el: any) => el.id === id
                              );
                              setOpenSelect(false);
                              setCategoryName(selectedCategory?.name || "");
                              handleCategoryChange(id); // Pass the id instead of name
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                category.includes(id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* fittings */}
        <div className="space-y-1.5">
          <div
            onClick={() => {
              if (open.includes(8)) {
                setOpen(open.filter((el) => el !== 8));
              } else {
                setOpen([...open, 8]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Fittings</Label>
            {open.includes(8) ? <ChevronUp /> : <ChevronDown />}
          </div>

          {open.includes(8) && (
            <div className=" w-full">
              <>
                {fittingData?.length > 0 && (
                  <div className=" space-y-1.5 basis-1/2">
                    {fittingData?.map(({ id, name }: any) => (
                      <div
                        key={id}
                        className="flex items-center select-none space-x-2 bg-secondary p-3"
                      >
                        <Checkbox
                          id={name}
                          checked={fitting.includes(id)}
                          onCheckedChange={() => {
                            handleFittingChange(id);
                          }}
                        />
                        <label
                          htmlFor={name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </>
            </div>
          )}
        </div>

        {/* sizes */}

        <div className="space-y-1.5">
          <div
            onClick={() => {
              if (open.includes(6)) {
                setOpen(open.filter((el) => el !== 6));
              } else {
                setOpen([...open, 6]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Sizes</Label>
            {open.includes(6) ? <ChevronUp /> : <ChevronDown />}
          </div>

          {open.includes(6) && (
            <>
              {sizeData?.length > 0 && (
                <div className=" space-y-1.5 basis-1/2">
                  {sizeData?.map(({ id, name }: any) => (
                    <div
                      key={id}
                      className="flex items-center select-none space-x-2 bg-secondary p-3"
                    >
                      <Checkbox
                        id={name}
                        checked={size.includes(id)}
                        onCheckedChange={() => {
                          handleSizesChange(id);
                        }}
                      />
                      <label
                        htmlFor={name}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* <div className="space-y-1.5 ">
          <div
            onClick={() => {
              if (open.includes(4)) {
                setOpen(open.filter((el) => el !== 4));
              } else {
                setOpen([...open, 4]);
              }
            }}
            className="flex justify-between"
          >
            <Label>Prices</Label>
            {open.includes(4) ? <ChevronDown /> : <ChevronUp />}
          </div>
          {open.includes(4) && (
            <>
              <div className="flex gap-3 items-center">
                <Input
                  className="w-1/2"
                  value={range[0]}
                  onChange={(e) => handleInputChange(0, e.target.value)}
                  placeholder="Min"
                />
                <Input
                  className="w-1/2"
                  value={range[1]}
                  onChange={(e) => handleInputChange(1, e.target.value)}
                  placeholder="Max"
                />
              </div>
              <div className="pt-1.5 mx-2">
                <Slider
                  minStepsBetweenThumbs={1}
                  max={50000000}
                  min={50000}
                  step={1}
                  value={range}
                  onValueChange={handleRangeChange}
                  formatLabel={(value) => `${value}`}
                />
              </div>
            </>
          )}
        </div> */}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => {
              setGenders([]);
              setBrands([]);
              setBrandName([]);
              setType([]);
              setRange([50000, 0]);
              setSize([]);
              setCategory([]);
              setFitting([]);
              setSize([]);
              setSizeData([]);
              setFittingData([]);
              setCategoryData([]);
              setCategoryName([]);
            }}
            className="  underline"
            variant={"link"}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className=" absolute bottom-0 w-full  flex justify-between">
        <Button
          onClick={() => closeRef.current && closeRef.current.click()}
          type="button"
          variant="link"
        >
          Cancel
        </Button>

        <Button
          onClick={() => closeRef.current && closeRef.current.click()}
          type="submit"
        >
          Save changes
        </Button>
      </div>
    </form>
  );
};

export default FilterForm;
