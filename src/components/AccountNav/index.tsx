'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { User, Eye, Star, LogOut, ChevronRight, Settings } from 'lucide-react'

type Props = {
  className?: string
  userEmail?: string | null
  userName?: string | null
}

const navItems = [
  { href: '/account?tab=settings', label: 'Account Settings', icon: Settings, tabKey: 'settings' },
  { href: '/account?tab=recently-viewed', label: 'Recently Viewed', icon: Eye, tabKey: 'recently-viewed' },
  { href: '/account?tab=my-reviews', label: 'Reviewed Products', icon: Star, tabKey: 'my-reviews' },
]

export const AccountNav: React.FC<Props> = ({ className, userEmail, userName }) => {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'settings'

  const isActive = (tabKey: string) => {
    return activeTab === tabKey
  }

  const getInitials = (name?: string | null) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return (
    <>
      {/* Mobile: horizontal pill scroll */}
      <div className="lg:hidden bg-white rounded-2xl border-2 border-honeycomb-cream/25 p-3 shadow-sm mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.tabKey)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0 text-sm font-medium hover:cursor-pointer',
                  active
                    ? 'bg-honeycomb-cream text-honeycomb-charcoal font-bold shadow-xs'
                    : 'bg-honeycomb-cream/5 text-honeycomb-cream hover:bg-honeycomb-cream/15 hover:text-honeycomb-charcoal',
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/logout"
            className="flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap bg-red-50/60 text-red-650 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0 text-sm font-medium hover:cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </Link>
        </div>
      </div>

      {/* Desktop: sidebar card */}
      <div className={clsx('hidden lg:block bg-white rounded-3xl border-2 border-honeycomb-cream/25 p-6 shadow-sm', className)}>
        {/* User info */}
        {(userName || userEmail) && (
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-honeycomb-cream/20">
            <div className="w-12 h-12 rounded-2xl bg-honeycomb-cream text-honeycomb-charcoal flex items-center justify-center font-extrabold text-sm shadow-sm border border-white/20 flex-shrink-0">
              {getInitials(userName || userEmail)}
            </div>
            <div className="min-w-0">
              {userName && (
                <p className="font-bold text-neutral-900 truncate text-sm">{userName}</p>
              )}
              {userEmail && (
                <p className="text-xs text-honeycomb-muted truncate">{userEmail}</p>
              )}
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.tabKey)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:cursor-pointer',
                      active
                        ? 'bg-honeycomb-cream/10 text-honeycomb-charcoal font-bold'
                        : 'text-neutral-600 hover:bg-honeycomb-cream/5 hover:text-honeycomb-cream',
                    )}
                  >
                    <Icon
                      className={clsx('w-5 h-5', active ? 'text-honeycomb-cream' : 'text-honeycomb-cream/40')}
                    />
                    <span className={clsx('text-sm', active ? 'font-bold' : 'font-medium')}>
                      {item.label}
                    </span>
                    {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="mt-4 pt-4 border-t border-honeycomb-cream/20">
          <Link
            href="/logout"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors hover:cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log out</span>
          </Link>
        </div>
      </div>
    </>
  )
}
