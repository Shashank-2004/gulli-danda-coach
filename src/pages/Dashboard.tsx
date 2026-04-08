import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUser, getProgress, type SportProgress, type Sport } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Dumbbell, Clock } from "lucide-react";

const sportEmoji: Record<Sport, string> = {
  cricket: "🏏",
  kabaddi: "🤼",
  football: "⚽",
  badminton: "🏸",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [progress, setProgress] = useState<SportProgress[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setProgress(getProgress());
  }, []);

  if (!user) return null;

  const totalScore = Math.round(progress.reduce((a, p) => a + p.score, 0) / (progress.length || 1));
  const totalSessions = progress.reduce((a, p) => a + p.sessions, 0);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Welcome, <span className="text-gradient-saffron">{user.name}</span>
        </h1>
        <p className="mt-1 text-muted-foreground">Track your progress across all sports</p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"><Trophy size={20} className="text-primary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className="text-2xl font-bold text-foreground">{totalScore}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10"><Dumbbell size={20} className="text-secondary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-2xl font-bold text-foreground">{totalSessions}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"><Clock size={20} className="text-primary" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Sports Active</p>
              <p className="text-2xl font-bold text-foreground">{progress.filter((p) => p.sessions > 0).length}/4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sport cards */}
      <h2 className="mb-4 font-display text-xl font-bold text-foreground">Your Sports</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {progress.map((p) => (
          <div key={p.sport} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{sportEmoji[p.sport]}</span>
                <div>
                  <h3 className="font-display text-lg font-bold capitalize text-foreground">{p.sport}</h3>
                  <p className="text-xs text-muted-foreground">Level: {p.level}</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-primary">{p.score}%</span>
            </div>
            <Progress value={p.score} className="mt-4 h-2" />
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Sessions: {p.sessions}</span>
              <span>Last: {p.lastSession}</span>
            </div>
            <Link to={`/sport/${p.sport}`}>
              <Button size="sm" className="mt-4 w-full gradient-saffron text-primary-foreground border-0">
                Start Practice
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
