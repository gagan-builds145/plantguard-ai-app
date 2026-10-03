import { RolePage } from "@/components/role-ui";
import { Chip, DemoTag, Panel, Photo, SectionHead, StatusPill } from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useFarmerProfile } from "@/hooks/use-farmer";
import { useLocalState } from "@/hooks/use-local-state";
import { IMG } from "@/lib/role-data";
import { isNewRole, ROLE_META, SHELL_SECONDARY_NAV } from "@/lib/roles";
import {
  Bookmark,
  Camera,
  Heart,
  History,
  ImagePlus,
  MessageCircle,
  ScanLine,
  Share2,
  Sprout,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

type Post = {
  id: string;
  author: string;
  role: string;
  text: string;
  image?: string;
  likes: number;
  comments: number;
};

const SEED_POSTS: Post[] = [
  {
    id: "p1",
    author: "Ananya Rao",
    role: "Home Grower",
    text: "Moved my monstera out of direct afternoon sun and the new leaf came in within a week. Sharing in case someone else is fighting leaf scorch.",
    image: IMG.monstera,
    likes: 42,
    comments: 8,
  },
  {
    id: "p2",
    author: "Ravi Kumar",
    role: "Farmer",
    text: "Scanned two tomato blocks this morning at first light — early blight showing on the lower leaves in one block only. Spraying that block today.",
    image: IMG.tomatoes,
    likes: 27,
    comments: 5,
  },
  {
    id: "p3",
    author: "Meera Iyer",
    role: "Seller",
    text: "Restocked cocopeat and vermicompost after the weekend rush. Two more categories go live on the marketplace next week.",
    likes: 18,
    comments: 3,
  },
  {
    id: "p4",
    author: "Suresh Patil",
    role: "Farmer",
    text: "Tractor booked for deep ploughing on Thursday morning. Sharing the field layout in case anyone needs a ride to the mandi the same day.",
    image: IMG.field,
    likes: 12,
    comments: 6,
  },
];

/** The feed is shared by every role; only the accent and framing change. */
const FEED_ACCENTS: Record<string, { accent: string; title: string; subtitle: string }> = {
  farmer: {
    accent: "#2E7D32",
    title: "Community Feed",
    subtitle: "Field updates, disease sightings and practical advice from other growers.",
  },
  nursery: {
    accent: "#2E7D32",
    title: "Community Feed",
    subtitle: "Stock photos, buyer questions and growing notes from other nurseries.",
  },
  home_grower: {
    accent: "#43A047",
    title: "Plant Community",
    subtitle: "Share your plants, ask questions and learn from other home growers.",
  },
  seller: {
    accent: "#00897B",
    title: "Seller Community",
    subtitle: "Trade talk, stock tips and supplier recommendations from other sellers.",
  },
  vehicle_owner: {
    accent: "#1565C0",
    title: "Driver Community",
    subtitle: "Road conditions, service requests and tips from other vehicle owners.",
  },
  labour: {
    accent: "#EF6C00",
    title: "Worker Community",
    subtitle: "Work availability, wages agreed locally and equipment tips.",
  },
  scientist: {
    accent: "#5E35B1",
    title: "Research Community",
    subtitle: "Findings, dataset notes and questions from other researchers.",
  },
};

export function SharedFeed() {
  const { profile } = useFarmerProfile();
  const { user } = useAuth();
  const role = profile?.role ?? "farmer";
  const accent = (isNewRole(role) ? ROLE_META[role].accent : "#2E7D32") || "#2E7D32";
  const copy = FEED_ACCENTS[role] ?? FEED_ACCENTS.farmer;

  const [posts, setPosts] = useLocalState<Post[]>("feed:posts", SEED_POSTS);
  const [liked, setLiked] = useLocalState<string[]>("feed:liked", []);
  const [saved, setSaved] = useLocalState<string[]>("feed:saved", []);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<string>("");

  const ATTACHMENTS = [IMG.tomatoes, IMG.field, IMG.monstera];

  const author = profile?.displayName ?? user?.name ?? "You";
  const roleLabel = isNewRole(role)
    ? ROLE_META[role].label
    : role === "nursery"
      ? "Nursery"
      : "Farmer";

  const quickLinks = isNewRole(role)
    ? ROLE_META[role].desktopNav.filter((item) => item.key !== "feed").slice(0, 4)
    : [
        { key: "scan", label: "Check plant", to: "/scan", icon: ScanLine },
        { key: "services", label: "Services", to: "/services", icon: Sprout },
        { key: "history", label: "History", to: "/history", icon: History },
        { key: "profile", label: "Profile", to: "/profile", icon: UserRound },
      ];

  const publish = () => {
    if (!draft.trim()) {
      toast.error("Write something before posting.");
      return;
    }
    setPosts((prev) => [
      {
        id: `p-${Date.now()}`,
        author,
        role: roleLabel,
        text: draft.trim(),
        image: attachment || undefined,
        likes: 0,
        comments: 0,
      },
      ...prev,
    ]);
    setDraft("");
    setAttachment("");
    toast.success("Posted to the community feed");
  };

  const attachNext = () => {
    const current = ATTACHMENTS.indexOf(attachment);
    setAttachment(ATTACHMENTS[(current + 1) % ATTACHMENTS.length]);
  };

  const toggleLike = (id: string) =>
    setLiked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const toggleSave = (id: string) => {
    const wasSaved = saved.includes(id);
    setSaved((prev) => (wasSaved ? prev.filter((item) => item !== id) : [...prev, id]));
    toast.success(wasSaved ? "Removed from saved" : "Saved for later");
  };

  const share = async (post: Post) => {
    const text = `${post.author} on PlantGuard AI: ${post.text}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "PlantGuard AI", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      toast.success("Post copied to clipboard");
    } catch {
      toast("Sharing cancelled");
    }
  };

  return (
    <RolePage role={isNewRole(role) ? role : "home_grower"} active="feed" title={copy.title} subtitle={copy.subtitle} action={<DemoTag />}>
      <Panel className="flex flex-col gap-4">
        <SectionHead title="Share an update" subtitle={`Posting as ${author} · ${roleLabel}`} />
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder="Ask a question, share a photo or post an update"
          aria-label="Write a post"
          className="w-full rounded-xl border border-[#EAF0EA] bg-surface-2 px-3.5 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button className="h-11 gap-2 rounded-xl" style={{ backgroundColor: accent }} onClick={publish}>
            <Sprout className="size-4" />
            Post
          </Button>
          <Button
            variant="outline"
            className="h-11 gap-2 rounded-xl"
            onClick={() => {
              attachNext();
              toast.success("Camera photo attached");
            }}
          >
            <Camera className="size-4" />
            Camera
          </Button>
          <Button
            variant="outline"
            className="h-11 gap-2 rounded-xl"
            onClick={() => {
              attachNext();
              toast.success("Gallery image attached");
            }}
          >
            <ImagePlus className="size-4" />
            Gallery
          </Button>
          {attachment ? (
            <span className="flex items-center gap-2 rounded-xl bg-surface-2 px-2.5 py-1.5">
              <img src={attachment} alt="" className="size-8 rounded-lg object-cover" />
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-lg px-2 text-[13px]"
                onClick={() => setAttachment("")}
              >
                Remove
              </Button>
            </span>
          ) : null}
        </div>
      </Panel>

      <section>
        <SectionHead title="Latest posts" subtitle={`${posts.length} in your community`} />
        <div className="mt-4 flex flex-col gap-3">
          {posts.map((post) => {
            const isLiked = liked.includes(post.id);
            const isSaved = saved.includes(post.id);
            return (
              <Panel key={post.id} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{post.role}</p>
                  </div>
                  <StatusPill label={post.role === "Home Grower" ? "Community" : post.role} tone="gray" />
                </div>

                {post.image ? <Photo src={post.image} alt="" ratio="aspect-[16/9]" /> : null}

                <p className="text-[13px] leading-6 text-foreground">{post.text}</p>

                <div className="flex flex-wrap items-center gap-2">
                  <Chip
                    label={`${post.likes + (isLiked ? 1 : 0)}`}
                    icon={Heart}
                    selected={isLiked}
                    onClick={() => toggleLike(post.id)}
                  />
                  <Chip label={`${post.comments}`} icon={MessageCircle} />
                  <Chip
                    label={isSaved ? "Saved" : "Save"}
                    icon={Bookmark}
                    selected={isSaved}
                    onClick={() => toggleSave(post.id)}
                  />
                  <Button variant="ghost" size="sm" className="h-10 gap-2 rounded-xl" onClick={() => share(post)}>
                    <Share2 className="size-3.5" />
                    Share
                  </Button>
                </div>
              </Panel>
            );
          })}
        </div>
      </section>

      <Panel>
        <SectionHead
          title="Community spaces"
          subtitle="Jump into the tools people in your role use most"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          {quickLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#EAF0EA] bg-card px-4 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              <item.icon className="size-4" style={{ color: accent }} />
              {item.label}
            </Link>
          ))}
          {SHELL_SECONDARY_NAV.slice(0, 2).map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#EAF0EA] bg-card px-4 text-[13px] font-semibold text-foreground transition-colors hover:border-primary/40"
            >
              <item.icon className="size-4" style={{ color: accent }} />
              {item.label}
            </Link>
          ))}
        </div>
      </Panel>
    </RolePage>
  );
}

export default SharedFeed;
