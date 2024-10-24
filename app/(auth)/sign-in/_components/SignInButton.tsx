'use client'
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const SignInButton = () => {
    const handleSignIn = () => {
      signIn("google", { callbackUrl: "/" });
    };
  return (
    <Button onClick={handleSignIn}>Sign in with google</Button>
  )
}

export default SignInButton
