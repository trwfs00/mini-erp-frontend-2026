import type { FC } from "react";
import { LogOut, LayoutGrid, ChevronLeft, ChevronRight, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ActionIcon, Tooltip } from "@mantine/core";
import { useStore } from "@nanostores/react";
import { NAV_ITEMS } from "@/consts/navConfig";
import { AuthUtil } from "@/utils/AuthUtil";
import { PermissionUtil } from "@/utils/PermissionUtil";
import { $authUser } from "@/stores/authUserStore";
import { useTranslation } from "@/hooks/translation/useTranslation";
import { tBasic } from "@/consts/translations/tBasic";
import { tLayout } from "@/consts/translations/tLayout";
import classes from "./AppSidebar.module.css";

type AppSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
};

export const AppSidebar: FC<AppSidebarProps> = ({
  collapsed,
  onToggle,
  isMobile,
}) => {
  const showLabels = !collapsed;
  const authUser = useStore($authUser);
  const t = useTranslation();
  const visibleNavItems = authUser
    ? NAV_ITEMS.filter((item) =>
        PermissionUtil.checkAnyPermission(authUser, item.permissionCode),
      )
    : [];

  const renderToggleIcon = () => {
    if (isMobile) return <X size={18} strokeWidth={2} />;
    return collapsed ? (
      <ChevronRight size={18} strokeWidth={2} />
    ) : (
      <ChevronLeft size={18} strokeWidth={2} />
    );
  };

  return (
    <nav className={classes.navbar} data-collapsed={collapsed || undefined}>
      <div className={classes.header}>
        {showLabels && (
          <div className={classes.brand}>
            <div className={classes.logo}>
              <LayoutGrid
                size={16}
                strokeWidth={2.25}
                color="var(--mantine-primary-color-contrast)"
              />
            </div>
            <span className={classes.brandText}>Mini ERP</span>
          </div>
        )}
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          onClick={onToggle}
          aria-label={
            isMobile ? t(tLayout.sidebar.close) : t(tLayout.sidebar.toggle)
          }
          className={classes.toggleBtn}
        >
          {renderToggleIcon()}
        </ActionIcon>
      </div>

      <div className={classes.navbarMain}>
        {visibleNavItems.map((item) => {
          const link = (
            <NavLink
              key={item.path}
              to={item.path}
              className={classes.link}
              onClick={isMobile ? onToggle : undefined}
            >
              {({ isActive }) => (
                <span
                  className={classes.linkInner}
                  data-active={isActive || undefined}
                >
                  <item.icon className={classes.linkIcon} strokeWidth={1.75} />
                  {showLabels && (
                    <span className={classes.linkLabel}>{t(item.label)}</span>
                  )}
                </span>
              )}
            </NavLink>
          );

          return collapsed ? (
            <Tooltip
              key={item.path}
              label={t(item.label)}
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
          <Tooltip label={t(tBasic.textLogout)} position="right" withArrow offset={12}>
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
              <span className={classes.linkLabel}>{t(tBasic.textLogout)}</span>
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
