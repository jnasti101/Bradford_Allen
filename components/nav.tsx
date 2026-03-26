"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, LogOut, TrendingUp } from "lucide-react";

const links = [
  { href: "/", label: "Portfolio", icon: BarChart3 },
  { href: "/performance", label: "Performance", icon: TrendingUp },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/omnia-ikon.png"
            alt="Omnia"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-lg font-semibold tracking-tight">Bradford Allen</span>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="ml-2 h-5 w-px bg-border" />
          <button
            onClick={() => {
              sessionStorage.removeItem("ba-demo-auth");
              window.location.reload();
            }}
            className="ml-1 flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
