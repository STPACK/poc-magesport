"use client";

import React from "react";

import { ClientLayoutProps } from "./interface";
import { Header } from "../Header";

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="bg-background">
      <Header />
      <main>{children}</main>
      <footer className="flex justify-center py-[24px] text-black-2 bg-black-1/10 mt-[48px] shadow">
        <p>© 2024 Mega Sport Group. All rights reserved.</p>
      </footer>
    </div>
  );
}
