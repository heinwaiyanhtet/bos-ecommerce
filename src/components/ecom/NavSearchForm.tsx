import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

const NavSearchForm = ({
  debouncedValue,
  handleInputChange,
  data,
  setDebouncedValue,
}: any) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isClickingSuggestion, setIsClickingSuggestion] = useState(false);
  const router = useRouter();

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
    } else if (debouncedValue === "") {
      setShowSuggestions(false);
    }
  }, [data, debouncedValue]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search/${debouncedValue}?page=1`);
        setShowSuggestions(false);
      }}
      className="relative"
    >
      <div className="border-input w-full rounded border flex items-center">
        <Button
          type="submit"
          className="!h-8 border-0 -me-2 rounded-e-0"
          variant="ghost"
        >
          <Search />
        </Button>
        <Input
          value={debouncedValue}
          onChange={handleInputChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          placeholder="Search..."
          className="w-[80%] border-none h-9 bg-transparent rounded-none focus:outline-none focus:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div
        className={`${
          showSuggestions
            ? "opacity-100 h-auto block translate-y-0 pointer-events-auto"
            : "opacity-0 h-0 translate-y-10 pointer-events-none"
        } duration-300 fixed border w-[300px] border-gray-300 bg-white p-2.5 flex flex-col divide-y`}
        onMouseDown={() => setIsClickingSuggestion(true)}
        onMouseUp={() => setIsClickingSuggestion(false)}
      >
        {data?.map((item: any, index: number) => (
          <Button
            variant={"ghost"}
            onClick={async (e) => {
              e.stopPropagation();
              await setDebouncedValue(item.name);
              setShowSuggestions(false);
            }}
            key={index}
            className=" flex justify-start text-start"
          >
            {item.name}
          </Button>
        ))}
      </div>
    </form>
  );
};

export default NavSearchForm;
