export interface Capability {
  area: string;
  items: string[];
}

/**
 * The skim layer. A prospect looking for one keyword should find it here
 * without reading a case study.
 */
export const capabilities: Capability[] = [
  {
    area: "Product & web",
    items: [
      "Next.js (App Router)",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Motion",
      "Server Components",
      "React Three Fiber",
    ],
  },
  {
    area: "Data",
    items: [
      "PostgreSQL",
      "Supabase",
      "Row Level Security",
      "Drizzle ORM",
      "Schema design",
      "Migrations",
      "pg_cron",
      "Triggers & constraints",
    ],
  },
  {
    area: "AI & automation",
    items: [
      "Retell AI",
      "OpenRouter",
      "Claude & GPT tool use",
      "Prompt architecture",
      "n8n",
      "Telegram bots",
      "Web scraping",
    ],
  },
  {
    area: "Machine learning",
    items: [
      "scikit-learn",
      "XGBoost",
      "LightGBM",
      "CatBoost",
      "PyTorch",
      "Stacking ensembles",
      "SHAP",
      "Streamlit",
    ],
  },
  {
    area: "Integrations",
    items: [
      "Gmail API",
      "Google Calendar",
      "Google Sheets",
      "Stripe-ready checkout flows",
      "WhatsApp deep links",
      "Webhooks",
    ],
  },
  {
    area: "Operations",
    items: [
      "Vercel",
      "GitHub Actions",
      "Vitest",
      "Observability endpoints",
      "Cron scheduling",
      "Incident-proof send paths",
    ],
  },
];
