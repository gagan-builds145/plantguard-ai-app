import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { ROLE_META, type NewRoleId } from "@/lib/roles";
import { cn } from "@/lib/utils";
import {
  Check,
  Info,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Star,
} from "lucide-react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Shared PlantGuard AI surfaces
 *
 * Every role keeps the same card, button, input and typography language.
 * Role accents are only ever a subtle secondary highlight.
 * ------------------------------------------------------------------ */

/** Page heading (30–36px) + optional supporting text and page action. */
export function RolePage({
  role,
  active,
  title,
  subtitle,
  action,
  children,
}: {
  role: NewRoleId;
  active: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const meta = ROLE_META[role];
  return (
    <AppShell active={active}>
      <div
        className="mx-auto flex w-full max-w-[1080px] flex-col gap-6"
        style={{ ["--role-accent" as string]: meta.accent }}
      >
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-[32px]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
                {subtitle}
              </p>
            ) : null}
          </div>
          {action}
        </header>
        {children}
      </div>
    </AppShell>
  );
}

/** Standard card: white, 16px radius, light border, subtle shadow. */
export function Panel({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: ReactNode;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-[#EAF0EA] bg-card p-5 shadow-[0_1px_3px_rgba(20,40,20,0.06)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Soft botanical backdrop used inside hero cards — never busy. */
function BotanicalBackdrop({ accent }: { accent: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 200"
      className="pointer-events-none absolute -right-6 -top-6 h-[220px] w-[300px] opacity-[0.16]"
    >
      <g fill="none" stroke={accent} strokeWidth="2">
        <path d="M20 190 C 60 120, 70 70, 120 20" />
        <path d="M120 20 C 150 40, 190 44, 214 30" />
        <path d="M60 132 C 96 128, 132 140, 150 166" />
        <path d="M86 88 C 120 96, 150 92, 172 74" />
      </g>
      <g fill={accent}>
        <ellipse cx="212" cy="30" rx="22" ry="12" transform="rotate(-14 212 30)" />
        <ellipse cx="152" cy="168" rx="26" ry="13" transform="rotate(24 152 168)" />
        <ellipse cx="176" cy="72" rx="20" ry="11" transform="rotate(-24 176 72)" />
      </g>
    </svg>
  );
}

/** Hero card: 24px radius, soft green background, botanical visual. */
export function HeroPanel({
  role,
  children,
  className,
  tone = "green",
}: {
  role: NewRoleId;
  children: ReactNode;
  className?: string;
  tone?: "green" | "plain";
}) {
  const meta = ROLE_META[role];
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border p-6 sm:p-7",
        tone === "green"
          ? "border-[#E2EFE2] bg-[#F2F8F2]"
          : "border-[#EAF0EA] bg-card",
        className,
      )}
    >
      {tone === "green" ? <BotanicalBackdrop accent={meta.accent} /> : null}
      <div className="relative">{children}</div>
    </section>
  );
}

export function SectionHead({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-lg font-semibold tracking-[-0.01em] text-foreground sm:text-xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function StatTile({
  label,
  value,
  note,
  icon: Icon,
  accent,
  className,
}: {
  label: string;
  value: string;
  note?: string;
  icon?: typeof Star;
  accent?: string;
  className?: string;
}) {
  return (
    <Panel className={cn("p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {Icon ? (
          <span
            className="flex size-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: accent ? `${accent}1A` : "#E8F5E9" }}
          >
            <Icon
              className="size-4"
              style={{ color: accent ?? "#2E7D32" }}
            />
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-[26px] font-bold leading-none tracking-[-0.02em] text-foreground">
        {value}
      </p>
      {note ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{note}</p>
      ) : null}
    </Panel>
  );
}

/** Marks sample content so nothing reads as a real statistic. */
export function DemoTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[#F3E2B0] bg-warning-bg px-2 py-0.5 text-[11px] font-semibold text-[#8a5a00]",
        className,
      )}
    >
      Demo data
    </span>
  );
}

const TONES = {
  green: "border-transparent bg-success-bg text-success",
  amber: "border-transparent bg-warning-bg text-[#8a5a00]",
  red: "border-transparent bg-danger-bg text-danger",
  blue: "border-transparent bg-info-bg text-info",
  gray: "border-[#EAF0EA] bg-surface-3 text-muted-foreground",
} as const;

export type PillTone = keyof typeof TONES;

export function StatusPill({
  label,
  tone = "gray",
  className,
}: {
  label: string;
  tone?: PillTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        TONES[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}

export function Stars({
  rating,
  reviews,
}: {
  rating: number;
  reviews?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-0.5 text-[#F9A825]">
        {[0, 1, 2, 3, 4].map((index) => (
          <Star
            key={index}
            className="size-3"
            strokeWidth={2}
            fill={index < Math.round(rating) ? "currentColor" : "none"}
            color={index < Math.round(rating) ? "#F9A825" : "#C9D3C9"}
          />
        ))}
      </span>
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      {reviews !== undefined ? <span>({reviews})</span> : null}
    </span>
  );
}

export type MapMarker = {
  id: string;
  x: number;
  y: number;
  label: string;
  tone?: "request" | "self" | "destination";
};

/**
 * A deliberately quiet map surface: service area, nearby markers and simple
 * navigation controls — no decoration competing with the task at hand.
 */
export function MiniMap({
  markers = [],
  serviceLabel,
  accent = "#2E7D32",
  className,
  showControls = true,
}: {
  markers?: MapMarker[];
  serviceLabel?: string;
  accent?: string;
  className?: string;
  showControls?: boolean;
}) {
  const pinColor: Record<NonNullable<MapMarker["tone"]>, string> = {
    request: accent,
    self: "#2E7D32",
    destination: "#EF6C00",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#EAF0EA] bg-[#F5F9F5]",
        className,
      )}
      role="img"
      aria-label={serviceLabel ?? "Service area map"}
    >
      <svg
        aria-hidden
        viewBox="0 0 400 260"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        <rect width="400" height="260" fill="#F5F9F5" />
        <path d="M-10 190 L410 128" stroke="#E1E9E1" strokeWidth="14" fill="none" />
        <path d="M-10 190 L410 128" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeDasharray="10 12" />
        <path d="M118 -10 L176 270" stroke="#E1E9E1" strokeWidth="10" fill="none" />
        <path d="M-10 66 L410 34" stroke="#EAF0EA" strokeWidth="8" fill="none" />
        <path d="M300 -10 L268 270" stroke="#EAF0EA" strokeWidth="6" fill="none" />
        <circle cx="205" cy="140" r="58" fill={accent} opacity="0.08" />
        <circle cx="205" cy="140" r="58" fill="none" stroke={accent} strokeOpacity="0.22" strokeDasharray="5 6" />
      </svg>

      {markers.map((marker) => (
        <span
          key={marker.id}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        >
          <span
            className="flex size-7 items-center justify-center rounded-full border-2 border-white shadow-[0_2px_6px_rgba(20,40,20,0.22)]"
            style={{ backgroundColor: pinColor[marker.tone ?? "request"] }}
          >
            <MapPin className="size-3.5 text-white" strokeWidth={2.4} />
          </span>
        </span>
      ))}

      <span
        className="absolute left-1/2 top-[52%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-[#EAF0EA] bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-[0_2px_6px_rgba(20,40,20,0.10)]"
      >
        <Navigation className="size-3 text-primary" />
        {serviceLabel ?? "Your service area"}
      </span>

      {showControls ? (
        <div className="absolute bottom-3 right-3 flex flex-col overflow-hidden rounded-xl border border-[#EAF0EA] bg-white/95 shadow-[0_2px_6px_rgba(20,40,20,0.10)]">
          <span className="flex size-8 items-center justify-center text-muted-foreground">
            <Plus className="size-4" />
          </span>
          <span className="h-px w-full bg-[#EAF0EA]" />
          <span className="flex size-8 items-center justify-center text-muted-foreground">
            <Minus className="size-4" />
          </span>
        </div>
      ) : null}
    </div>
  );
}

/** Offline → online control with a clear status indicator. */
export function AvailabilityPanel({
  online,
  onToggle,
  offLabel,
  ctaLabel,
  onLabel,
  waitingText,
  accent = "#2E7D32",
}: {
  online: boolean;
  onToggle: (next: boolean) => void;
  offLabel: string;
  ctaLabel: string;
  onLabel: string;
  waitingText: string;
  accent?: string;
}) {
  return (
    <Panel
      className="flex flex-col gap-5 p-6"
      as="div"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Availability
          </p>
          <p
            className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-[-0.02em]"
            style={{ color: online ? accent : "#536153" }}
          >
            <span
              className={cn(
                "inline-flex size-2.5 rounded-full",
                online ? "animate-pulse" : "bg-[#C9D3C9]",
              )}
              style={online ? { backgroundColor: accent } : undefined}
            />
            {online ? onLabel : offLabel}
          </p>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            {online ? waitingText : "Go online when you are ready to take work."}
          </p>
        </div>
        <span
          className="hidden size-12 shrink-0 items-center justify-center rounded-2xl sm:flex"
          style={{ backgroundColor: `${accent}1A` }}
        >
          <Navigation className="size-6" style={{ color: accent }} />
        </span>
      </div>

      <Button
        size="lg"
        onClick={() => onToggle(!online)}
        className={cn(
          "h-13 w-full rounded-xl text-[15px] font-semibold sm:w-auto sm:px-8",
          online && "bg-card text-foreground",
        )}
        variant={online ? "outline" : "default"}
        style={online ? { borderColor: accent, color: accent } : { backgroundColor: accent }}
      >
        {online ? "GO OFFLINE" : ctaLabel}
      </Button>
    </Panel>
  );
}

export function Photo({
  src,
  alt,
  className,
  ratio = "aspect-[4/3]",
}: {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div className={cn("overflow-hidden bg-surface-3", ratio, className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="size-full object-cover transition-transform duration-500 hover:scale-[1.03]"
      />
    </div>
  );
}

export function Chip({
  label,
  selected,
  onClick,
  icon: Icon,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: typeof Star;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-accent text-accent-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {selected ? (
        <Check className="size-3.5 text-primary" strokeWidth={3} />
      ) : Icon ? (
        <Icon className="size-3.5" />
      ) : null}
      {label}
    </button>
  );
}

export function InfoNote({
  children,
  tone = "info",
  icon: Icon = Info,
}: {
  children: ReactNode;
  tone?: "info" | "warn" | "plain";
  icon?: typeof Star;
}) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-xl px-3.5 py-3 text-xs leading-5",
        tone === "info" && "bg-info-bg text-info",
        tone === "warn" && "bg-warning-bg text-[#8a5a00]",
        tone === "plain" && "bg-surface-2 text-muted-foreground",
      )}
    >
      <Icon className="mt-0.5 size-3.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

/** Simple horizontal bar list — used for categories and demand signals. */
export function BarList({
  items,
  accent = "#2E7D32",
}: {
  items: { label: string; value: number; note?: string }[];
  accent?: string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-foreground">{item.label}</span>
            <span className="text-xs font-semibold text-muted-foreground">
              {item.note ?? item.value}
            </span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.round((item.value / max) * 100)}%`,
                backgroundColor: accent,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function FilterPills({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly string[];
  value: string;
  onChange: (next: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1", className)}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-medium transition-colors",
            value === option
              ? "border-primary bg-accent text-accent-foreground"
              : "border-[#EAF0EA] bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/** Label + value row used inside detail panels. */
export function MetaRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon?: typeof Star;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#F1F5F1] py-2.5 last:border-b-0">
      <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
        {Icon ? <Icon className="size-3.5" /> : null}
        {label}
      </span>
      <span className="text-right text-[13px] font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

/** Responsive table frame: real table on desktop, stacked cards on mobile. */
export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-[#EAF0EA] bg-card shadow-[0_1px_3px_rgba(20,40,20,0.06)] md:block">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "border-b border-[#EAF0EA] bg-surface-2 px-4 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <td className={cn("border-b border-[#F1F5F1] px-4 py-3.5 align-middle", className)}>
      {children}
    </td>
  );
}
