import { useMemo } from "react";
import { Prospect } from "../lib/types";
import { ProspectFilter } from "../lib/prospects";

type ProspectFiltersProps = {
  prospects: Prospect[];
  filter: ProspectFilter;
  onChange: (filter: ProspectFilter) => void;
};

const ROLES = [
  "Creative Director",
  "Head of Content",
  "E-com Marketing Manager"
];

const FOCUSES: (Prospect["focus"] | "All")[] = ["All", "Ecommerce", "D2C", "Agency"];

export function ProspectFilters({ prospects, filter, onChange }: ProspectFiltersProps) {
  const allTags = useMemo(() => {
    const set = new Set<string>();
    prospects.forEach((prospect) => prospect.tags.forEach((tag) => set.add(tag)));
    return Array.from(set);
  }, [prospects]);

  return (
    <div className="filters">
      <select
        value={filter.role ?? ""}
        onChange={(event) => onChange({ ...filter, role: event.target.value || undefined })}
      >
        <option value="">Any role</option>
        {ROLES.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      <select
        value={filter.focus ?? "All"}
        onChange={(event) =>
          onChange({
            ...filter,
            focus: event.target.value as Prospect["focus"] | "All"
          })
        }
      >
        {FOCUSES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <input
        type="search"
        placeholder="Search name, company, campaign"
        value={filter.search ?? ""}
        onChange={(event) => onChange({ ...filter, search: event.target.value })}
      />

      <select
        value={filter.tags?.[0] ?? ""}
        onChange={(event) => {
          const nextTag = event.target.value;
          onChange({
            ...filter,
            tags: nextTag ? [nextTag] : []
          });
        }}
      >
        <option value="">Any tag</option>
        {allTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );
}
