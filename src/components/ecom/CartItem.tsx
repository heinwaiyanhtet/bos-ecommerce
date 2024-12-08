import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { Minus, PlusIcon, X } from "lucide-react";
import { useAppProvider } from "@/app/Provider/AppProvider";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CartItem = ({ data }: any) => {
  const { removeFromCart, setOrderRecord, orderRecord } = useAppProvider();

  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(`/products/wishlist/${data?.productId}`);
      }}
      className=" cursor-pointer"
    >
      <div className=" grid grid-cols-5 gap-4">
        <div className=" col-span-2">
          <div className=" border rounded-xl border-gold-400">
            <Image
              src={data?.photo}
              width={300}
              className=" h-[170px] lg:h-[240px] rounded-xl object-cover object-top duration-300"
              height={300}
              alt=""
            />
          </div>
        </div>
        <div className=" col-span-3">
          <div className="">
            <div className=" flex items-center gap-2">
              <p className=" mb-2 lg:text-xl font-serif text-sm line-clamp-1">
                {data?.name}
              </p>
            </div>

            {(data.discount as number) > 0 ? (
              <div className=" space-y-1 mb-2 text-xs lg:text-sm">
                <Badge className=" text-black font-normal h-4 text-xs bg-neutral-300">
                  {data.discount}%
                </Badge>

                <div className="lg:flex gap-2 items-center">
                  <p className=" line-through">
                    {new Intl.NumberFormat("ja-JP").format(
                      data.quantity * data.salePrice
                    )}{" "}
                    MMK
                  </p>
                  <p className="text-xs lg:text-sm">
                    {new Intl.NumberFormat("ja-JP").format(
                      data?.quantity * data.priceAfterDiscount
                    )}
                    MMK
                  </p>
                </div>
              </div>
            ) : (
              <p className=" text-stone-500 mb-2 text-xs lg:text-base">
                {new Intl.NumberFormat("ja-JP").format(
                  data?.quantity * data.salePrice
                )}{" "}
                MMK
              </p>
            )}

            <div className=" flex items-center mb-2 gap-2">
              <div className=" flex gap-3 items-center">
                <div
                  style={{
                    backgroundImage: `url(${data.photo})`,
                  }}
                  className=" size-6 bg-red-900 border border-gold-400 rounded-full bg-cover bg-center"
                ></div>
              </div>

              <p className="  px-4 rounded-full bg-stone-300 py-1  text-xs text-primary lg:text-sm font-normal">
                {data.productSizing}
              </p>
            </div>

            <div className=" flex gap-1 items-center">
              <p className="text-neutral-500 mb-2 text-xs">Quantity</p>
              <div className=" rounded-md mb-3 flex items-center">
                <Button
                  className="rounded-full size-5 hover:text-gold-400 hover:border-gold-400 p-0 bg-transparent active:scale-90 duration-300 hover:bg-transparent border-2 border-stone-700 text-lg text-stone-700 d-flex justify-items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (data?.quantity > 1) {
                      setOrderRecord(
                        orderRecord.map((item: any) => {
                          if (item.itemId === data.itemId) {
                            return {
                              ...item,
                              quantity: item.quantity - 1,
                            };
                          }
                          return item;
                        })
                      );
                    } else {
                      removeFromCart(data?.itemId);
                    }
                  }}
                >
                  <Minus size={16} />
                </Button>

                <p className=" text-center w-[2rem]">{data.quantity}</p>

                <Button
                  className="rounded-full hover:border-gold-400 hover:text-gold-400 size-5 p-0 bg-transparent active:scale-90 duration-300 hover:bg-transparent border-2 border-stone-700 text-lg text-stone-700 d-flex justify-items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (data?.availableQuantity > data?.quantity) {
                      const newOrderRecord = orderRecord.map((item: any) => {
                        if (item.itemId === data.itemId) {
                          return {
                            ...item,
                            quantity: item.quantity + 1,
                          };
                        }
                        return item;
                      });
                      setOrderRecord(
                        newOrderRecord.filter(
                          (item: any) => item.quantity !== 0
                        )
                      );
                    } else {
                      toast.warning("No More item!", {
                        duration: 2000,
                      });
                    }
                  }}
                >
                  <PlusIcon size={16} />
                </Button>
              </div>
            </div>

            <div className=" flex gap-3 items-center">
              <Button
                onClick={async (e) => {
                  removeFromCart(data.itemId);
                  e.stopPropagation();
                }}
                className=" text-start underline justify-start p-0 lg:text-xs text-[11px] text-stone-400"
                variant={"link"}
              >
                Remove
              </Button>

              <Button
                className=" bg-gold-400 hover:bg-[#e2be6a] rounded-full text-xs "
                size={"sm"}
              >
                See More
              </Button>
            </div>
          </div>
        </div>
      </div>
      <hr className=" my-2" />
    </div>
  );
};

export default CartItem;
