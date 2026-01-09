import { createContext, useContext } from 'react';

interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    openSubMenus: Record<string, boolean>;
    setOpenSubMenus: (menus: Record<string, boolean>) => void;
    toggleSubMenu: (menuKey: string) => void;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
