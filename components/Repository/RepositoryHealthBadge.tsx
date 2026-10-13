import type { HealthLevel } from "@/data/health";

type RepositoryHealthBadgeProps = {
  score: number;
  level: HealthLevel;
};

const levelStyles: Record<HealthLevel, string> = {
  healthy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  stable: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "needs-support": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
};

const levelLabels: Record<HealthLevel, string> = {
  healthy: "healthy",
  stable: "stable",
  "needs-support": "needs support"
};

export const RepositoryHealthBadge = ({ score, level }: RepositoryHealthBadgeProps) => (
  <span
    title={`Health score ${score}/100 (${levelLabels[level]}): based on open issues and recent activity`}
    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${levelStyles[level]}`}
  >
    health: {score} · {levelLabels[level]}
  </span>
);
