'use client';

import Link from 'next/link';
import { Sidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function CommunitySidebar() {
  return (
    <Sidebar>
      <div className="p-4">
        <h2 className="text-xl font-bold">Community</h2>
        <nav className="mt-4 space-y-2">
          <Link href="/community" className="block">
            <Button variant="ghost" className="w-full justify-start">
              Feed
            </Button>
          </Link>
          <Link href="/community/create-group" className="block">
            <Button variant="ghost" className="w-full justify-start">
              Create Group
            </Button>
          </Link>
        </nav>
      </div>
    </Sidebar>
  );
}
