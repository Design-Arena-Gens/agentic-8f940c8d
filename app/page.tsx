"use client";

import { useEffect, useMemo, useState } from "react";
import { ProspectFilters } from "../components/ProspectFilters";
import { ProspectList } from "../components/ProspectList";
import { Toast } from "../components/Toast";
import { PROSPECTS, ProspectFilter, filterProspects } from "../lib/prospects";
import { buildOutreachPayload, generateFollowUpPlan } from "../lib/messages";
import { OutreachChannel, Prospect } from "../lib/types";

type LogPayload = {
  prospect: Prospect;
  channel: OutreachChannel;
  message: string;
};

async function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export default function Home() {
  const [filter, setFilter] = useState<ProspectFilter>({
    role: "",
    focus: "Ecommerce",
    search: ""
  });
  const [messagesToday, setMessagesToday] = useState(12);
  const [activeChannel, setActiveChannel] = useState<OutreachChannel>("linkedin");
  const [selected, setSelected] = useState<Prospect | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [draftMessages, setDraftMessages] = useState<{ linkedin: string; email: string }>({
    linkedin: "",
    email: ""
  });

  const filteredProspects = useMemo(
    () => filterProspects(PROSPECTS, filter),
    [filter]
  );

  useEffect(() => {
    if (!selected && filteredProspects.length) {
      setSelected(filteredProspects[0]);
    } else if (
      selected &&
      !filteredProspects.find((prospect) => prospect.id === selected.id) &&
      filteredProspects.length
    ) {
      setSelected(filteredProspects[0]);
    }
  }, [filteredProspects, selected]);

  const outreach = useMemo(() => {
    if (!selected) return null;
    return buildOutreachPayload(selected);
  }, [selected]);

  useEffect(() => {
    if (outreach) {
      setDraftMessages({
        linkedin: outreach.linkedin,
        email: outreach.email.body
      });
    }
  }, [outreach]);

  const followUpPlan = useMemo(() => {
    if (!selected) return [];
    return generateFollowUpPlan(selected);
  }, [selected]);

  const activeMessage = draftMessages[activeChannel] ?? "";
  const activeSubject = outreach && activeChannel === "email" ? outreach.email.subject : "";

  const remaining = Math.max(0, 30 - messagesToday);

  async function handleCopy(channel: OutreachChannel) {
    if (!selected) return;
    const payload = draftMessages[channel];
    await copyToClipboard(payload);
    setMessagesToday((count) => {
      const next = count + 1;
      setToast(
        `${channel === "email" ? "Email" : "LinkedIn DM"} copied — ${Math.max(0, 30 - next)} slots left`
      );
      return next;
    });
  }

  async function handleLog(channel: OutreachChannel) {
    if (!selected || !outreach) return;
    setSaving(true);
    const payload: LogPayload = {
      prospect: selected,
      channel,
      message: draftMessages[channel]
    };
    try {
      const response = await fetch("/api/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("Failed to sync outreach");
      }
      setToast("Logged to Notion + HubSpot queue");
    } catch (error) {
      console.error(error);
      setToast("Failed to sync — copy to manual tracker");
    } finally {
      setSaving(false);
    }
  }

  async function handleCalendarHold() {
    if (!selected) return;
    setSaving(true);
    try {
      const response = await fetch("/api/calendar-hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectId: selected.id })
      });
      if (!response.ok) {
        throw new Error("Failed to log calendar hold");
      }
      setToast("Sent calendar hold request");
    } catch (error) {
      console.error(error);
      setToast("Calendar hold failed — send manually");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="panel">
        <h2>Prospect Radar</h2>
        <ProspectFilters prospects={PROSPECTS} filter={filter} onChange={setFilter} />
      </section>

      <section className="panel">
        <h2>Qualified Targets</h2>
        <ProspectList
          prospects={filteredProspects}
          activeId={selected?.id}
          onSelect={(prospect) => setSelected(prospect)}
        />
      </section>

      {selected && outreach ? (
        <section className="panel">
          <h2>Outreach Command</h2>
          <div className="grid details-layout">
            <div className="prospect-meta" style={{ gap: "18px" }}>
              <div>
                <h3 style={{ marginBottom: "6px" }}>{selected.name}</h3>
                <div className="prospect-meta">
                  <span>
                    {selected.role} · {selected.company}
                  </span>
                  <span>
                    {selected.headquarters} · {selected.revenueRange}
                  </span>
                  <span>
                    Campaign:{" "}
                    <a className="campaign-link" href={selected.recentCampaign.link} target="_blank">
                      {selected.recentCampaign.title}
                    </a>
                  </span>
                </div>
              </div>
              <div className="status-bar">
                <span>{remaining} / 30 outreach slots left today</span>
                {selected.email && <span>Email: {selected.email}</span>}
                {selected.linkedinUrl && (
                  <span>
                    LinkedIn:{" "}
                    <a className="campaign-link" href={selected.linkedinUrl} target="_blank">
                      profile
                    </a>
                  </span>
                )}
              </div>

              <div className="action-bar">
                <button
                  className={`primary${activeChannel === "linkedin" ? " selected" : ""}`}
                  onClick={() => setActiveChannel("linkedin")}
                >
                  LinkedIn DM
                </button>
                <button
                  className={`secondary${activeChannel === "email" ? " selected" : ""}`}
                  onClick={() => setActiveChannel("email")}
                >
                  Email
                </button>
                <button className="secondary" onClick={() => handleCopy(activeChannel)}>
                  Copy {activeChannel === "email" ? "Email" : "DM"}
                </button>
                <button className="secondary" disabled={saving} onClick={() => handleLog(activeChannel)}>
                  Save to Notion + HubSpot
                </button>
                <button className="secondary" disabled={saving} onClick={handleCalendarHold}>
                  Book Call Hold
                </button>
              </div>
            </div>

            <div className="message-editor">
              {activeChannel === "email" && (
                <div className="message-meta">
                  <span>Subject: {activeSubject}</span>
                  <span>{selected.company}</span>
                </div>
              )}
              <textarea
                value={activeMessage}
                onChange={(event) =>
                  setDraftMessages((current) => ({
                    ...current,
                    [activeChannel]: event.target.value
                  }))
                }
              />
              <div className="message-meta">
                <span>2 line opener · 1 line value prop</span>
                <span>Price anchor withheld</span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {selected ? (
        <section className="panel">
          <h2>Follow-Up Plan</h2>
          <div className="followup-list">
            {followUpPlan.map((step, index) => (
              <div key={step.id} className="followup-step">
                <div>
                  <strong>
                    Day {step.delayDays}: {step.title}
                  </strong>
                  <p style={{ margin: "6px 0 0", color: "var(--muted)" }}>{step.description}</p>
                </div>
                <span className="tag">{step.channel}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {toast ? <Toast message={toast} onClose={() => setToast(null)} /> : null}
    </>
  );
}
