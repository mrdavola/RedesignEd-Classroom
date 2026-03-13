import { Header } from "@/components/layout/header";
import { WizardShell } from "@/components/wizard/wizard-shell";

export default function RedesignPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <Header />
      <main className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px] border border-stone-100">
        <WizardShell />
      </main>
    </div>
  );
}
