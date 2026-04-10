import { useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getUser } from "@/lib/auth";
import { useCamera } from "@/hooks/use-camera";
import { Button } from "@/components/ui/button";
import { Camera, Play, Square, Loader2, AlertTriangle } from "lucide-react";

const skillLabels: Record<string, Record<string, string>> = {
  cricket: { "straight-drive": "Straight Drive", "pull-shot": "Pull Shot", "sweep-shot": "Sweep Shot" },
  kabaddi: { raiding: "Raiding", touch: "Touch", "defensive-stance": "Defensive Stance" },
  football: { shooting: "Shooting", passing: "Passing", sprinting: "Sprinting" },
  badminton: { smash: "Smash", clear: "Clear", "underhand-lift": "Underhand Lift" },
};

const SkillPage = () => {
  const { sport, skill } = useParams<{ sport: string; skill: string }>();
  const user = getUser();
  const videoRef = useRef<HTMLVideoElement>(null);
  const camera = useCamera(videoRef);

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
            Focus on proper form and technique for <strong>{label}</strong>. Position your device so the AI camera can track your full body movement.
          </p>
        </div>

        {/* Camera Section */}
        <div className="rounded-lg border-2 border-border overflow-hidden">
          {camera.isActive ? (
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-video bg-black object-cover" />
              <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white animate-pulse">
                <span className="h-2 w-2 rounded-full bg-white" /> LIVE
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex justify-center">
                <Button onClick={camera.stop} variant="destructive" className="gap-2">
                  <Square size={16} /> Stop Session
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center bg-muted/30 p-6 text-center">
              {camera.isLoading ? (
                <>
                  <Loader2 size={40} className="text-primary animate-spin" />
                  <p className="mt-3 text-sm text-muted-foreground">Initializing Camera...</p>
                </>
              ) : camera.error ? (
                <>
                  <AlertTriangle size={40} className="text-destructive" />
                  <p className="mt-3 text-sm text-destructive">{camera.error}</p>
                  <Button onClick={camera.start} size="sm" className="mt-3 gap-2"><Play size={14} /> Retry</Button>
                </>
              ) : (
                <>
                  <Camera size={40} className="text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">AI Camera Tracking</p>
                  <Button onClick={camera.start} size="sm" className="mt-3 gradient-saffron text-primary-foreground border-0 gap-2">
                    <Play size={14} /> Start Practice
                  </Button>
                </>
              )}
              <video ref={camera.isActive ? undefined : videoRef} className="hidden" />
            </div>
          )}
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
