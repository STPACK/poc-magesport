import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Mega Group",
  description: "Mega Group- Brand Authorized Distributor - สินค้าลิขสิทธิ์แท้ จากตัวแทนจำหน่ายอย่างเป็นทางกา",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </AntdRegistry>

        <ToastContainer
          autoClose={2000}
          closeButton={false}
          hideProgressBar
          closeOnClick
          rtl={false}
          position="top-right"
          pauseOnHover
          draggable={false}
        />
      </body>
    </html>
  );
}
