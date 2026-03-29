import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderBarProps {
  title: string;
}

const HeaderBar = ({ title }: HeaderBarProps) => (
  <header className="flex h-12 items-center border-b bg-background px-4 gap-3">
    <SidebarTrigger />
    <h1 className="text-base font-bold italic text-foreground">{title}</h1>
  </header>
);

export default HeaderBar;
