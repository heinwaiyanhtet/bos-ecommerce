import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import React from "react";

const Page = () => {
  return (
    <div className="lg:ps-8">
      <div
        className={`flex items-center w-1/2   border border-gold-400 p-5 justify-between rounded-xl`}
      >
        <RadioGroup defaultValue={"Delivery"}>
          <div className=" flex items-center gap-2">
            <RadioGroupItem value={`Delivery`} />
            <Label>Cash On Delivery</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Page;
