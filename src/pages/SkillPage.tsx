import { useParams, Navigate } from "react-router-dom";
import { getUser } from "@/lib/auth";

const skillLabels: Record<string, Record<string, string>> = {
  cricket: { "straight-drive": "Straight Drive", "pull-shot": "Pull Shot", "sweep-shot": "Sweep Shot" },
  kabaddi: { raiding: "Raiding", touch: "Touch", "defensive-stance": "Defensive Stance" },
  football: { shooting: "Shooting", passing: "Passing", sprinting: "Sprinting" },
  badminton: { smash: "Smash", clear: "Clear", "underhand-lift": "Underhand Lift" },
};

const SkillPage = () => {
  const { sport, skill } = useParams<{ sport: string; skill: string }>();
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;
  if (!sport || !skill || !skillLabels[sport]?.[skill]) return <Navigate to="/" replace />;

  const label = skillLabels[sport][skill];
  const sportName = sport.charAt(0).toUpperCase() + sport.slice(1);

  return (
    <section className="container mx-auto max-w-3xl px-4 py-16">
      <p className="mb-2 text-sm font-medium text-muted-foreground">{sportName}</p>
      <h1 className="mb-6 font-display text-3xl font-bold">{label}</h1>

      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Practice Instructions</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Focus on proper form and technique for <strong>{label}</strong>. Position your device so the AI camera can track your full body movement. Follow the on-screen guidance during your practice session.
          </p>
        </div>

        <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
          <p className="text-muted-foreground text-sm">AI Camera Tracking — Coming Soon</p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">Your Performance</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-2xl font-bold text-foreground">—</p>
              <p className="text-xs text-muted-foreground">Best Score</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-2xl font-bold text-foreground">—</p>
              <p className="text-xs text-muted-foreground">Last Session</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillPage;
