import { surveys } from "@/data/mock";

export function generateStaticParams() {
  return surveys.map((s) => ({ id: s.id }));
}

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
