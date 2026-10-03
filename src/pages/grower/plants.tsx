import {
  HeroPanel,
  MetaRow,
  Panel,
  Photo,
  RolePage,
  SectionHead,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalState } from "@/hooks/use-local-state";
import {
  GROWER_PLANTS,
  GROWER_REMINDERS,
  GROWER_REMINDER_TYPES,
  GROWER_SPACES,
  IMG,
  type GrowerPlant,
  type GrowerReminder,
} from "@/lib/role-data";
import {
  ArrowLeft,
  CalendarClock,
  Camera,
  Droplets,
  Leaf,
  Pencil,
  Plus,
  ScanLine,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

function usePlants() {
  return useLocalState<GrowerPlant[]>("grower:plants", GROWER_PLANTS);
}

const HEALTH_TONE = {
  Healthy: "green",
  "Needs Attention": "amber",
  "Check Soon": "blue",
} as const;

export function GrowerPlants() {
  const [plants, setPlants] = usePlants();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    variety: "",
    space: GROWER_SPACES[0],
    watering: "Water in 3 days",
  });

  function addPlant() {
    if (draft.name.trim().length < 2) {
      toast.error("Please enter a plant name.");
      return;
    }
    const plant: GrowerPlant = {
      id: `plant-${Date.now()}`,
      name: draft.name.trim(),
      variety: draft.variety.trim() || "Species not set",
      image: IMG.growing,
      health: "Check Soon",
      lastChecked: "Not scanned yet",
      watering: draft.watering,
      light: "Add after your first scan",
      soil: "Add after your first scan",
      tip: `Keep an eye on this ${draft.space.toLowerCase()} plant for the first week.`,
    };
    setPlants((list) => [plant, ...list]);
    setDraft({ name: "", variety: "", space: GROWER_SPACES[0], watering: "Water in 3 days" });
    setOpen(false);
    toast.success(`${plant.name} added to your plants`);
  }

  return (
    <RolePage
      role="home_grower"
      active="plants"
      title="My Plants"
      subtitle="Every plant you are growing, with its latest health check."
      action={
        <Button
          size="lg"
          className="h-12 rounded-xl px-5 text-[15px] font-semibold"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-4" />
          Add Plant
        </Button>
      }
    >
      <HeroPanel role="home_grower">
        <SectionHead
          title="Scan a plant to update its health"
          subtitle="Take or upload a clear photo of the affected leaf."
        />
        <Button
          asChild
          size="lg"
          className="mt-4 h-13 rounded-xl px-6 text-[15px] font-semibold"
        >
          <Link to="/grower/scan">
            <ScanLine className="size-5" />
            Open Plant Scanner
          </Link>
        </Button>
      </HeroPanel>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plants.map((plant) => (
          <Panel key={plant.id} className="overflow-hidden p-0">
            <Photo src={plant.image} alt={plant.name} ratio="aspect-[4/3]" />
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-semibold text-foreground">
                    {plant.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {plant.variety}
                  </p>
                </div>
                <StatusPill label={plant.health} tone={HEALTH_TONE[plant.health]} />
              </div>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <span>Last scan: {plant.lastChecked}</span>
                <span className="flex items-center gap-1.5">
                  <Droplets className="size-3.5 text-primary" />
                  {plant.watering}
                </span>
              </div>
              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-xl text-sm font-semibold"
              >
                <Link to={`/grower/plants/${plant.id}`}>Open details</Link>
              </Button>
            </div>
          </Panel>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Add a plant</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Plant name</Label>
              <Input
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                placeholder="e.g. Monstera"
                className="h-12 rounded-xl text-[15px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Variety (optional)</Label>
              <Input
                value={draft.variety}
                onChange={(event) =>
                  setDraft({ ...draft, variety: event.target.value })
                }
                placeholder="e.g. Monstera deliciosa"
                className="h-12 rounded-xl text-[15px]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Growing space</Label>
              <Select
                value={draft.space}
                onValueChange={(value) => setDraft({ ...draft, space: value })}
              >
                <SelectTrigger className="h-12 w-full rounded-xl text-[15px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GROWER_SPACES.map((space) => (
                    <SelectItem key={space} value={space}>
                      {space}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              size="lg"
              className="h-12 w-full rounded-xl text-[15px] font-semibold"
              onClick={addPlant}
            >
              Add Plant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RolePage>
  );
}

export function GrowerPlantDetail() {
  const { id } = useParams();
  const [plants, setPlants] = usePlants();
  const [, setReminders] = useLocalState<GrowerReminder[]>(
    "grower:reminders",
    GROWER_REMINDERS,
  );
  const [editing, setEditing] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderDraft, setReminderDraft] = useState({
    type: GROWER_REMINDER_TYPES[0],
    when: "Today · 6:00 PM",
  });
  const [name, setName] = useState("");

  const plant = plants.find((item) => item.id === id) ?? GROWER_PLANTS[0];

  return (
    <RolePage
      role="home_grower"
      active="plants"
      title={plant.name}
      subtitle={plant.variety}
      action={
        <Link
          to="/grower/plants"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          All plants
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-6">
          <Panel className="overflow-hidden p-0">
            <Photo src={plant.image} alt={plant.name} ratio="aspect-[16/9]" />
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="text-lg font-semibold text-foreground">{plant.name}</p>
                <p className="text-sm text-muted-foreground">
                  Last AI analysis: {plant.lastChecked}
                </p>
              </div>
              <StatusPill label={plant.health} tone={HEALTH_TONE[plant.health]} />
            </div>
          </Panel>

          <Panel className="p-5">
            <SectionHead title="Care details" />
            <div className="mt-3">
              <MetaRow label="Watering" value={plant.watering} icon={Droplets} />
              <MetaRow label="Light" value={plant.light} icon={Sun} />
              <MetaRow label="Soil" value={plant.soil} icon={Leaf} />
            </div>
          </Panel>

          <Panel className="p-5">
            <SectionHead title="Care tips" subtitle="Simple steps for this plant." />
            <ul className="mt-3 flex flex-col gap-2.5">
              <li className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <Leaf className="mt-0.5 size-4 shrink-0 text-primary" />
                {plant.tip}
              </li>
              <li className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <Leaf className="mt-0.5 size-4 shrink-0 text-primary" />
                Check the leaves weekly and scan again if you spot new spots.
              </li>
              <li className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <Leaf className="mt-0.5 size-4 shrink-0 text-primary" />
                Keep the pot slightly away from direct afternoon sun.
              </li>
            </ul>
          </Panel>
        </div>

        <aside className="flex flex-col gap-4">
          <Panel className="flex flex-col gap-3 p-5">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-xl text-[15px] font-semibold"
            >
              <Link to="/grower/scan">
                <Camera className="size-4" />
                Scan Plant
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-xl text-[15px] font-semibold"
              onClick={() => setReminderOpen(true)}
            >
              <CalendarClock className="size-4" />
              Add Reminder
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-12 w-full rounded-xl text-[15px] font-semibold text-muted-foreground"
              onClick={() => {
                setName(plant.name);
                setEditing(true);
              }}
            >
              <Pencil className="size-4" />
              Edit Plant
            </Button>
          </Panel>

          <Panel className="p-5">
            <SectionHead title="Reminders" subtitle="For this plant" />
            <ul className="mt-3 flex flex-col gap-3">
              {GROWER_REMINDERS.slice(0, 3).map((item) => (
                <li key={item.id} className="text-sm">
                  <p className="font-medium text-foreground">{item.type}</p>
                  <p className="text-xs text-muted-foreground">{item.when}</p>
                </li>
              ))}
            </ul>
            <Link
              to="/grower/reminders"
              className="mt-4 inline-block text-[13px] font-semibold text-primary hover:underline"
            >
              Open reminder centre
            </Link>
          </Panel>
        </aside>
      </div>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Edit plant</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-2">
            <Label className="text-sm font-medium">Plant name</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 rounded-xl text-[15px]"
            />
          </div>
          <DialogFooter>
            <Button
              size="lg"
              className="h-12 w-full rounded-xl text-[15px] font-semibold"
              onClick={() => {
                setPlants((list) =>
                  list.map((item) =>
                    item.id === plant.id
                      ? { ...item, name: name.trim() || item.name }
                      : item,
                  ),
                );
                setEditing(false);
                toast.success("Plant updated");
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Add a reminder</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Reminder type</Label>
              <Select
                value={reminderDraft.type}
                onValueChange={(value) =>
                  setReminderDraft({ ...reminderDraft, type: value })
                }
              >
                <SelectTrigger className="h-12 w-full rounded-xl text-[15px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GROWER_REMINDER_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">When</Label>
              <Input
                value={reminderDraft.when}
                onChange={(event) =>
                  setReminderDraft({ ...reminderDraft, when: event.target.value })
                }
                className="h-12 rounded-xl text-[15px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              size="lg"
              className="h-12 w-full rounded-xl text-[15px] font-semibold"
              onClick={() => {
                setReminders((list) => [
                  {
                    id: `reminder-${Date.now()}`,
                    type: reminderDraft.type,
                    plant: plant.name,
                    when: reminderDraft.when,
                    tone: "upcoming",
                  },
                  ...list,
                ]);
                setReminderOpen(false);
                toast.success("Reminder added");
              }}
            >
              Save reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RolePage>
  );
}
