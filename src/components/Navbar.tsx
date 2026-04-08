import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser, logoutUser } from "@/lib/auth";

const sportDropdowns: Record<string, { label: string; path: string }[]> = {
  cricket: [
    { label: "Straight Drive", path: "/sport/cricket/straight-drive" },
    { label: "Pull Shot", path: "/sport/cricket/pull-shot" },
    { label: "Sweep Shot", path: "/sport/cricket/sweep-shot" },
  ],
  kabaddi: [
    { label: "Raiding", path: "/sport/kabaddi/raiding" },
    { label: "Touch", path: "/sport/kabaddi/touch" },
    { label: "Defensive Stance", path: "/sport/kabaddi/defensive-stance" },
  ],
  football: [
    { label: "Shooting", path: "/sport/football/shooting" },
    { label: "Passing", path: "/sport/football/passing" },
    { label: "Sprinting", path: "/sport/football/sprinting" },
  ],
  badminton: [
    { label: "Smash", path: "/sport/badminton/smash" },
    { label: "Clear", path: "/sport/badminton/clear" },
    { label: "Underhand Lift", path: "/sport/badminton/underhand-lift" },
  ],
};

const navLinks = [
  { label: "Home", path: "/", sport: null },
  { label: "Cricket", path: "/sport/cricket", sport: "cricket" },
  { label: "Kabaddi", path: "/sport/kabaddi", sport: "kabaddi" },
  { label: "Football", path: "/sport/football", sport: "football" },
  { label: "Badminton", path: "/sport/badminton", sport: "badminton" },
  { label: "Contact Us", path: "/contact", sport: null },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = getUser();
  const navRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (sport: string) => {
    setOpenDropdown((prev) => (prev === sport ? null : sport));
  };

  const toggleMobileDropdown = (sport: string) => {
    setMobileOpenDropdown((prev) => (prev === sport ? null : sport));
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg" ref={navRef}>
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="text-gradient-saffron">Gulli</span>
          <span className="text-gradient-green">Danda</span>
          <span className="text-muted-foreground text-sm font-normal">AI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) =>
            l.sport && sportDropdowns[l.sport] ? (
              <div key={l.path} className="relative">
                <button
                  onClick={() => toggleDropdown(l.sport!)}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${openDropdown === l.sport ? "rotate-180" : ""}`}
                  />
                </button>
                {openDropdown === l.sport && (
                  <div className="absolute left-0 top-full mt-1 min-w-[180px] rounded-md border border-border bg-card shadow-lg z-50">
                    {sportDropdowns[l.sport].map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={l.path}
                to={l.path}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </Link>
            )
          )}
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
          {navLinks.map((l) =>
            l.sport && sportDropdowns[l.sport] ? (
              <div key={l.path}>
                <button
                  onClick={() => toggleMobileDropdown(l.sport!)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
                >
                  {l.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${mobileOpenDropdown === l.sport ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileOpenDropdown === l.sport && (
                  <div className="ml-4 border-l border-border pl-2">
                    {sportDropdowns[l.sport].map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => { setOpen(false); setMobileOpenDropdown(null); }}
                        className="block rounded-md px-3 py-2 text-sm text-foreground/80 hover:bg-muted"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
              >
                {l.label}
              </Link>
            )
          )}
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
