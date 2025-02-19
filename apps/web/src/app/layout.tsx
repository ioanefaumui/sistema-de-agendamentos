import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

const manrope = Manrope({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema de agendamentos",
  description: "Criar e gerenciar agendamentos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let role: string | null = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      role = (payload.role as string) || null;
    } catch (error) {
      console.error("Token invalid or expired:", error);
      cookieStore.delete("token");
    }
  }

  return (
    <html lang="pt-BR">
      <body className={`${manrope.className} antialiased`}>
        <AuthProvider initialRole={role} initialToken={token}>
          <NextTopLoader showSpinner={false} />
          {children}
          <Toaster position="top-right" duration={5000} />
        </AuthProvider>
      </body>
    </html>
  );
}
