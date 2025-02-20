"use server";

import { cookies } from "next/headers";
import { RegisterFormSchema } from "../types";
import { api } from "@/lib";

export async function register(values: RegisterFormSchema) {
  const { email, password } = values;
  let success = false;

  const response = await fetch(`${api}/users`, {
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
    success = true;
    return { success };
  }

  return { success };
}
