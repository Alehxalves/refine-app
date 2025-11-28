"use client";

import { SquareKanban } from "lucide-react";
import { ClipboardList } from "lucide-react";
import { Gavel } from "lucide-react";
import { Goal } from "lucide-react";

export const MENU_ITEMS = (pathname: string, boardId: string) => [
  {
    icon: SquareKanban,
    label: "Quadros",
    href: `/dashboard`,
    isCurrent: false,
  },
  {
    icon: ClipboardList,
    label: "Backlog",
    href: `/dashboard/board/${boardId}/backlog`,
    isCurrent: pathname.startsWith(`/dashboard/board/${boardId}/backlog`),
  },
  {
    icon: Gavel,
    label: "Refinamento",
    href: `/dashboard/board/${boardId}/refinamento`,
    isCurrent: pathname.startsWith(`/dashboard/board/${boardId}/refinamento`),
  },
  {
    icon: Goal,
    label: "Priorização",
    href: `/dashboard/board/${boardId}/priorizacao`,
    isCurrent: pathname.startsWith(`/dashboard/board/${boardId}/priorizacao`),
  },
];
