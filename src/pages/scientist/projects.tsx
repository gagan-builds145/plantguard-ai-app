import {
  DemoTag,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalState } from "@/hooks/use-local-state";
import { SCIENTIST_PROJECTS, type ResearchProject } from "@/lib/role-data";
import { BarChart3, FolderKanban, Images, Plus, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

const ACCENT = "#5E35B1";

const STATUS_TONE = {
  Active: "green",
  Analysis: "blue",
  Review: "amber",
  Archived: "gray",
} as const;

export function ScientistProjects() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useLocalState<ResearchProject[]>(
    "scientist:projects",
    [],
  );

  const projects = [...created, ...SCIENTIST_PROJECTS];
  const totalAnalyses = projects.reduce((sum, item) => sum + item.analyses, 0);

  const create = () => {
    if (!name.trim()) {
      toast.error("Give the project a name first.");
      return;
    }
    setSaving(true);
    const project: ResearchProject = {
      id: `pr-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || "New research project.",
      status: "Active",
      updated: "Just now",
      analyses: 0,
      collaborators: 1,
    };
    setCreated((prev) => [project, ...prev]);
    setName("");
    setDescription("");
    setSaving(false);
    setOpen(false);
    toast.success("Project created");
  };

  return (
    <RolePage
      role="scientist"
      active="projects"
      title="Research Projects"
      subtitle="Group your analyses, datasets and collaborators around a research question."
      action={
        <Button
          className="h-11 gap-2 rounded-xl"
          onClick={() => setOpen(true)}
          style={{ backgroundColor: ACCENT }}
        >
          <Plus className="size-4" />
          Create Project
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Projects"
          value={String(projects.length)}
          note="Including archived"
          icon={FolderKanban}
          accent={ACCENT}
        />
        <StatTile
          label="Analyses"
          value={totalAnalyses.toLocaleString("en-IN")}
          note="Across projects"
          icon={Images}
          accent={ACCENT}
        />
        <StatTile
          label="Collaborators"
          value={String(
            projects.reduce((sum, item) => sum + item.collaborators, 0),
          )}
          note="Project memberships"
          icon={Users}
          accent={ACCENT}
        />
        <StatTile
          label="Datasets linked"
          value="5"
          note="Available to all projects"
          icon={BarChart3}
          accent={ACCENT}
        />
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="Your projects"
            subtitle="Sample project records for this workspace"
          />
          <DemoTag />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {projects.map((project) => (
            <Panel key={project.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-semibold text-foreground">{project.name}</p>
                  <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                    {project.description}
                  </p>
                </div>
                <StatusPill label={project.status} tone={STATUS_TONE[project.status]} />
              </div>
              <div className="flex flex-wrap items-center gap-2 rounded-xl bg-surface-2 px-3.5 py-3">
                <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <Images className="size-3.5" />
                  {project.analyses} analyses
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <Users className="size-3.5" />
                  {project.collaborators} collaborators
                </span>
                <span className="text-[13px] text-muted-foreground">
                  Updated {project.updated}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm" className="h-10 rounded-xl">
                  <Link to="/lab/analysis">Run analysis</Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="h-10 rounded-xl">
                  <Link to="/lab/datasets">View datasets</Link>
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      </Panel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create research project</DialogTitle>
            <DialogDescription>
              Projects hold your analyses, datasets and collaborators in one place.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <label className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium">Project name</Label>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Citrus canker detection"
                className="h-11 rounded-xl"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-medium">Research question</Label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                placeholder="What are you trying to classify or measure?"
                className="w-full rounded-xl border border-[#EAF0EA] bg-surface-2 px-3.5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </label>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="h-11 rounded-xl"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-11 rounded-xl"
              style={{ backgroundColor: ACCENT }}
              disabled={saving}
              onClick={create}
            >
              Create project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RolePage>
  );
}

export default ScientistProjects;
