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
import { RegisterFormSchema } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema } from "../utils";
import Link from "next/link";
import { register } from "../actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { delay } from "@/utils";
import { redirect } from "next/navigation";

export function RegisterForm() {
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordCopy: "",
    },
  });

  const handleRegister = async (values: RegisterFormSchema) => {
    const response = await register(values);

    if (!response.success) {
      return toast.error(
        "Houve um erro no servidor. Tente novamente mais tarde."
      );
    }

    toast.success(
      "Cadastro realizado com sucesso! Você será redirecionado para o login."
    );
    await delay(2000);
    redirect("/login");
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Crie sua conta</CardTitle>
        <CardDescription>Comece a fazer agendamentos</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="w-full" onSubmit={form.handleSubmit(handleRegister)}>
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
            <FormField
              control={form.control}
              name="passwordCopy"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Confirmar senha</FormLabel>
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
                "Cadastrar"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex gap-x-1 justify-center text-sm">
        <p className="text-muted-foreground">Já possui uma conta?</p>{" "}
        <Link href={"/"} className="hover:underline hover:text-foreground">
          Login
        </Link>
      </CardFooter>
    </Card>
  );
}
