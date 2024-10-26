import React from "react";
import { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const { Title } = Typography;
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { LoginPageProps } from "./interface";
import { useRouter } from "next/navigation";

export function LoginPage({ className }: LoginPageProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push("/admin-back-office");
    } catch (e) {
      console.log(e)
      toast.error("Please check your email and password", {
        position:"top-center"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-slate-100">
      <div className="w-full max-w-[500px] p-8 bg-white rounded-lg shadow-md mx-[16px]">
        <Title level={1} className="text-center mb-6">
          ADMIN LOGIN
        </Title>
        <Form
          name="login_form"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ remember: true }}
          className="mt-[32px]"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
            className="mb-[32px]"
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
            className="mb-[32px]"
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="w-full hover:opacity-80"
              style={{
                background: "linear-gradient(135deg, #6253e1, #04befe)",
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
