import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SportCard from "@/components/SportCard";
import heroBg from "@/assets/hero-bg.jpg";
import { Cpu, Camera, TrendingUp, Users } from "lucide-react";
import type { Sport } from "@/lib/auth";

const sports: Sport[] = ["cricket", "kabaddi", "football", "badminton"];

const features = [
  { icon: Camera, title: "Pose Estimation", desc: "AI-powered camera analysis of your form and technique" },
  { icon: Cpu, title: "Smart Coaching", desc: "Personalized drills and feedback tailored to your level" },
  { icon: TrendingUp, title: "Progress Tracking", desc: "Detailed stats and improvement graphs over time" },
  { icon: Users, title: "Community", desc: "Connect with fellow rural athletes across India" },
];

const Index = () => (
  <div>
    {/* Hero */}
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      <img src={heroBg} alt="Rural athletes playing cricket" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1024} />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent" />
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl text-primary-foreground">
            Gulli<span className="text-saffron-light">Danda</span> AI
          </h1>
          <p className="mt-2 text-lg font-medium text-primary-foreground/90 sm:text-xl">
            Coaching AI for the next generation of rural champions.
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-primary-foreground/70">
            Unlock your potential with AI-powered pose estimation, personalized drills, and progress tracking — designed for Cricket, Kabaddi, Football & Badminton athletes from every corner of India.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login">
              <Button size="lg" className="gradient-saffron text-primary-foreground border-0 font-semibold text-base px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>

    {/* Sports Grid */}
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-center font-display text-3xl font-bold text-foreground">Choose Your Sport</h2>
      <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
        AI coaching tailored for India's most popular street and rural sports
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sports.map((s) => (
          <SportCard key={s} sport={s} />
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-display text-3xl font-bold text-foreground">How It Works</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <f.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Index;
