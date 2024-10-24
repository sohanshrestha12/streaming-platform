"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return (
    <>
      <h2>Protected home page Welcome {session?.user?.username}</h2>
      <div className="flex gap-2">
          
        <Image
        className="rounded-full"
          src={
            session?.user?.image ||
            "https://images.unsplash.com/photo-1719937050601-969f4f25d060?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          width={30}
          height={30}
          alt="no user image found"
        />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    </>
  );
}
