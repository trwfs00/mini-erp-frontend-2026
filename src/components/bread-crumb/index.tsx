import type { FC } from "react";
import { Anchor, Breadcrumbs, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import type { BreadcrumbItem } from "@/types/global";

type Props = {
  items: BreadcrumbItem[];
};

export const Breadcrumb: FC<Props> = ({ items }) => {
  const links = items.map((item, index) => {
    const isLast = index === items.length - 1;

    if (isLast || !item.path) {
      return (
        <Text key={item.label} c="gray.9" fz="sm" fw={600}>
          {item.label}
        </Text>
      );
    }

    return (
      <Anchor
        key={item.label}
        component={Link}
        to={item.path}
        c="gray.6"
        fz="sm"
        underline="never"
      >
        {item.label}
      </Anchor>
    );
  });

  return (
    <Breadcrumbs separator="/" separatorMargin="xs">
      {links}
    </Breadcrumbs>
  );
};
