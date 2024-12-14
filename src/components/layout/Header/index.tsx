import React from "react";

import { HeaderProps } from "./interface";
import { cn } from "@/lib/util";
import Link from "next/link";

import { usePathname } from "next/navigation";

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();

    const isActive = (path: string) => pathname === path;
    
    console.log(pathname)
  return (
    <header
      className={cn(
        "flex justify-between px-[50px] py-[24px] items-center",
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
          className={cn("", { "text-black-1": isActive("/tax-invoice") })}
        >
          Tax Invoice
        </Link>
        <Link
          href="/#contact-us"
          className={cn("", { "text-black-1": isActive("/#contact-us") })}
        >
          Contact Us
        </Link>
      </div>
    </header>
  );
}
