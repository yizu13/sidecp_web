import { useState, useEffect, ReactNode } from 'react';
import { SidebarContext } from './sidebarContext';

interface SidebarProviderProps {
    children: ReactNode;
}

export default function SidebarProvider({ children }: SidebarProviderProps) {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved !== null ? JSON.parse(saved) : false;
    });

    const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>(() => {
        const saved = localStorage.getItem('sidebarOpenSubMenus');
        return saved !== null ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    useEffect(() => {
        localStorage.setItem('sidebarOpenSubMenus', JSON.stringify(openSubMenus));
    }, [openSubMenus]);

    const toggleSubMenu = (menuKey: string) => {
        setOpenSubMenus(prev => ({
            ...prev,
            [menuKey]: !prev[menuKey]
        }));
    };

    const value = {
        isCollapsed,
        setIsCollapsed,
        openSubMenus,
        setOpenSubMenus,
        toggleSubMenu
    };

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
}
