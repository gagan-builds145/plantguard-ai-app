import {
  DemoTag,
  FilterPills,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
  StatusPill,
} from "@/components/role-ui";
import { ResourceDialog } from "@/components/role-dialogs";
import { Button } from "@/components/ui/button";
import { useLocalState } from "@/hooks/use-local-state";
import {
  SCIENTIST_LIBRARY,
  SCIENTIST_LIBRARY_CATEGORIES,
  type LibraryResource,
} from "@/lib/role-data";
import { BookOpen, Bookmark, ExternalLink, FileText, Search } from "lucide-react";
import { useMemo, useState } from "react";

const ACCENT = "#5E35B1";
const TYPES = ["All", "Review", "Paper", "Guide", "Dataset"] as const;

const TYPE_TONE = {
  Review: "blue",
  Paper: "green",
  Guide: "amber",
  Dataset: "gray",
} as const;

export function ScientistLibrary() {
  const [category, setCategory] = useState<string>(SCIENTIST_LIBRARY_CATEGORIES[0]);
  const [type, setType] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useLocalState<string[]>(
    "scientist:saved-resources",
    SCIENTIST_LIBRARY.filter((item) => item.saved).map((item) => item.id),
  );
  const [resourceOpen, setResourceOpen] = useState(false);
  const [openResource, setOpenResource] = useState<LibraryResource | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return SCIENTIST_LIBRARY.filter((item) => {
      const matchesCategory = item.category === category;
      const matchesType = type === "All" || item.type === type;
      const matchesQuery =
        !needle ||
        item.title.toLowerCase().includes(needle) ||
        item.source.toLowerCase().includes(needle);
      return matchesCategory && matchesType && matchesQuery;
    });
  }, [category, type, query]);

  const toggleSaved = (item: LibraryResource) =>
    setSaved((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
    );

  return (
    <RolePage
      role="scientist"
      active="library"
      title="Research Library"
      subtitle="Reviews, papers, guides and datasets grouped by the fields you work in."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Resources"
          value={String(SCIENTIST_LIBRARY.length)}
          note="In this sample library"
          icon={BookOpen}
          accent={ACCENT}
        />
        <StatTile
          label="Categories"
          value={String(SCIENTIST_LIBRARY_CATEGORIES.length)}
          note="Research fields"
          icon={FileText}
          accent={ACCENT}
        />
        <StatTile
          label="Saved"
          value={String(saved.length)}
          note="Your reading list"
          icon={Bookmark}
          accent={ACCENT}
        />
        <StatTile
          label="Papers"
          value={String(SCIENTIST_LIBRARY.filter((item) => item.type === "Paper").length)}
          note="Journal articles"
          icon={FileText}
          accent={ACCENT}
        />
      </div>

      <Panel className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHead
            title="Browse resources"
            subtitle={`${visible.length} item${visible.length === 1 ? "" : "s"} in ${category}`}
          />
          <DemoTag />
        </div>
        <FilterPills
          options={SCIENTIST_LIBRARY_CATEGORIES}
          value={category}
          onChange={setCategory}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search titles and sources"
              aria-label="Search library"
              className="h-11 w-full rounded-xl border border-[#EAF0EA] bg-surface-2 pl-10 pr-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {TYPES.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={type === option}
                onClick={() => setType(option)}
                className={
                  type === option
                    ? "h-11 shrink-0 rounded-xl border px-4 text-[13px] font-medium"
                    : "h-11 shrink-0 rounded-xl border border-[#EAF0EA] bg-card px-4 text-[13px] font-medium text-muted-foreground hover:text-foreground"
                }
                style={
                  type === option
                    ? { borderColor: ACCENT, color: ACCENT, backgroundColor: `${ACCENT}12` }
                    : undefined
                }
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => {
          const isSaved = saved.includes(item.id);
          return (
            <Panel key={item.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <span
                  className="flex size-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${ACCENT}1A`, color: ACCENT }}
                >
                  <FileText className="size-4" />
                </span>
                <StatusPill label={item.type} tone={TYPE_TONE[item.type]} />
              </div>
              <p className="text-sm font-semibold leading-6 text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.source} · {item.year} · {item.category}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Button
                  variant={isSaved ? "secondary" : "outline"}
                  size="sm"
                  className="h-10 flex-1 gap-2 rounded-xl"
                  onClick={() => toggleSaved(item)}
                >
                  <Bookmark className="size-3.5" />
                  {isSaved ? "Saved" : "Save"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 gap-2 rounded-xl"
                  onClick={() => {
                    setOpenResource(item);
                    setResourceOpen(true);
                  }}
                >
                  <ExternalLink className="size-3.5" />
                  Open
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>

      <ResourceDialog
        open={resourceOpen}
        onOpenChange={setResourceOpen}
        resource={openResource}
        accent={ACCENT}
      />

      {visible.length === 0 ? (
        <Panel className="py-10 text-center">
          <p className="text-sm font-medium text-foreground">Nothing here yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Try another category, type or search term.
          </p>
        </Panel>
      ) : null}
    </RolePage>
  );
}

export default ScientistLibrary;
