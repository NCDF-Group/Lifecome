import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/config/navigation";

/**
 * The console's left-hand navigation. Renders every section from
 * `config/navigation.ts` as icon + label links — no active-route
 * highlighting or permission filtering by staff role yet (the last needs
 * the admin-auth work in README.md to land first). Hidden below the `lg`
 * breakpoint for now; `AppTopbar` is where a mobile menu trigger would
 * go once this needs to open as a drawer on small screens.
 */
export function AppSidebar() {
  return (
    <nav className="hidden h-full w-60 shrink-0 flex-col gap-6 overflow-y-auto border-r border-line bg-card p-4 lg:flex">
      <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1">
        <Image
          src="/brand/lifecome-live-logo.svg"
          alt="LifeCome Live"
          width={140}
          height={28}
          priority
        />
      </Link>
      {navigation.map((section) => (
        <div key={section.title} className="flex flex-col gap-1">
          <span className="px-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {section.title}
          </span>
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-control px-2 py-1.5 text-sm font-medium text-ink hover:bg-surface"
            >
              <item.icon className="size-4 shrink-0 text-ink-muted" />
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}
