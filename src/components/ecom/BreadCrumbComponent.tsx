"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { LucideChevronRight, Slash } from "lucide-react";

const BreadCrumbComponent = ({
  path,
  currentPage,
}: {
  path: string;
  currentPage: string;
}) => {
  const router = useRouter();
  return (
    <div className=" flex  justify-between items-center">
      <div className="space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage
                onClick={() => router.push("/")}
                className=" cursor-pointer !text-stone-500"
              >
                {path}
              </BreadcrumbPage>
            </BreadcrumbItem>
            {currentPage !== undefined && (
              <BreadcrumbSeparator>
                <LucideChevronRight />
              </BreadcrumbSeparator>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage className=" capitalize  !text-stone-500">
                {currentPage}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default BreadCrumbComponent;
