"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { User, CreditCard, PieChart, TrendingUp, Settings, BarChart2, Repeat, FileText } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/AuthContext";
import { Separator } from "@/components/ui/separator";

const items = [
    {
        title: "Overview",
        url: "/dashboard",
        icon: PieChart,
    },
    {
        title: "Income",
        url: "/dashboard/income",
        icon: TrendingUp,
    },
    {
        title: "Expenses",
        url: "/dashboard/expenses",
        icon: CreditCard,
    },
    {
        title: "Investments",
        url: "/dashboard/investments",
        icon: BarChart2,
    },
    {
        title: "Opportunities",
        url: "/dashboard/opportunities",
        icon: TrendingUp,
    },
    {
        title: "Recurring",
        url: "/dashboard/recurring",
        icon: Repeat,
    },
    {
        title: "Reports",
        url: "/dashboard/reports",
        icon: FileText,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2 px-2 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                            WM
                        </div>
                        <div className="flex flex-col gap-0.5 leading-none">
                            <span className="font-semibold">Wealth Manager</span>
                            <span className="text-xs text-muted-foreground">v1.0.0</span>
                        </div>
                    </div>
                </SidebarHeader>
                <Separator className="bg-sidebar-border" />
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname === item.url}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.url}>
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src="" alt={user?.username || "User"} />
                                    <AvatarFallback className="rounded-lg">{user?.username?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user?.username || "User"}</span>
                                    <span className="truncate text-xs">Pro Plan</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex-1">
                        {/* Breacrumbs could go here */}
                        <h1 className="text-lg font-semibold capitalize">
                            {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
                        </h1>
                    </div>
                </header>
                <div className="flex-1 space-y-4 p-4 pt-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
