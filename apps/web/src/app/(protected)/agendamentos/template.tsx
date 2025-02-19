"use client";

import { useAuth } from "@/context";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default function Template({ children }: PropsWithChildren) {
  const { role } = useAuth();

  if (role === "admin") {
    return redirect("/servicos");
  }

  return children;
}
