"use client";

import React from "react";

import { ClientLayoutProps } from "./interface";
import { Header } from "../Header";

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="bg-background">
      <Header />
      <main>{children}</main>
      <footer></footer>
    </div>
  );
}
