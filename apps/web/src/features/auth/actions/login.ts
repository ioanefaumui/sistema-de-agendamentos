"use server";

import { cookies } from "next/headers";
import { LoginFormSchema } from "../types";
import { redirect } from "next/navigation";
import { serverApi } from "@/lib";

export async function login(values: LoginFormSchema) {
  const { email, password } = values;

  const response = await fetch(`${serverApi}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const result = await response.json();
    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: result.access_token,
      httpOnly: true,
    });
    redirect("/servicos");
  }

  return { message: await response.json() };
}
