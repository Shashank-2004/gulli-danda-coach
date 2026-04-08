import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, getProgress, updateProgress, type Sport, type SportProgress } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Camera, Play, Trophy, BarChart3, Square, Video } from "lucide-react";
import { toast } from "sonner";

const instructions: Record<Sport, string[]> = {
  cricket: ["Stand sideways to the bowler", "Keep your eyes on the ball", "Follow through with your bat swing", "Practice front foot and back foot shots"],
  kabaddi: ["Focus on breathing control during raids", "Practice ankle holds and thigh holds", "Build core strength for tackles", "Work on quick direction changes"],
  football: ["Dribble with both feet", "Practice first touch and ball control", "Work on shooting accuracy", "Improve passing under pressure"],
  badminton: ["Master the basic grip", "Practice overhead clears", "Work on net shots and drops", "Improve footwork with shadow drills"],
};

const sportEmoji: Record<Sport, string> = { cricket: "🏏", kabaddi: "🤼", football: "⚽", badminton: "🏸" };

const SportPage = () => {
  const { sport } = useParams<{ sport: string }>();
  const navigate = useNavigate();
  const user = getUser();
  const [progress, setProgress] = useState<SportProgress | null>(null);
  const [practicing, setPracticing] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const all = getProgress();
    setProgress(all.find((p) => p.sport === sport) || null);
  }, [sport]);

  if (!user || !progress || !sport) return null;
  const s = sport as Sport;

  const handlePractice = () => {
    setPracticing(true);
    setTimeout(() => {
      const updated = updateProgress(s);
      setProgress(updated.find((p) => p.sport === s) || null);
      setPracticing(false);
      toast.success("Practice session completed! Score updated.");
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center gap-4">
        <span className="text-5xl">{sportEmoji[s]}</span>
        <div>
          <h1 className="font-display text-3xl font-bold capitalize text-foreground">{sport}</h1>
          <p className="text-muted-foreground">AI-powered coaching for {sport}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main area */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Camera placeholder */}
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/50 p-10 text-center">
            <Camera size={48} className="mx-auto text-muted-foreground" />
            <h3 className="mt-4 font-display text-lg font-semibold text-foreground">AI Camera Tracking</h3>
            <p className="mt-1 text-sm text-muted-foreground">Pose estimation integration coming soon. Practice with guided drills below.</p>
            <Button onClick={handlePractice} disabled={practicing} className="mt-6 gradient-saffron text-primary-foreground border-0 gap-2">
              {practicing ? (
                <>Analyzing... <span className="animate-spin">⏳</span></>
              ) : (
                <><Play size={16} /> Start Practice Session</>
              )}
            </Button>
          </div>

          {/* Instructions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold text-foreground">Practice Instructions</h3>
            <ul className="mt-3 space-y-2">
              {instructions[s].map((i, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {idx + 1}
                  </span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Performance card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} className="text-primary" />
              <h3 className="font-display font-semibold text-foreground">Your Performance</h3>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold text-primary">{progress.score}%</span>
              <p className="text-sm text-muted-foreground mt-1">Level: {progress.level}</p>
            </div>
            <Progress value={progress.score} className="mt-4 h-3" />
          </div>

          {/* Stats */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={20} className="text-secondary" />
              <h3 className="font-display font-semibold text-foreground">Session Stats</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Sessions</span><span className="font-bold text-foreground">{progress.sessions}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Last Session</span><span className="font-bold text-foreground">{progress.lastSession}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Level</span><span className="font-bold text-foreground">{progress.level}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportPage;
