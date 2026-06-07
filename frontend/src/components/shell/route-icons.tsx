import type { LucideIcon } from "lucide-react"
import {
  Bell,
  BookOpen,
  Boxes,
  CircleUserRound,
  Home,
  KeyRound,
  Library,
  Link2,
  MessageCircle,
  Newspaper,
  Plus,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react"

import type { RouteIcon } from "@/lib/routes"

const icons: Record<RouteIcon, LucideIcon> = {
  admin: Shield,
  auth: CircleUserRound,
  capture: Plus,
  chat: MessageCircle,
  digests: Newspaper,
  home: Home,
  library: Library,
  search: Search,
  settings: Settings,
  share: Link2,
  sources: Boxes,
}

export function RouteIconGlyph({
  name,
  className,
}: {
  readonly name: RouteIcon
  readonly className: string
}) {
  const Icon = icons[name]
  return <Icon aria-hidden="true" className={className} />
}

export const statusIcons = {
  api: Sparkles,
  contract: BookOpen,
  guard: SlidersHorizontal,
  notification: Bell,
  credential: KeyRound,
} as const
