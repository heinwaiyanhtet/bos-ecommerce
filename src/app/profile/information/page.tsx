"use client";

import { useAppProvider } from "@/app/Provider/AppProvider";
import FormInput from "@/components/FormInput.components";
import { Button } from "@/components/ui/button";
import { Backend_URL } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SweetAlert2 from "react-sweetalert2";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const UserInfoPage = () => {

  const [isClient, setIsClient] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const {
  
    getSession,

  } = useAppProvider();

  const getData = async (url: string) => {
    try {
      const token = isClient && getSession();
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      return data;
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, mutate } = useSWR(
    userId !== null ? `${Backend_URL}/ecommerce-users/${userId}` : null,
    getData
  );

  useEffect(() => {
    if (isClient) setUserId(localStorage.getItem("userId"));
  }, [isClient]);

  const patchUser = async (url: string, { arg }: any) => {
    try {
      const token = isClient && getSession();
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(arg),
      };
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }
      return response;
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  const {
    data: editUserData,
    error: editUserError,
    trigger: editUser,
    isMutating,
  } = useSWRMutation(
    userId !== null ? `${Backend_URL}/ecommerce-users/${userId}` : null,
    patchUser
  );

  const schema = z.object({
    name: z.string().min(3, { message: "This field cannot be empty!" }),
    phone: z.string().min(1, { message: "This field cannot be empty!" }),
    email: z.string().email({ message: "Invalid email format!" }),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
      });
    }
  }, [data]);

  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
  });

  const { handleLogin } = useAppProvider();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const alertRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isClient) {
      if (!localStorage.getItem("accessToken")) {
        alertRef.current?.click();
      }
    }
  }, [isClient]);

  const onSubmit = async (values: any) => {
    const res = await editUser(values);
    if (res) {
      mutate();
      closeRef?.current && closeRef.current.click();
      toast.success("User information updated successfully");
    }

    console.log(res);
  };

  const btn = useRef<HTMLButtonElement | null>(null);
  const phoneBtn = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <div className=" space-y-4 pb-3 ">
        {editUserError && (
          <p className=" text-sm text-red-500">{editUserError.message}</p>
        )}

        <div className="gap-3 grid grid-cols-1">
          <div className=" space-y-0.5">
            <div className=" flex border-b justify-between items-center">
              <div className=" lg:ps-8 pb-4">
                <p className=" font-normal font-serif text-lg">Name</p>
                <p className=" font-thin text-stone-500 font-serif text-lg">
                  {data?.name}
                </p>
              </div>
              <Button
                onClick={() => btn?.current?.click()}
                variant={"link"}
                size={"sm"}
              >
                Edit
              </Button>
            </div>

            <div className=" flex border-b justify-between items-center">
              <div className=" ps-8 py-4">
                <p className=" font-normal font-serif text-lg">Phone</p>
                <p className=" font-thin text-stone-500 font-serif text-lg">
                  {data?.phone}
                </p>
              </div>
              <Button
                onClick={() => phoneBtn?.current?.click()}
                variant={"link"}
                size={"sm"}
              >
                Edit
              </Button>
            </div>

            <div className=" flex border-b justify-between items-center">
              <div className=" ps-8 py-4">
                <p className=" font-normal font-serif text-lg">Email</p>
                <p className=" font-thin text-stone-500 font-serif text-lg">
                  {data?.email}
                </p>
              </div>
            </div>

            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name?.message}</p>
            )}
          </div>

          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone?.message}</p>
          )}

          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email?.message}</p>
          )}
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="hidden" ref={btn} variant="outline">
            Show Dialog
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle></AlertDialogTitle>
            <AlertDialogDescription className="  !text-primary">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                  label="Name"
                  {...register("name")}
                  type="text"
                  id={"name"}
                  disabled={isMutating}
                />
                <div className=" flex justify-end mt-4 gap-4">
                  <Button
                    onClick={() => closeRef.current && closeRef.current.click()}
                    variant={"outline"}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    className=" bg-gold-400 hover:bg-gold-500"
                    type="submit"
                    disabled={isMutating}
                  >
                    Update
                  </Button>
                </div>
              </form>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={closeRef} type="button" className=" hidden">
              Close
            </AlertDialogCancel>
            <AlertDialogAction className=" hidden">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="hidden" ref={phoneBtn} variant="outline">
            Show Dialog
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle></AlertDialogTitle>
            <AlertDialogDescription className="  !text-primary">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                  label="Phone"
                  {...register("phone")}
                  type="number"
                  disabled={isMutating}
                  id={"phone"}
                />
                <div className=" flex justify-end mt-4 gap-4">
                  <Button
                    onClick={() => closeRef.current && closeRef.current.click()}
                    variant={"outline"}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    className=" bg-gold-400 hover:bg-gold-500"
                    type="submit"
                    disabled={isMutating}
                  >
                    Update
                  </Button>
                </div>
              </form>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel ref={closeRef} type="button" className=" hidden">
              Close
            </AlertDialogCancel>
            <AlertDialogAction className=" hidden">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* for login */}

      <div onClick={(e) => e.stopPropagation()}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className=" hidden"
              onClick={(e) => e.stopPropagation()}
              ref={alertRef}
              variant="outline"
            >
              Sign In To Continue
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className=" w-[400px] flex justify-center items-center flex-col py-6">
            <AlertDialogHeader>
              <AlertDialogTitle>Sign In To Continue!</AlertDialogTitle>
              <AlertDialogDescription>
                You need to sign in to continue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => router.push("/")}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  handleLogin();
                  e.stopPropagation();
                }}
              >
                Log in
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default UserInfoPage;
