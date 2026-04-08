import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Sport } from "@/lib/auth";

const sportMeta: Record<Sport, { emoji: string; tagline: string; color: string }> = {
  cricket: { emoji: "🏏", tagline: "Master your batting stance and bowling action", color: "from-saffron to-saffron-light" },
  kabaddi: { emoji: "🤼", tagline: "Improve raids, tackles and stamina", color: "from-india-green to-india-green-light" },
  football: { emoji: "⚽", tagline: "Perfect your dribbling, passing and shooting", color: "from-saffron-dark to-saffron" },
  badminton: { emoji: "🏸", tagline: "Refine your smash, drop shots and footwork", color: "from-india-green to-india-green-light" },
};

const SportCard = ({ sport }: { sport: Sport }) => {
  const meta = sportMeta[sport];
  return (
    <Link
      to={`/sport/${sport}`}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className="text-4xl mb-3">{meta.emoji}</div>
      <h3 className="font-display text-lg font-bold capitalize text-foreground">{sport}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{meta.tagline}</p>
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary transition group-hover:gap-2">
        Explore <ArrowRight size={14} />
      </div>
    </Link>
  );
};

export default SportCard;
