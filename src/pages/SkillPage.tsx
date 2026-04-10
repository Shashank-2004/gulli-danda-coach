import { Navigate, useParams } from "react-router-dom";
import { getUser } from "@/lib/auth";
import { useCamera } from "@/hooks/use-camera";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Camera, Loader2, Play, Square } from "lucide-react";

const skillLabels: Record<string, Record<string, string>> = {
  cricket: { "straight-drive": "Straight Drive", "pull-shot": "Pull Shot", "sweep-shot": "Sweep Shot" },
  kabaddi: { raiding: "Raiding", touch: "Touch", "defensive-stance": "Defensive Stance" },
  football: { shooting: "Shooting", passing: "Passing", sprinting: "Sprinting" },
  badminton: { smash: "Smash", clear: "Clear", "underhand-lift": "Underhand Lift" },
};

const SkillPage = () => {
  const { sport, skill } = useParams<{ sport: string; skill: string }>();
  const user = getUser();
  const isValidSkill = Boolean(sport && skill && skillLabels[sport]?.[skill]);
  const activeKey = user && isValidSkill ? `${sport}-${skill}` : null;
  const { videoRef, isActive, isLoading, error, startCamera, stopCamera } = useCamera(activeKey);

  if (!user) return <Navigate to="/login" replace />;
  if (!sport || !skill || !isValidSkill) return <Navigate to="/" replace />;

  const label = skillLabels[sport][skill];
  const sportName = sport.charAt(0).toUpperCase() + sport.slice(1);

  return (
    <section className="container mx-auto max-w-3xl px-4 py-16">
      <p className="mb-2 text-sm font-medium text-muted-foreground">{sportName}</p>
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">{label}</h1>

      <div className="space-y-6 rounded-xl border border-border bg-card p-6">
        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Practice Instructions</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Focus on proper form and technique for <strong>{label}</strong>. Position your device so the AI camera can track your full body movement.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border-2 border-border">
          <div className="relative aspect-video bg-muted/40">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}
            />

            {!isActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30 p-6 text-center">
                {isLoading ? (
                  <>
                    <Loader2 size={40} className="animate-spin text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">Starting camera...</p>
                  </>
                ) : error ? (
                  <>
                    <AlertTriangle size={40} className="text-destructive" />
                    <p className="mt-3 max-w-md text-sm text-muted-foreground">{error}</p>
                    <Button onClick={startCamera} size="sm" className="mt-3 gap-2">
                      <Play size={14} /> Retry Camera
                    </Button>
                  </>
                ) : (
                  <>
                    <Camera size={40} className="text-muted-foreground" />
                    <p className="mt-3 text-sm text-muted-foreground">Camera stopped</p>
                    <Button onClick={startCamera} size="sm" className="mt-3 gap-2">
                      <Play size={14} /> Restart Camera
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
                  <Button onClick={stopCamera} variant="destructive" className="gap-2">
                    <Square size={16} /> Stop Session
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-foreground">Your Performance</h2>
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
