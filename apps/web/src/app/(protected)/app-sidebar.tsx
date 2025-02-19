"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context";
import { Calendar, FileText, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Serviços",
    url: "/servicos",
    icon: FileText,
    roles: ["user", "admin"],
  },
  {
    title: "Agendamentos",
    url: "/agendamentos",
    icon: Calendar,
    roles: ["user"],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { role } = useAuth();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {role === "user" && "Menu"}
            {role === "admin" && "Painel admin"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(
                (item) =>
                  item.roles.includes(role!) && (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          {...(item.url === pathname && {
                            "aria-current": "page",
                          })}
                          className="aria-[current='page']:bg-primary aria-[current='page']:text-accent"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className="mt-auto p-4">
          <Link
            href="/api/auth/logout"
            className="flex w-fit items-center gap-x-2 hover:underline text-sm"
          >
            <LogOut className="size-4" />
            Sair
          </Link>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
