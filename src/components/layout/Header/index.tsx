import React from "react";
import Link from "next/link";
import { Link as ScrollLink } from "react-scroll";
import {
  BankOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  MailOutlined,
} from "@ant-design/icons";

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
        "sticky top-0 z-50 bg-white flex justify-between desktop:px-[50px] px-[16px] h-[64px] items-center shadow-header ",
        className
      )}
    >
      <Link href="/" className="text-[28px] font-semibold">
        <Image src="/logo.png" width={48} height={48} alt="logo" />
      </Link>
      <div className="flex h-[64px] gap-[24px] font-light mobile-tablet:text-[12px] mobile-tablet:gap-[16px]">
        <Link
          href="/"
          className={cn("flex-col all-center px-3 mobile-tablet:px-1", {
            "text-info border-b-2 border-info": isActive("/"),
          })}
        >
          <HomeOutlined />
          Home
        </Link>
        <ScrollLink
          to="sales-channels"
          smooth={true}
          duration={500}
          offset={-80}
          className="flex-col all-center cursor-pointer px-3 mobile-tablet:px-1"
        >
          <Link href="/#sales-channels" className={cn("flex-col all-center")}>
            <ShoppingCartOutlined />
            Channels
          </Link>
        </ScrollLink>
        <Link
          href="/tax-invoice"
          className={cn("flex-col all-center px-3 mobile-tablet:px-1", {
            "text-info border-b-2 border-info": isActive("/tax-invoice"),
          })}
        >
          <BankOutlined />
          Tax
        </Link>
        <ScrollLink
          to="contact-us"
          smooth={true}
          duration={500}
          className={cn(
            "flex-col all-center cursor-pointer px-3 mobile-tablet:px-1",
            {
              "text-info border-b-2 border-info": isActive("/#contact-us"),
            }
          )}
        >
          <MailOutlined />
          Contact Us
        </ScrollLink>
      </div>
    </header>
  );
}
