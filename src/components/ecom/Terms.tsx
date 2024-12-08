import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

const Terms = () => {
  const router = useRouter();

  return (
    <div className=" py-5">
      <p className=" font-serif font-bold lg:text-2xl">Terms & Conditions</p>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>General Information</AccordionTrigger>
          <AccordionContent>
            By accessing and using this website, you agree to comply with the
            following terms and conditions. These terms apply to all users of
            the website, including browsers, customers, and merchants.{" "}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Product Availability</AccordionTrigger>
          <AccordionContent>
            Al products listed are subject to availability. We reserve the right
            to discontinue any product without notice. Prices and promotions may
            be subject to change.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger> Orders & Payment</AccordionTrigger>
          <AccordionContent>
            By placing an order, you agree to provide accurate and complete
            information. Payments are processed currently cash on delivery.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Shipping & Delivery</AccordionTrigger>
          <AccordionContent>
            We offer home delivery to all locations in Myanmar. Delivery times
            will be within (2)Days. Delivery costs wil be free of charges.
            Delays may occur due to unforeseen circumstances.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>Returns & Refunds</AccordionTrigger>
          <AccordionContent>
            We accept returns within one week of purchase for unused items in
            original condition if the sizes are not fitted. The right-sized item
            wil be re-delivered with delivery charges. *** Refunds wil not be
            paid. ***
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>Intellectual Property</AccordionTrigger>
          <AccordionContent>
            Al content on this website, including images, text, and logos, is
            the property of Boss Nation Authentic Fashion and is protected by
            copyright law. Unauthorized use is prohibited.{" "}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger>Privacy</AccordionTrigger>
          <AccordionContent>
            We respect your privacy and are committed to protecting your
            personal data.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger>Changes to Terms</AccordionTrigger>
          <AccordionContent>
            We reserve the right to modify these terms at any time. Changes wil
            be effective immediately upon posting on this page.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9">
          <AccordionTrigger>Contact Information</AccordionTrigger>
          <AccordionContent>
            For any questions or concerns, please{" "}
            <span
              onClick={() => router.push("/contact-us")}
              className=" underline cursor-pointer"
            >
              contact us.
            </span>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Terms;
