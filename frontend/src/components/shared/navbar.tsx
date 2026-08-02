import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getBrandPath } from "@/lib/config/brands"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          {/* Logo placeholder - text based for now */}
          <Link href={getBrandPath("/")} className="flex items-center space-x-2">
            <span className="font-heading text-2xl font-bold uppercase tracking-widest text-primary">
              Noble Nests
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex gap-8 items-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          <Link href={getBrandPath("/")} className="hover:text-primary transition-colors">Home</Link>
          <Link href={getBrandPath("/properties")} className="hover:text-primary transition-colors">Properties</Link>
          <Link href={getBrandPath("/about")} className="hover:text-primary transition-colors">About</Link>
          <Link href={getBrandPath("/guide")} className="hover:text-primary transition-colors">Guide</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href={getBrandPath("/contact")} className="hidden lg:flex">
            <Button variant="outline">
              Book Consultation
            </Button>
          </Link>
          {/* Mobile menu icon (Lucide can be added here) */}
          <button className="md:hidden p-2 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
