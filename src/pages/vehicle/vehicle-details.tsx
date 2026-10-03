import { DemoTag, InfoNote, Panel, RolePage, SectionHead } from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { useLocalState } from "@/hooks/use-local-state";
import { VehicleDetailsForm } from "@/components/vehicle-details";
import {
  VEHICLE_DEMO_FLEET,
  type VehicleDraft,
} from "@/lib/role-data";
import { ArrowLeft, Truck } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export function VehicleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [added, setAdded] = useLocalState<VehicleDraft[]>("vehicle:added", []);

  const fleet = [...added, ...VEHICLE_DEMO_FLEET];
  const existing = id && id !== "new" ? fleet.find((vehicle) => vehicle.id === id) : undefined;

  const save = (vehicle: VehicleDraft) => {
    const record: VehicleDraft = { ...vehicle, id: vehicle.id || `v-${Date.now()}` };
    setAdded((prev) => {
      const rest = prev.filter((item) => item.id !== record.id);
      return [record, ...rest];
    });
    toast.success(existing ? "Vehicle updated" : "Vehicle added to your fleet");
    navigate("/vehicle/vehicles");
  };

  return (
    <RolePage
      role="vehicle_owner"
      active="vehicles"
      title={existing ? "Edit Vehicle" : "Add Vehicle"}
      subtitle={
        existing
          ? `Update ${existing.registration} — changes apply to future matching.`
          : "Ten details describe your vehicle. Fill what applies and leave the rest."
      }
      action={<DemoTag />}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Panel>
          <VehicleDetailsForm
            initial={existing}
            onSave={save}
            onCancel={() => navigate("/vehicle/vehicles")}
            saveLabel={existing ? "Update Vehicle" : "Save Vehicle"}
            addAnother={!existing}
          />
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel>
            <SectionHead title="Why these details matter" />
            <div className="mt-3 flex flex-col gap-2 text-[13px] leading-6 text-muted-foreground">
              <p>
                Requests are matched on vehicle type, services offered, service radius and
                availability, so accurate details bring you better work.
              </p>
              <p>
                Capacity and manufacturing year help requesters pick the right vehicle for
                loads and equipment.
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="mt-4 h-11 w-full gap-2 rounded-xl"
            >
              <Link to="/vehicle/vehicles">
                <ArrowLeft className="size-4" />
                Back to my vehicles
              </Link>
            </Button>
          </Panel>

          <Panel>
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E3F2FD]">
                <Truck className="size-4" style={{ color: "#1565C0" }} />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Multiple vehicles allowed
                </p>
                <p className="mt-0.5 text-[13px] leading-6 text-muted-foreground">
                  Add a tractor and a tanker separately so each one is matched to the right
                  jobs.
                </p>
              </div>
            </div>
          </Panel>

          <InfoNote tone="warn">
            Vehicle entries are saved in this prototype only. Registration numbers stay on
            your device until a backend is connected.
          </InfoNote>
        </div>
      </div>
    </RolePage>
  );
}

export default VehicleDetailsPage;
