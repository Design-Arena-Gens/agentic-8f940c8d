import clsx from "clsx";
import { Prospect } from "../lib/types";

type ProspectListProps = {
  prospects: Prospect[];
  activeId?: string;
  onSelect: (prospect: Prospect) => void;
};

export function ProspectList({ prospects, activeId, onSelect }: ProspectListProps) {
  return (
    <div className="grid prospect-grid">
      {prospects.map((prospect) => (
        <article
          key={prospect.id}
          className={clsx("prospect-card", activeId === prospect.id && "active")}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(prospect)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onSelect(prospect);
            }
          }}
        >
          <div className="prospect-card-header">
            <div>
              <h3>{prospect.name}</h3>
              <div className="prospect-meta">
                <span>{prospect.role}</span>
                <span>{prospect.company}</span>
              </div>
            </div>
            <div className="prospect-meta" style={{ textAlign: "right" }}>
              <span>{prospect.revenueRange}</span>
              <span>{prospect.headquarters}</span>
            </div>
          </div>
          <div className="prospect-meta">
            <span>
              Latest: <strong>{prospect.recentCampaign.title}</strong>
            </span>
            <a className="campaign-link" href={prospect.recentCampaign.link} target="_blank">
              View campaign
            </a>
          </div>
          <div className="action-bar">
            {prospect.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
