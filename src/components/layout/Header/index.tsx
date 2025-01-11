import React from "react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";

import { HeaderProps } from "./interface";
import { cn } from "@/lib/util";

import { usePathname } from "next/navigation";
import Image from "next/image";

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={cn(
        "flex justify-between desktop:px-[50px] px-[16px] py-[16px] items-center shadow-header ",
        className
      )}
    >
      <Link href="/" className="text-[28px] font-semibold">
       <Image src="/logo.png" width={48} height={48} alt="logo" />
      </Link>
      <div className="flex gap-[16px] font-light">
        <Link href="/" className={cn("", { "text-black-1": isActive("/") })}>
          หน้าหลัก
        </Link>
        <Link
          href="/tax-invoice"
          className={cn("", {
            "text-black-1": isActive("/tax-invoice"),
          })}
        >
          ใบกำกับภาษี
        </Link>

        <ScrollLink
          to="contact-us"
          smooth={true}
          duration={500}
          className={cn("", {
            "text-black-1": isActive("/#contact-us"),
          })}
        >
          <span className="cursor-pointer">ติดต่อเรา</span>
        </ScrollLink>
      </div>
    </header>
  );
}
