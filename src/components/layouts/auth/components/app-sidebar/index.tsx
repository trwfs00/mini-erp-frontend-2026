import type { FC } from "react";
import { LogOut, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ActionIcon, Tooltip } from "@mantine/core";
import { NAV_ITEMS } from "@/consts/nav-config";
import { AuthUtil } from "@/utils/auth-util";
import classes from "./app-sidebar.module.css";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const AppSidebar: FC<AppSidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <nav className={classes.navbar} data-collapsed={collapsed || undefined}>
      <div className={classes.header}>
        {!collapsed && (
          <div className={classes.brand}>
            <div className={classes.logo}>
              <LayoutGrid size={16} strokeWidth={2.25} color="#fff" />
            </div>
            <span className={classes.brandText}>Mini ERP</span>
          </div>
        )}
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className={classes.toggleBtn}
        >
          {collapsed ? (
            <ChevronRight size={18} strokeWidth={2} />
          ) : (
            <ChevronLeft size={18} strokeWidth={2} />
          )}
        </ActionIcon>
      </div>

      <div className={classes.navbarMain}>
        {NAV_ITEMS.map((item) => {
          const link = (
            <NavLink key={item.path} to={item.path} className={classes.link}>
              {({ isActive }) => (
                <span
                  className={classes.linkInner}
                  data-active={isActive || undefined}
                >
                  <item.icon className={classes.linkIcon} strokeWidth={1.75} />
                  {!collapsed && (
                    <span className={classes.linkLabel}>{item.label}</span>
                  )}
                </span>
              )}
            </NavLink>
          );

          return collapsed ? (
            <Tooltip
              key={item.path}
              label={item.label}
              position="right"
              withArrow
              offset={12}
            >
              {link}
            </Tooltip>
          ) : (
            link
          );
        })}
      </div>

      <div className={classes.footer}>
        {collapsed ? (
          <Tooltip label="Logout" position="right" withArrow offset={12}>
            <button
              type="button"
              className={classes.link}
              onClick={() => AuthUtil.logout()}
            >
              <span className={classes.linkInner}>
                <LogOut className={classes.linkIcon} strokeWidth={1.75} />
              </span>
            </button>
          </Tooltip>
        ) : (
          <button
            type="button"
            className={classes.link}
            onClick={() => AuthUtil.logout()}
          >
            <span className={classes.linkInner}>
              <LogOut className={classes.linkIcon} strokeWidth={1.75} />
              <span className={classes.linkLabel}>Logout</span>
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
