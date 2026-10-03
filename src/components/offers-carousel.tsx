import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { Offer } from "@/lib/plantguard-data";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronLeft, ChevronRight, Flower2 } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Photo header for an offer card. Falls back to a themed brand banner if the
 * photo can't load, so the card never renders broken.
 */
function OfferImage({ offer }: { offer: Offer }) {
  const [failed, setFailed] = useState(false);
  const Icon = offer.icon;

  if (failed) {
    return (
      <div className="relative flex h-36 w-full items-center justify-center bg-linear-to-br from-[#1B5E20] to-[#2E7D32]">
        <Icon className="size-10 text-white/90" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          <Flower2 className="size-3" />
          {offer.category}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-36 w-full overflow-hidden bg-surface-3">
      <img
        src={offer.image}
        alt={offer.title}
        loading="lazy"
        onError={() => setFailed(true)}
        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
        {offer.category}
      </span>
    </div>
  );
}

/**
 * Auto-playing, swipeable offers carousel. Used by both the farmer and nursery
 * dashboards with different offer sets.
 */
export function OffersCarousel({
  offers,
  title,
  subtitle,
  headingId = "offers-heading",
}: {
  offers: Offer[];
  title: string;
  subtitle?: string;
  headingId?: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused) return;
    const timer = window.setInterval(() => {
      api.scrollNext();
    }, 5200);
    return () => window.clearInterval(timer);
  }, [api, paused]);

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2
            id={headingId}
            className="text-lg font-semibold tracking-[-0.01em] text-foreground"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <div className="hidden gap-2 lg:flex">
          <Button
            size="icon"
            variant="outline"
            className="size-9 rounded-full"
            aria-label="Previous offer"
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-9 rounded-full"
            aria-label="Next offer"
            onClick={() => api?.scrollNext()}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        <Carousel setApi={setApi} opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {offers.map((offer) => (
              <CarouselItem
                key={offer.key}
                className="basis-[85%] sm:basis-[60%] lg:basis-1/3"
              >
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_3px_rgba(20,40,20,0.06)]">
                  <OfferImage offer={offer} />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-[15px] font-semibold text-foreground">
                      {offer.title}
                    </h3>
                    <p className="mt-1.5 flex-1 text-sm leading-6 text-muted-foreground">
                      {offer.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      {offer.cta}
                      <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {offers.map((offer, index) => (
          <span
            key={offer.key}
            aria-hidden
            className={cn(
              "h-1.5 rounded-full transition-all",
              index === selected ? "w-5 bg-primary" : "w-1.5 bg-border",
            )}
          />
        ))}
      </div>
    </section>
  );
}
