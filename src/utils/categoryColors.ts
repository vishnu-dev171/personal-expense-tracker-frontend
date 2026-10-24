const categoryColors = [
  "#f97316",
  "#0ea5e9",
  "#ec4899",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#64748b",
  "#10b981",
  "#22c55e",
  "#16a34a",
];

export function getCategoryColor(index: number): string {
  return categoryColors[index % categoryColors.length];
}
