'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Bell, Menu, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useSupabase } from '@/contexts/supabase-context'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { ClientOnlyCount } from '@/components/ui/client-only-count'

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: 'Signed out successfully',
        description: 'You have been signed out of your account.',
      })
      router.push('/login')
    } catch (error: any) {
      toast({
        title: 'Error signing out',
        description: error.message || 'An error occurred while signing out.',
        variant: 'destructive',
      })
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-amber-50 px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="Saksham Logo" 
            width={48} 
            height={48} 
          />
          <span className="font-bold">Saksham</span>
        </Link>
      </div>
      <div className="hidden md:flex md:items-center md:gap-2">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="Saksham Logo" 
            width={56} 
            height={56} 
          />
          <span className="text-xl font-bold">Saksham</span>
        </Link>
      </div>
      <div className={`${isSearchOpen ? 'flex' : 'hidden'} flex-1 md:flex`}>
        <form className="relative w-full md:w-auto md:flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-white pl-8 md:w-[300px] lg:w-[400px]"
          />
          {isSearchOpen && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 md:hidden"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close search</span>
            </Button>
          )}
        </form>
      </div>
      <Button
        variant="outline"
        size="icon"
        className={`${isSearchOpen ? 'hidden' : 'flex'} md:hidden`}
        onClick={() => setIsSearchOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
      <div className="flex items-center gap-4 md:ml-auto">
        <Button variant="outline" size="sm" className="border-accent/20 text-accent hover:bg-accent/10 hover:text-accent">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-accent text-white">US</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
} 