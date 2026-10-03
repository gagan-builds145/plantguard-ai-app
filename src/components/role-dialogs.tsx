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
import { useState } from "react";
import { toast } from "sonner";

type Cover = {
  title: string;
  summary: string;
  points: string[];
};

/**
 * Cover enquiry used by the Seller, Vehicle Owner and Labour insurance pages.
 * Collects a callback number and confirms the request — no dead buttons.
 */
export function CoverDialog({
  open,
  onOpenChange,
  cover,
  accent = "#2E7D32",
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  cover: Cover | null;
  accent?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (!cover) return null;

  const submit = () => {
    if (!name.trim() || phone.trim().length < 6) {
      toast.error("Add your name and a valid phone number.");
      return;
    }
    toast.success(`Request sent for ${cover.title}. We'll call you back.`);
    setName("");
    setPhone("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{cover.title}</DialogTitle>
          <DialogDescription>{cover.summary}</DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-2 py-1 text-sm text-muted-foreground">
          {cover.points.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <span
                className="mt-1.5 size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: accent }}
              />
              {point}
            </li>
          ))}
        </ul>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <Label className="text-[13px] font-medium">Your name</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Name"
              className="h-11 rounded-xl"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <Label className="text-[13px] font-medium">Phone</Label>
            <Input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              inputMode="tel"
              placeholder="Phone number"
              className="h-11 rounded-xl"
            />
          </label>
        </div>
        <InfoNote>
          No insurer is connected in this prototype — your details stay in this browser
          until a partner is wired up.
        </InfoNote>
        <DialogFooter>
          <Button
            variant="outline"
            className="h-11 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            className="h-11 rounded-xl"
            style={{ backgroundColor: accent }}
            onClick={submit}
          >
            Request callback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl bg-surface-2 px-3.5 py-3 text-xs leading-5 text-muted-foreground">
      {children}
    </p>
  );
}

const ELIGIBILITY: Record<string, string[]> = {
  loans: ["Business running for 6+ months", "Monthly sales records", "Valid business address"],
  capital: ["Active selling history", "Order volume in the last 3 months", "No default on existing credit"],
  equipment: ["Quotation for the equipment", "Supplier invoice or estimate", "Proof of business registration"],
  services: ["Registered mobile number", "Bank account in business name", "Delivery coverage area"],
};

/** Pre-application checklist used by the Seller finance cards. */
export function EligibilityDialog({
  open,
  onOpenChange,
  productKey,
  title,
  accent = "#00897B",
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  productKey: string;
  title: string;
  accent?: string;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const checklist = ELIGIBILITY[productKey] ?? ELIGIBILITY.loans;
  const done = checklist.filter((item) => checked[item]).length;
  const ready = done === checklist.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Check eligibility · {title}</DialogTitle>
          <DialogDescription>
            Tick what you already have. Everything checked means you can start an
            application.
          </DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-2">
          {checklist.map((item) => (
            <li key={item}>
              <button
                type="button"
                aria-pressed={checked[item] ?? false}
                onClick={() =>
                  setChecked((prev) => ({ ...prev, [item]: !prev[item] }))
                }
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 text-left text-sm transition-colors hover:border-primary/40"
              >
                <span
                  className="flex size-5 shrink-0 items-center justify-center rounded-md border"
                  style={
                    checked[item]
                      ? { backgroundColor: accent, borderColor: accent }
                      : undefined
                  }
                >
                  {checked[item] ? <span className="size-1.5 rounded-full bg-white" /> : null}
                </span>
                {item}
              </button>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          {done} of {checklist.length} ready
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            className="h-11 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            className="h-11 rounded-xl"
            style={{ backgroundColor: accent }}
            disabled={!ready}
            onClick={() => {
              toast.success("Application started — an advisor will contact you.");
              setChecked({});
              onOpenChange(false);
            }}
          >
            Start application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Invite or message a collaborator from the Scientist workspace. */
export function InviteDialog({
  open,
  onOpenChange,
  title,
  description,
  accent = "#5E35B1",
  actionLabel = "Send invite",
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  title: string;
  description: string;
  accent?: string;
  actionLabel?: string;
}) {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const submit = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      toast.error("Enter a valid email address.");
      return;
    }
    toast.success(`${actionLabel} sent to ${email.trim()}`);
    setEmail("");
    setNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-1">
          <label className="flex flex-col gap-1.5">
            <Label className="text-[13px] font-medium">Email</Label>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              inputMode="email"
              placeholder="researcher@institute.org"
              className="h-11 rounded-xl"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <Label className="text-[13px] font-medium">Message (optional)</Label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="What would you like to work on?"
              className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </label>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="h-11 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="h-11 rounded-xl" style={{ backgroundColor: accent }} onClick={submit}>
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Detail view for a saved library resource, with a copyable citation. */
export function ResourceDialog({
  open,
  onOpenChange,
  resource,
  accent = "#5E35B1",
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  resource: {
    title: string;
    category: string;
    source: string;
    year: string;
    type: string;
  } | null;
  accent?: string;
}) {
  if (!resource) return null;

  const citation = `${resource.title}. ${resource.source}, ${resource.year}. ${resource.category}.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>{resource.title}</DialogTitle>
          <DialogDescription>
            {resource.type} · {resource.source} · {resource.year} · {resource.category}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-1">
          <InfoNote>
            This is sample library metadata written for the prototype. Connect a real
            index before citing anything.
          </InfoNote>
          <label className="flex flex-col gap-1.5">
            <Label className="text-[13px] font-medium">Citation</Label>
            <textarea
              readOnly
              value={citation}
              rows={3}
              className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-3 text-sm text-muted-foreground"
            />
          </label>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="h-11 rounded-xl"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(citation);
                toast.success("Citation copied");
              } catch {
                toast.error("Couldn't copy — select the text manually.");
              }
            }}
          >
            Copy citation
          </Button>
          <Button
            className="h-11 rounded-xl"
            style={{ backgroundColor: accent }}
            onClick={() => {
              toast.success("Saved to your reading list");
              onOpenChange(false);
            }}
          >
            Add to reading list
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
