export interface User {
  name: string;
  email: string;
}

export const getUser = (): User | null => {
  const data = localStorage.getItem("gullidanda_user");
  return data ? JSON.parse(data) : null;
};

export const loginUser = (user: User) => {
  localStorage.setItem("gullidanda_user", JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem("gullidanda_user");
};

export const isLoggedIn = (): boolean => {
  return !!getUser();
};

export type Sport = "cricket" | "kabaddi" | "football" | "badminton";

export interface SportProgress {
  sport: Sport;
  sessions: number;
  score: number;
  lastSession: string;
  level: string;
}

const defaultProgress: SportProgress[] = [
  { sport: "cricket", sessions: 0, score: 0, lastSession: "Never", level: "Beginner" },
  { sport: "kabaddi", sessions: 0, score: 0, lastSession: "Never", level: "Beginner" },
  { sport: "football", sessions: 0, score: 0, lastSession: "Never", level: "Beginner" },
  { sport: "badminton", sessions: 0, score: 0, lastSession: "Never", level: "Beginner" },
];

export const getProgress = (): SportProgress[] => {
  const data = localStorage.getItem("gullidanda_progress");
  return data ? JSON.parse(data) : defaultProgress;
};

export const updateProgress = (sport: Sport) => {
  const progress = getProgress();
  const idx = progress.findIndex((p) => p.sport === sport);
  if (idx !== -1) {
    progress[idx].sessions += 1;
    progress[idx].score = Math.min(100, progress[idx].score + Math.floor(Math.random() * 15) + 5);
    progress[idx].lastSession = new Date().toLocaleDateString();
    if (progress[idx].score > 70) progress[idx].level = "Advanced";
    else if (progress[idx].score > 35) progress[idx].level = "Intermediate";
  }
  localStorage.setItem("gullidanda_progress", JSON.stringify(progress));
  return progress;
};
