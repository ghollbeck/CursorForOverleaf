import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import './sidebar.css';

// Constants
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

// Types
type SidebarState = "expanded" | "collapsed";
type SidebarSide = "left" | "right";
type SidebarVariant = "sidebar" | "floating" | "inset";
type SidebarCollapsible = "offcanvas" | "icon" | "none";

interface SidebarContextType {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean | ((value: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  side?: SidebarSide;
  variant?: SidebarVariant;
  collapsible?: SidebarCollapsible;
}

// Context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Provider
export function SidebarProvider({
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  ...props
}: SidebarProviderProps) {
  const [open, _setOpen] = useState(defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Set open state
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      setOpen(!open);
    }
  }, [isMobile, open, openMobile, setOpen]);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === SIDEBAR_KEYBOARD_SHORTCUT) {
        e.preventDefault();
        toggleSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use controlled state if provided
  useEffect(() => {
    if (openProp !== undefined) {
      _setOpen(openProp);
    }
  }, [openProp]);

  return (
    <SidebarContext.Provider
      value={{
        state: open ? "expanded" : "collapsed",
        open: openProp !== undefined ? openProp : open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }}
    >
      <div
        className="sidebar-provider text-sidebar-foreground"
        data-sidebar-state={open ? "expanded" : "collapsed"}
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
          ...props.style,
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

// Hook
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// Components
export function Sidebar({
  children,
  side = "left",
  variant = "sidebar",
  collapsible = "icon",
  className,
  ...props
}: SidebarProps) {
  const { state, open, openMobile, isMobile } = useSidebar();

  return (
    <aside
      className={`sidebar ${className || ""}`}
      data-side={side}
      data-variant={variant}
      data-state={state}
      data-collapsible={collapsible}
      data-mobile={isMobile}
      data-mobile-open={openMobile}
      {...props}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`sidebar-header ${className || ""}`} {...props} />;
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`sidebar-content ${className || ""}`} {...props} />;
}

export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`sidebar-footer ${className || ""}`} {...props} />;
}

export function SidebarGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`sidebar-group ${className || ""}`} {...props} />;
}

export function SidebarGroupLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`sidebar-group-label ${className || ""}`} {...props} />;
}

export function SidebarGroupContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`sidebar-group-content ${className || ""}`} {...props} />;
}

export function SidebarGroupAction({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`sidebar-group-action ${className || ""}`} {...props} />;
}

export function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={`sidebar-menu ${className || ""}`} {...props} />;
}

export function SidebarMenuItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={`sidebar-menu-item ${className || ""}`} {...props} />;
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  asChild?: boolean;
}

export function SidebarMenuButton({
  className,
  isActive,
  asChild,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? React.Fragment : "button";
  const childProps = asChild ? props.children.props : props;

  return (
    <Comp
      className={`sidebar-menu-button peer/menu-button ${className || ""}`}
      data-active={isActive}
      {...childProps}
    >
      {asChild ? props.children.props.children : props.children}
    </Comp>
  );
}

export function SidebarMenuAction({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`sidebar-menu-action ${className || ""}`} {...props} />;
}

export function SidebarMenuSub({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={`sidebar-menu-sub ${className || ""}`} {...props} />;
}

export function SidebarMenuSubItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={`sidebar-menu-sub-item ${className || ""}`} {...props} />;
}

export function SidebarMenuSubButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`sidebar-menu-sub-button ${className || ""}`} {...props} />;
}

export function SidebarMenuBadge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={`sidebar-menu-badge ${className || ""}`} {...props} />;
}

export function SidebarMenuSkeleton({
  className,
  showIcon = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { showIcon?: boolean }) {
  return (
    <div className={`sidebar-menu-skeleton ${className || ""}`} {...props}>
      {showIcon && <div className="sidebar-menu-skeleton-icon" />}
      <div className="sidebar-menu-skeleton-text" />
    </div>
  );
}

export function SidebarSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={`sidebar-separator ${className || ""}`} {...props} />;
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className={`sidebar-trigger ${className || ""}`}
      onClick={toggleSidebar}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="9" x2="9" y1="3" y2="21" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

export function SidebarRail({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { toggleSidebar } = useSidebar();

  return (
    <div
      className={`sidebar-rail ${className || ""}`}
      onClick={toggleSidebar}
      {...props}
    >
      <div className="sidebar-rail-indicator" />
    </div>
  );
}

export function SidebarInset({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { state } = useSidebar();

  return (
    <div
      className={`sidebar-inset ${className || ""}`}
      data-state={state}
      {...props}
    />
  );
} 