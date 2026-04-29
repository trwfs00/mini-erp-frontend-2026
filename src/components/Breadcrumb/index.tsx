import type { FC } from "react";
import { useEffect, useState } from "react";
import { Anchor, Breadcrumbs, type AnchorProps } from "@mantine/core";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { BreadcrumbItem } from "@/types/Global";
import { SessionStorageUtil } from "@/utils/SessionStorageUtil";
import { NAV_ITEMS } from "@/consts/navConfig";
import { ROUTE_PATHS } from "@/router/routePaths";

type Props = {
  current?: BreadcrumbItem | BreadcrumbItem[];
  useHome?: boolean;
};

const anchorProps: AnchorProps = {
  fz: "sm",
  fw: 400,
};

const FIRST_LAYER_LABELS = NAV_ITEMS.map((item) => item.label);

export const Breadcrumb: FC<Props> = ({ current, useHome = true }) => {
  const navigate = useNavigate();

  const [journey, setJourney] = useState<BreadcrumbItem[]>(() =>
    SessionStorageUtil.loadBreadcrumbJourney(),
  );

  useEffect(() => {
    if (!current) {
      SessionStorageUtil.saveBreadcrumbJourney([]);
      setJourney([]);
      return;
    }

    // ถ้าเป็น array → replace journey ทั้งหมด (multi-level page เช่น Report > Tab)
    if (Array.isArray(current)) {
      SessionStorageUtil.saveBreadcrumbJourney(current);
      setJourney(current);
      return;
    }

    const freshJourney = SessionStorageUtil.loadBreadcrumbJourney();

    // ถ้า current เป็น first-layer menu → reset journey เหลือแค่ตัวเดียว
    if (FIRST_LAYER_LABELS.includes(current.label)) {
      const newJourney = [current];
      SessionStorageUtil.saveBreadcrumbJourney(newJourney);
      setJourney(newJourney);
      return;
    }

    // ถ้า current มีอยู่แล้วใน journey → slice กลับมาตรงนั้น (back-navigation)
    const foundIndex = freshJourney.findIndex(
      (item) => item.label === current.label,
    );
    if (foundIndex !== -1) {
      const newJourney = freshJourney.slice(0, foundIndex + 1);
      SessionStorageUtil.saveBreadcrumbJourney(newJourney);
      setJourney(newJourney);
      return;
    }

    // ไม่งั้น append
    const newJourney = [...freshJourney, current];
    SessionStorageUtil.saveBreadcrumbJourney(newJourney);
    setJourney(newJourney);
  }, [current]);

  const home = (
    <Anchor
      onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
      fz="sm"
      fw={500}
      style={{ cursor: "pointer" }}
    >
      Home
    </Anchor>
  );

  return (
    <Breadcrumbs separator={<ChevronRight size={14} />} separatorMargin="xs">
      {useHome && home}
      {journey.map((item, index) => {
        const isLast = index === journey.length - 1;
        return (
          <Anchor
            key={`${item.label}-${index}`}
            onClick={() => item.path && navigate(item.path)}
            {...anchorProps}
            fw={isLast ? 600 : 400}
            c={isLast ? undefined : "dimmed"}
            style={{ cursor: item.path ? "pointer" : "default" }}
          >
            {item.label}
          </Anchor>
        );
      })}
    </Breadcrumbs>
  );
};
