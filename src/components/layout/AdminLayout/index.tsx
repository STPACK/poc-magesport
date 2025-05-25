"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { usePathname } from "next/navigation";
import {
  ProfileOutlined,
  PieChartOutlined,
  AppstoreOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { useAuthentication } from "@/hooks/auth/useAuthentication";
import Image from "next/image";

const { Sider } = Layout;

const items = [
  {
    key: "/admin-back-office/retail-store",
    icon: <PieChartOutlined />,
    label: <Link href="/admin-back-office/retail-store">Retail Store</Link>,
  },
  {
    key: "/admin-back-office/tax-management",
    icon: <ProfileOutlined />,
    label: <Link href="/admin-back-office/tax-management">Tax Management</Link>,
  },
  {
    key: "banner",
    icon: <AppstoreOutlined />,
    label: "Banner",
    children: [
      {
        key: "/admin-back-office/banner",
        label: <Link href="/admin-back-office/banner">List</Link>,
      },
      {
        key: "/admin-back-office/banner/management",
        label: (
          <Link href="/admin-back-office/banner/management">Management</Link>
        ),
      },
    ],
  },
  {
    key: "/admin-back-office/partner",
    icon: <ProfileOutlined />,
    label: <Link href="/admin-back-office/partner">Partner</Link>,
  },
];

export const AdminLayout = ({
  children,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuthentication();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="w-full h-[64px] p-[16px] mb-[32px]">
          <Image
            src="/logo.png"
            width={48}
            height={48}
            alt="logo"
            className="mx-auto"
          />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          selectedKeys={[pathname]} // highlight the active route
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <div
          style={{ background: "white", padding: "16px 32px" }}
          className="all-center shadow-xl w-full border-b-2"
        >
          <Button
            icon={<LogoutOutlined />}
            className="ml-auto"
            onClick={logout}
          >
            Logout
          </Button>
        </div>

        <div
          className="overflow-y-auto h-full"
          style={{
            padding: 32,
            maxHeight: "calc(100vh - 66px)",
            background: "white",
            borderRadius: "8px",
          }}
        >
          {children}
        </div>
      </Layout>
    </Layout>
  );
};
