import {
  FilterPills,
  Panel,
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
  GROWER_CARE_GUIDES,
  GROWER_PLANTS,
  GROWER_REMINDERS,
  GROWER_REMINDER_TYPES,
  type GrowerReminder,
} from "@/lib/role-data";
import { cn } from "@/lib/utils";
import { CalendarClock, Check, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CHECKLIST = [
  "Water only when the top soil feels dry",
  "Wipe dust off large leaves",
  "Turn pots a quarter turn each week",
  "Remove dead or yellowing leaves",
  "Check under leaves for pests",
  "Move light-hungry plants closer to the window",
];

export function GrowerCare() {
  const [done, setDone] = useLocalState<string[]>("grower:care-checklist", []);

  return (
    <RolePage
      role="home_grower"
      active="care"
      title="Plant Care"
      subtitle="Practical care guidance for the plants you keep at home."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GROWER_CARE_GUIDES.map((guide) => (
          <Panel key={guide.key} className="p-5">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#EAF6EA] text-lg">
              <span aria-hidden>{guide.icon}</span>
            </span>
            <p className="mt-3.5 text-[16px] font-semibold text-foreground">
              {guide.title}
            </p>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              {guide.summary}
            </p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel className="p-5">
          <SectionHead
            title="Weekly care checklist"
            subtitle="Tick items off as you go — it resets when you clear it."
          />
          <ul className="mt-4 flex flex-col gap-2.5">
            {CHECKLIST.map((item) => {
              const isDone = done.includes(item);
              return (
                <li key={item}>
                  <button
                    type="button"
                    aria-pressed={isDone}
                    onClick={() =>
                      setDone((list) =>
                        list.includes(item)
                          ? list.filter((value) => value !== item)
                          : [...list, item],
                      )
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                      isDone
                        ? "border-primary/30 bg-accent text-accent-foreground"
                        : "border-[#EAF0EA] text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border",
                        isDone ? "border-primary bg-primary text-white" : "border-border",
                      )}
                    >
                      {isDone ? <Check className="size-3.5" strokeWidth={3} /> : null}
                    </span>
                    <span className={cn(isDone && "line-through opacity-80")}>{item}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {done.length > 0 ? (
            <Button
              variant="ghost"
              className="mt-3 h-11 rounded-xl text-sm font-semibold text-muted-foreground"
              onClick={() => setDone([])}
            >
              Clear checklist
            </Button>
          ) : null}
        </Panel>

        <aside className="flex flex-col gap-4">
          <Panel className="p-5">
            <SectionHead title="Your care routine" subtitle="Based on your plants" />
            <ul className="mt-4 flex flex-col gap-3.5">
              {GROWER_PLANTS.slice(0, 4).map((plant) => (
                <li key={plant.id} className="flex items-center gap-3">
                  <img src={plant.image} alt="" className="size-10 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {plant.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{plant.watering}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel className="p-5">
            <SectionHead title="Seasonal note" />
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Growth slows in cooler weeks — reduce feeding rather than watering.
              Water logged soil is the most common cause of home plant problems.
            </p>
          </Panel>
        </aside>
      </div>
    </RolePage>
  );
}

export function GrowerReminders() {
  const [reminders, setReminders] = useLocalState<GrowerReminder[]>(
    "grower:reminders",
    GROWER_REMINDERS,
  );
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    type: GROWER_REMINDER_TYPES[0],
    plant: GROWER_PLANTS[0].name,
    when: "Tomorrow · 7:00 AM",
  });

  const visible =
    filter === "All"
      ? reminders
      : filter === "Completed"
        ? reminders.filter((item) => item.tone === "done")
        : reminders.filter((item) => item.type === filter);

  const options = ["All", ...GROWER_REMINDER_TYPES, "Completed"];

  return (
    <RolePage
      role="home_grower"
      active="reminders"
      title="Reminders"
      subtitle="Watering, feeding and plant care tasks you have planned."
      action={
        <Button
          size="lg"
          className="h-12 rounded-xl px-5 text-[15px] font-semibold"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-4" />
          Add Reminder
        </Button>
      }
    >
      <FilterPills options={options} value={filter} onChange={setFilter} />

      <div className="flex flex-col gap-4">
        {visible.map((item) => (
          <Panel key={item.id} className="flex items-center gap-4 p-4">
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                item.tone === "today"
                  ? "bg-accent text-primary"
                  : item.tone === "done"
                    ? "bg-success-bg text-success"
                    : "bg-surface-3 text-muted-foreground",
              )}
            >
              <CalendarClock className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-foreground">
                {item.type} · {item.plant}
              </p>
              <p className="text-xs text-muted-foreground">{item.when}</p>
            </div>
            <StatusPill
              label={
                item.tone === "today" ? "Today" : item.tone === "done" ? "Done" : "Upcoming"
              }
              tone={item.tone === "today" ? "amber" : item.tone === "done" ? "green" : "gray"}
            />
          </Panel>
        ))}
        {visible.length === 0 ? (
          <Panel className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No reminders in this view yet.
            </p>
          </Panel>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className="h-11 rounded-xl text-sm font-semibold"
          onClick={() =>
            setReminders((list) => list.map((item) => ({ ...item, tone: "done" })))
          }
        >
          <Check className="size-4" />
          Mark all as done
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Add a reminder</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Reminder type</Label>
              <Select
                value={draft.type}
                onValueChange={(value) => setDraft({ ...draft, type: value })}
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
              <Label className="text-sm font-medium">Plant</Label>
              <Select
                value={draft.plant}
                onValueChange={(value) => setDraft({ ...draft, plant: value })}
              >
                <SelectTrigger className="h-12 w-full rounded-xl text-[15px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GROWER_PLANTS.map((plant) => (
                    <SelectItem key={plant.id} value={plant.name}>
                      {plant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">When</Label>
              <Input
                value={draft.when}
                onChange={(event) => setDraft({ ...draft, when: event.target.value })}
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
                  { id: `reminder-${Date.now()}`, tone: "upcoming", ...draft },
                  ...list,
                ]);
                setOpen(false);
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
