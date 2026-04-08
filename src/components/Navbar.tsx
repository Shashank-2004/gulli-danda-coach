import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser, logoutUser } from "@/lib/auth";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Cricket", path: "/sport/cricket" },
  { label: "Kabaddi", path: "/sport/kabaddi" },
  { label: "Football", path: "/sport/football" },
  { label: "Badminton", path: "/sport/badminton" },
  { label: "Contact Us", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="text-gradient-saffron">Gulli</span>
          <span className="text-gradient-green">Danda</span>
          <span className="text-muted-foreground text-sm font-normal">AI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <Link to="/dashboard">
                <Button variant="outline" size="sm" className="gap-1">
                  <User size={14} /> {user.name}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={14} />
              </Button>
            </div>
          ) : (
            <Link to="/login" className="ml-2">
              <Button size="sm" className="gradient-saffron text-primary-foreground border-0">Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-card px-4 pb-4 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-muted">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button size="sm" className="mt-2 w-full gradient-saffron text-primary-foreground border-0">Login</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
