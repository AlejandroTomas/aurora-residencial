import { ReactNode } from "react";
import AppLayout, { NavItem } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: LayoutProps) => {
  const items: NavItem[] = [{ label: "Inicio", url: "/", icon: "home" }];

  return (
    <AppLayout items={items} brand="Aurora Admin" brandLetter="A">
      <main
        className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-4 pt-[calc(1rem+var(--ios-navbar-offset,0px))] md:p-6 md:pt-[calc(1.5rem+var(--ios-navbar-offset,0px))]"
        style={{
          WebkitOverflowScrolling: "touch",
          paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom,0px))",
        }}
      >
        {children}
      </main>
    </AppLayout>
  );
};

export default AdminLayout;
