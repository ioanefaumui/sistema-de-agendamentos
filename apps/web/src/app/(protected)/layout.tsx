import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "./app-sidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <header className="p-3 border-b">
          <SidebarTrigger className="cursor-pointer" />
        </header>
        {children}
      </div>
    </SidebarProvider>
  );
}
