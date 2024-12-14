import React from "react";

import { HomePageProps } from "./interface";

export function HomePage({ className }: HomePageProps) {
  return (
    <div>
      HomePage
      <section id="contact-us" className="mt-[2000px]">
        <h2>Contact Us</h2>
        {/* Contact Us content */}
      </section>
    </div>
  );
}
