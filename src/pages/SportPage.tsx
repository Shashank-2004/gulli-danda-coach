import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, getProgress, updateProgress, type Sport, type SportProgress } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Camera, Play, Trophy, BarChart3, Square, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useCamera } from "@/hooks/use-camera";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const camera = useCamera(videoRef);

  const s = sport as Sport;

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const all = getProgress();
    setProgress(all.find((p) => p.sport === sport) || null);
  }, [sport]);

  // Stop camera when sport changes
  useEffect(() => {
    camera.stop();
  }, [sport]);

  const handleStop = () => {
    camera.stop();
    const updated = updateProgress(s);
    setProgress(updated.find((p) => p.sport === s) || null);
    toast.success("Practice session completed! Score updated.");
  };

  if (!user || !progress || !sport) return null;

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
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border-2 border-border bg-card overflow-hidden">
            {camera.isActive ? (
              <div className="relative">
                <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video bg-black object-cover" />
                <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-white" /> LIVE
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex justify-center">
                  <Button onClick={handleStop} variant="destructive" className="gap-2">
                    <Square size={16} /> Stop Session
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center border-dashed border-2 border-border bg-muted/50 rounded-xl">
                {camera.isLoading ? (
                  <>
                    <Loader2 size={48} className="mx-auto text-primary animate-spin" />
                    <h3 className="mt-4 font-display text-lg font-semibold text-foreground">Initializing Camera...</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Please allow camera access when prompted.</p>
                  </>
                ) : camera.error ? (
                  <>
                    <AlertTriangle size={48} className="mx-auto text-destructive" />
                    <h3 className="mt-4 font-display text-lg font-semibold text-foreground">Camera Unavailable</h3>
                    <p className="mt-1 text-sm text-destructive">{camera.error}</p>
                    <Button onClick={camera.start} className="mt-6 gap-2"><Play size={16} /> Retry</Button>
                  </>
                ) : (
                  <>
                    <Camera size={48} className="mx-auto text-muted-foreground" />
                    <h3 className="mt-4 font-display text-lg font-semibold text-foreground">AI Camera Tracking</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Your camera will activate to track your movements during practice.</p>
                    <Button onClick={camera.start} className="mt-6 gradient-saffron text-primary-foreground border-0 gap-2">
                      <Play size={16} /> Start Practice Session
                    </Button>
                  </>
                )}
                {/* Hidden video for ref assignment before camera starts */}
                <video ref={camera.isActive ? undefined : videoRef} className="hidden" />
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold text-foreground">Practice Instructions</h3>
            <ul className="mt-3 space-y-2">
              {instructions[s].map((i, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{idx + 1}</span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
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
