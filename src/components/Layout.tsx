import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";
import FooterBar from "./FooterBar";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title = "Formulários Congregacionais" }: LayoutProps) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <HeaderBar title={title} />
        <main className="flex-1 bg-muted/40 p-6">
          {children}
        </main>
        <FooterBar />
      </div>
    </div>
  </SidebarProvider>
);

export default Layout;
