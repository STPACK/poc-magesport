import React from "react";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

import { LoginPageProps } from "./interface";
import { useRouter } from "next/navigation";

export function LoginPage({ className }: LoginPageProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
     
        await signInWithEmailAndPassword(auth, email, password);
        
        alert("Signed in successfully!");
        router.push("/admin-back-office")
    
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="flex flex-col">
      <h1>Sign In</h1>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
