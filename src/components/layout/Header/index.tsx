import React from "react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";

import { HeaderProps } from "./interface";
import { cn } from "@/lib/util";

import { usePathname } from "next/navigation";

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={cn(
        "flex justify-between px-[50px] py-[16px] items-center shadow-header ",
        className
      )}
    >
      <Link href="/" className="text-[28px] font-semibold">
        Mega Sport Group
      </Link>
      <div className="flex gap-[16px] font-light">
        <Link href="/" className={cn("", { "text-black-1": isActive("/") })}>
          Home
        </Link>
        <Link
          href="/tax-invoice"
          className={cn("", {
            "text-black-1": isActive("/tax-invoice"),
          })}
        >
          Tax Invoice
        </Link>
        {pathname === "/" ? (
          <ScrollLink
            to="contact-us"
            smooth={true}
            duration={500}
            className={cn("", {
              "text-black-1": isActive("/#contact-us"),
            })}
          >
            <span className="cursor-pointer">Contact Us</span>
          </ScrollLink>
        ) : (
          <Link
            href="/#contact-us"
            className={cn("", {
              "text-black-1": isActive("/#contact-us"),
            })}
          >
            Contact Us
          </Link>
        )}
      </div>
    </header>
  );
}
