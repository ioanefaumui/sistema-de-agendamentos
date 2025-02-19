import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { AuthProvider } from "@/context";

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
    <AuthProvider initialRole={role} initialToken={token}>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col w-full">
          <header className="sticky top-0 z-40 p-3 border-b dark:bg-background bg-background">
            <SidebarTrigger className="cursor-pointer" />
          </header>
          {children}
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
