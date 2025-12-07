import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChefHat, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="section-container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>EZORDER</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/admin/login"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogIn className="h-4 w-4" />
            Admin
          </Link>
          <Button asChild variant="nav" size="sm">
            <Link to="/get-started">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="section-container flex flex-col gap-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "py-2 text-sm font-medium transition-colors",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-border" />
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground"
            >
              <LogIn className="h-4 w-4" />
              Admin Login
            </Link>
            <Button asChild variant="nav" className="w-full">
              <Link to="/get-started" onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
