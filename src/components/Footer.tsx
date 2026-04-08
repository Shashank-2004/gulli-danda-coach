const Footer = () => (
  <footer className="border-t border-border bg-card py-8">
    <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
      <p className="font-display font-semibold text-foreground">GulliDanda AI</p>
      <p className="mt-1">Coaching AI for the next generation of rural champions.</p>
      <p className="mt-3">© {new Date().getFullYear()} GulliDanda AI. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
