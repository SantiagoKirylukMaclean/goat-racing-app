"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trophy, Play, Timer, Settings, Wrench, FileText, LogOut, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const navigation = [
  {
    name: "Standings",
    href: "/standings",
    icon: Trophy,
  },
  {
    name: "Simulate Weekend",
    href: "/simulate",
    icon: Play,
  },
  {
    name: "Timing Analysis",
    href: "/timing",
    icon: Timer,
  },
  {
    name: "Test Configuration",
    href: "/test-config",
    icon: Settings,
  },
  {
    name: "Parts List",
    href: "/parts",
    icon: Wrench,
  },
  {
    name: "Notes",
    href: "/notes",
    icon: FileText,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <div className={cn("flex h-full w-64 flex-col bg-card border-r", className)}>
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            G
          </div>
          <span className="text-lg font-semibold">GOAT Racing</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-11",
                    isActive && "bg-secondary text-secondary-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-3 space-y-2">
        <Link href="/profile">
          <Button variant="ghost" className="w-full justify-start gap-3 h-11">
            <User className="h-4 w-4" />
            Profile
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-destructive hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
