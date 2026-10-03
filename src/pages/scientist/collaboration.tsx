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
  SCIENTIST_COLLABORATORS,
  SCIENTIST_SHARED_ANALYSES,
  SCIENTIST_SHARED_DATASETS,
} from "@/lib/role-data";
import { Database, Mail, Share2, Users } from "lucide-react";

const ACCENT = "#5E35B1";

export function ScientistCollaboration() {
  return (
    <RolePage
      role="scientist"
      active="collaboration"
      title="Collaboration"
      subtitle="Work with pathologists, agronomists and dataset owners across institutions."
      action={
        <Button className="h-11 gap-2 rounded-xl" style={{ backgroundColor: ACCENT }}>
          <Mail className="size-4" />
          Invite researcher
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Collaborators"
          value={String(SCIENTIST_COLLABORATORS.length)}
          note="Across three institutions"
          icon={Users}
          accent={ACCENT}
        />
        <StatTile
          label="Shared analyses"
          value={String(SCIENTIST_SHARED_ANALYSES.length)}
          note="Collections open to you"
          icon={Share2}
          accent={ACCENT}
        />
        <StatTile
          label="Shared datasets"
          value={String(SCIENTIST_SHARED_DATASETS.length)}
          note="Available to download"
          icon={Database}
          accent={ACCENT}
        />
        <StatTile
          label="Institutions"
          value="3"
          note="ICAR, IIT, UAS"
          icon={Users}
          accent={ACCENT}
        />
      </div>

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="Your collaborators"
            subtitle="People you share projects and analyses with"
          />
          <DemoTag />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {SCIENTIST_COLLABORATORS.map((person) => (
            <Panel key={person.id} className="flex items-center gap-4">
              <img
                src={person.avatar}
                alt=""
                className="size-14 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{person.name}</p>
                <p className="truncate text-xs text-muted-foreground">{person.role}</p>
                <p className="truncate text-xs text-muted-foreground">{person.institution}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusPill label={`${person.projects} projects`} tone="blue" />
                  <StatusPill label={`${person.shared} shared`} tone="gray" />
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-10 shrink-0 gap-2 rounded-xl">
                <Mail className="size-3.5" />
                Message
              </Button>
            </Panel>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionHead
            title="Shared analyses"
            subtitle="Analysis collections colleagues opened to you"
          />
          <ul className="mt-4 flex flex-col gap-3">
            {SCIENTIST_SHARED_ANALYSES.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EAF0EA] bg-surface-2 px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Shared by {item.by} · {item.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill label={`${item.items} items`} tone="blue" />
                  <Button variant="ghost" size="sm" className="h-9 rounded-lg text-[13px]">
                    Open
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <SectionHead
            title="Shared datasets"
            subtitle="Datasets your collaborators have published"
          />
          <ul className="mt-4 flex flex-col gap-3">
            {SCIENTIST_SHARED_DATASETS.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EAF0EA] bg-surface-2 px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Published by {item.by}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill
                    label={`${item.images.toLocaleString("en-IN")} images`}
                    tone="green"
                  />
                  <Button variant="ghost" size="sm" className="h-9 rounded-lg text-[13px]">
                    Request access
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel>
        <SectionHead
          title="Collaboration norms"
          subtitle="How sharing works in PlantGuard"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              title: "Ask before publishing",
              body: "Shared analyses stay private to collaborators until the owner publishes them.",
            },
            {
              title: "Credit stays attached",
              body: "Every shared record keeps the original author and institution with it.",
            },
            {
              title: "Verify before use",
              body: "Model outputs from a collaborator still need expert verification before use.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-2 rounded-2xl border border-[#EAF0EA] bg-surface-2 p-4"
            >
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-[13px] leading-6 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Panel>
    </RolePage>
  );
}

export default ScientistCollaboration;
