"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trophy, Play, Timer, Settings, Wrench, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  {
    name: "Standings",
    href: "/standings",
    icon: Trophy,
  },
  {
    name: "Simulate",
    href: "/simulate",
    icon: Play,
  },
  {
    name: "Timing",
    href: "/timing",
    icon: Timer,
  },
  {
    name: "Config",
    href: "/test-config",
    icon: Settings,
  },
  {
    name: "Parts",
    href: "/parts",
    icon: Wrench,
  },
  {
    name: "Notes",
    href: "/notes",
    icon: FileText,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t md:hidden">
      <nav className="flex items-center justify-around px-2 py-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex h-12 w-full flex-col items-center justify-center gap-1 px-2 py-1",
                  isActive && "text-primary",
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                <span className="text-xs font-medium">{item.name}</span>
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
