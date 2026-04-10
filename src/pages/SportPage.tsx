import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, getProgress, updateProgress, type Sport, type SportProgress } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Camera, Loader2, Trophy, BarChart3, Square, AlertTriangle, Play } from "lucide-react";
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

  const isValidSport = Boolean(sport && sport in instructions);
  const activeKey = user && isValidSport ? `sport:${sport}` : null;
  const { videoRef, isActive, isLoading, error, startCamera, stopCamera } = useCamera(activeKey);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!sport || !(sport in instructions)) {
      return;
    }

    const all = getProgress();
    setProgress(all.find((item) => item.sport === sport) || null);
  }, [navigate, sport, user]);

  const handleStop = () => {
    if (!sport || !(sport in instructions)) {
      return;
    }

    stopCamera();
    const updated = updateProgress(sport as Sport);
    setProgress(updated.find((item) => item.sport === sport) || null);
    toast.success("Practice session completed! Score updated.");
  };

  if (!user || !progress || !sport || !isValidSport) return null;

  const typedSport = sport as Sport;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex items-center gap-4">
        <span className="text-5xl">{sportEmoji[typedSport]}</span>
        <div>
          <h1 className="font-display text-3xl font-bold capitalize text-foreground">{sport}</h1>
          <p className="text-muted-foreground">AI-powered coaching for {sport}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="overflow-hidden rounded-xl border-2 border-border bg-card">
            <div className="relative aspect-video bg-muted/40">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}
              />

              {!isActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-border bg-muted/50 p-8 text-center">
                  {isLoading ? (
                    <>
                      <Loader2 size={44} className="animate-spin text-primary" />
                      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">Starting camera...</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Please allow webcam access if your browser asks.</p>
                    </>
                  ) : error ? (
                    <>
                      <AlertTriangle size={44} className="text-destructive" />
                      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">Camera not available</h3>
                      <p className="mt-1 max-w-md text-sm text-muted-foreground">{error}</p>
                      <Button onClick={startCamera} className="mt-6 gap-2">
                        <Play size={16} /> Retry Camera
                      </Button>
                    </>
                  ) : (
                    <>
                      <Camera size={44} className="text-muted-foreground" />
                      <h3 className="mt-4 font-display text-lg font-semibold text-foreground">Camera stopped</h3>
                      <p className="mt-1 text-sm text-muted-foreground">Restart the webcam to continue your practice session.</p>
                      <Button onClick={startCamera} className="mt-6 gap-2">
                        <Play size={16} /> Restart Camera
                      </Button>
                    </>
                  )}
                </div>
              )}

              {isActive && (
                <>
                  <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-destructive-foreground" />
                    LIVE
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-background/80 to-transparent p-4">
                    <Button onClick={handleStop} variant="destructive" className="gap-2">
                      <Square size={16} /> Stop Session
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-semibold text-foreground">Practice Instructions</h3>
            <ul className="mt-3 space-y-2">
              {instructions[typedSport].map((instruction, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-primary" />
              <h3 className="font-display font-semibold text-foreground">Your Performance</h3>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold text-primary">{progress.score}%</span>
              <p className="mt-1 text-sm text-muted-foreground">Level: {progress.level}</p>
            </div>
            <Progress value={progress.score} className="mt-4 h-3" />
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-secondary" />
              <h3 className="font-display font-semibold text-foreground">Session Stats</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Sessions</span>
                <span className="font-bold text-foreground">{progress.sessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Session</span>
                <span className="font-bold text-foreground">{progress.lastSession}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level</span>
                <span className="font-bold text-foreground">{progress.level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportPage;
