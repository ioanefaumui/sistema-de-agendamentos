"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  FormMessage,
} from "@/components";
import { useForm } from "react-hook-form";
import { LoginFormSchema } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "../utils";
import Link from "next/link";
import { login } from "../actions";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: LoginFormSchema) => {
    const response = await login(values);

    if (response.message.error) {
      form.setError("email", { message: "Email ou senha inválidos" });
      form.setError("password", { message: "Email ou senha inválidos" });
    }
    console.log(response);
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Sistema de agendamentos</CardTitle>
        <CardDescription>Crie sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="w-full" onSubmit={form.handleSubmit(handleLogin)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="Senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="mt-6 w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex gap-x-1 justify-center text-sm text-muted-foreground">
        <p className="">Não possui uma conta?</p>{" "}
        <Link href={"/"} className="hover:underline hover:text-foreground">
          Cadastrar
        </Link>
      </CardFooter>
    </Card>
  );
}
