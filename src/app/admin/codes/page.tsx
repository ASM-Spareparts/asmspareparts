import dynamic from "next/dynamic";

import CodesSection from "../components/CodesSection";

export default function CodesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Lottery Codes</h1>
      <CodesSection />
    </div>
  );
}
