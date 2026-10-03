import {
  Chip,
  DemoTag,
  InfoNote,
  Panel,
  RolePage,
  SectionHead,
  StatTile,
} from "@/components/role-ui";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useFarmerProfile } from "@/hooks/use-farmer";
import {
  LABOUR_CROP_EXPERIENCE,
  LABOUR_EQUIPMENT,
  LABOUR_EXPERIENCE_LEVELS,
  LABOUR_SKILLS,
} from "@/lib/role-data";
import { useMutation } from "convex/react";
import { BadgeCheck, Hammer, Loader2, Sprout, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ACCENT = "#EF6C00";

export function LabourSkills() {
  const { profile } = useFarmerProfile();
  const saveProfile = useMutation(api.farmers.saveProfile);
  const [skills, setSkills] = useState<string[]>(profile?.skills ?? ["Weeding", "Harvesting"]);
  const [equipment, setEquipment] = useState<string[]>(profile?.equipment ?? ["Sprayer"]);
  const [experience, setExperience] = useState(profile?.experience ?? LABOUR_EXPERIENCE_LEVELS[1]);
  const [crops, setCrops] = useState<string[]>(["Vegetables", "Millets"]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.skills?.length) setSkills(profile.skills);
    if (profile?.equipment?.length) setEquipment(profile.equipment);
    if (profile?.experience) setExperience(profile.experience);
  }, [profile]);

  const toggle = (
    value: string,
    current: string[],
    setter: (next: string[]) => void,
  ) =>
    setter(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );

  const save = async () => {
    setSaving(true);
    try {
      await saveProfile({ skills, equipment, experience });
      toast.success("Skills profile updated");
    } catch {
      toast.error("We couldn't save that. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RolePage
      role="labour"
      active="skills"
      title="Skills & Experience"
      subtitle="Tell employers what you can do and which crops you know, so the right work reaches you."
      action={
        <Button
          className="h-11 gap-2 rounded-xl"
          disabled={saving}
          onClick={save}
          style={{ backgroundColor: ACCENT }}
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <BadgeCheck className="size-4" />}
          Save profile
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Skills"
          value={String(skills.length)}
          note="Selected"
          icon={Hammer}
          accent={ACCENT}
        />
        <StatTile
          label="Equipment"
          value={String(equipment.length)}
          note="You can use"
          icon={Wrench}
          accent={ACCENT}
        />
        <StatTile
          label="Experience"
          value={experience}
          note="Work experience"
          icon={BadgeCheck}
          accent={ACCENT}
        />
        <StatTile
          label="Crop types"
          value={String(crops.length)}
          note="Handled before"
          icon={Sprout}
          accent={ACCENT}
        />
      </div>

      <Panel>
        <SectionHead
          title="Your skills"
          subtitle="Pick everything you are comfortable being hired for"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {LABOUR_SKILLS.map((skill) => (
            <Chip
              key={skill}
              label={skill}
              selected={skills.includes(skill)}
              onClick={() => toggle(skill, skills, setSkills)}
            />
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionHead
            title="Equipment you can use"
            subtitle="Helps match you to work that needs machinery"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {LABOUR_EQUIPMENT.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={equipment.includes(item)}
                onClick={() => toggle(item, equipment, setEquipment)}
              />
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionHead title="Work experience" subtitle="Overall agricultural work experience" />
          <div className="mt-4 flex flex-wrap gap-2">
            {LABOUR_EXPERIENCE_LEVELS.map((level) => (
              <Chip
                key={level}
                label={level}
                selected={experience === level}
                onClick={() => setExperience(level)}
              />
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <SectionHead
          title="Crop experience"
          subtitle="Crops you've worked with — saved on this device for now"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {LABOUR_CROP_EXPERIENCE.map((crop) => (
            <Chip
              key={crop}
              label={crop}
              selected={crops.includes(crop)}
              onClick={() => toggle(crop, crops, setCrops)}
            />
          ))}
        </div>
        <div className="mt-4">
          <InfoNote>
            Skills, equipment and experience are saved to your PlantGuard profile. Crop
            experience is kept in this prototype only.
          </InfoNote>
        </div>
      </Panel>
    </RolePage>
  );
}

export default LabourSkills;
