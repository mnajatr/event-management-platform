'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Events', href: '/dashboard/events' },
  { label: 'Users', href: '/dashboard/users' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r px-4 py-6">
      <h2 className="text-xl font-bold mb-6">Organizer Panel</h2>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'block px-3 py-2 rounded-md text-sm font-medium',
              pathname === item.href
                ? 'bg-primary text-white'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
          }}
        >
          <Button
            type="submit"
            variant="ghost"
            className="w-full flex items-center justify-start gap-2 text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>
    </aside>
  );
}
