import { AppShell } from "@/components/app-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Camera,
  History,
  LifeBuoy,
  Mail,
  MessageCircleQuestion,
  ScanLine,
} from "lucide-react";
import { Link } from "react-router";

const QUICK_LINKS = [
  {
    icon: Camera,
    title: "Run a plant check",
    body: "Scan or upload a photo and get a confidence-scored reading.",
    to: "/scan",
    cta: "Check a plant",
  },
  {
    icon: History,
    title: "Review your history",
    body: "Every saved result is kept so you can compare over time.",
    to: "/history",
    cta: "Open history",
  },
];

const FAQS = [
  {
    q: "How accurate is the detection?",
    a: "Results are AI-assisted and shown with a confidence score. The prototype model is designed to highlight likely problems, not to replace a qualified agronomist — always confirm critical decisions locally.",
  },
  {
    q: "Why did I get a 'needs better image' result?",
    a: "Blur, shadows or a busy background make it hard to read leaf detail. Retake the photo in even daylight, hold steady, and let the affected leaf fill most of the frame.",
  },
  {
    q: "How do I change my password?",
    a: "Open Settings → Account security → Change password. We email you a 6-digit code to verify it's you before you set a new password.",
  },
  {
    q: "How are orders recorded?",
    a: "Nurseries record a sale from a product listing (or the Orders page). The order starts as 'New', and you can move it through Confirmed, Delivered or Cancelled.",
  },
  {
    q: "Can I use PlantGuard AI in my language?",
    a: "Yes. Pick your language during setup, or change it any time from Settings or your profile.",
  },
];

export default function Help() {
  return (
    <AppShell
      active="help"
      title="Help & support centre"
      subtitle="Guides, answers and a way to reach us."
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <div
                key={link.title}
                className="flex flex-col rounded-2xl border border-border bg-card p-5"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-foreground">
                  {link.title}
                </h3>
                <p className="mt-1 flex-1 text-sm leading-6 text-muted-foreground">
                  {link.body}
                </p>
                <Button asChild variant="outline" className="mt-4 h-10 w-fit rounded-xl">
                  <Link to={link.to}>
                    <ScanLine className="size-4" />
                    {link.cta}
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>

        <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
              <MessageCircleQuestion className="size-5" />
            </span>
            <h2 className="text-lg font-semibold tracking-[-0.01em] text-foreground">
              Frequently asked questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-3">
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.q} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-[15px] font-medium text-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-6 text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="flex flex-col items-start gap-4 rounded-3xl bg-linear-to-br from-[#17351C] to-[#1B5E20] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#A5D6A7]">
              <LifeBuoy className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-[-0.01em] text-white">
                Still need a hand?
              </h2>
              <p className="mt-1 max-w-md text-sm leading-6 text-white/70">
                Our team can help with your account, plant checks and nursery
                listings.
              </p>
            </div>
          </div>
          <a
            href="mailto:support@plantguard.ai"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-[#1B5E20] transition-colors hover:bg-[#E8F5E9]"
          >
            <Mail className="size-5" />
            Contact support
          </a>
        </section>
      </div>
    </AppShell>
  );
}
