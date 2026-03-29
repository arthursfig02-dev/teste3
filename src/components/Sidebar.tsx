import { Home, Map, Settings, BookOpen, Users } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { label: "Início", href: "/", icon: Home },
  { label: "Serviço de Campo", href: "/servico-de-campo", icon: Map },
  { label: "Designações Mecânicas", href: "/designacoes", icon: Settings },
  { label: "Vida e Ministério", href: "/vida-ministerio", icon: BookOpen },
  { label: "Reunião Pública", href: "/reuniao-publica", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="absolute inset-0 sidebar-gradient pointer-events-none" />
      <SidebarContent className="relative z-10">
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary-foreground/60 uppercase tracking-wide text-xs font-semibold px-3">
            {!collapsed && "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <NavLink
                      to={item.href}
                      end={item.href === "/"}
                      className="text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                      activeClassName="bg-primary-foreground/15 text-primary-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
