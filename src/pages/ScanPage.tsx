import { AppShell } from "@/components/app-shell";
import { PlantScanner } from "@/components/scanner/plant-scanner";

export default function ScanPage() {
  return (
    <AppShell active="scan" showBack>
      <PlantScanner />
    </AppShell>
  );
}
