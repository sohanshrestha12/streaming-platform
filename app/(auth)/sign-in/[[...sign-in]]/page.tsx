"use client"
import { signIn } from "next-auth/react";

export default function Page() {

  return (
   <button onClick={() => signIn("google", { callbackUrl: "/" })}>
      Sign In
    </button>
  );
}
