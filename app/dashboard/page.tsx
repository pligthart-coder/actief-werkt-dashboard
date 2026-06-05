"use client";

import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

const OWNER: Record<string, string> = {
  "Carerix": "car",
  "Actief Werkt!": "actw",
  "Teal": "teal",
  "Freshheads": "fh",
  "Stuurgroep": "sg",
  "Allen": "all",
};

const ICON: Record<string, string> = {
  mig: "⤓",
  check: "☎",
  valid: "✓",
  mile: "★",
  gng: "◆",
  step: "•",
};

interface ChecklistItem {
  t: string;
  type: string;
  owner: string;
  title: string;
  sub?: string;
}

interface Day {
  id: string;
  label: string;
  phase: string;
  items: ChecklistItem[];
}

const DAYS: Day[] = [
  {
    id: "do",
    label: "Donderdag 18 juni",
    phase: "Fase A · Freeze & afsluiting bronsysteem",
    items: [
      {
        t: "12:00",
        type: "mig",
        owner: "Carerix",
        title: "Triggers & automations uitschakelen in Carerix",
        sub: "Voorkomt ongewenste acties tijdens de import",
      },
      {
        t: "12:00",
        type: "step",
        owner: "Actief Werkt!",
        title: "SSO Carerix uitschakelen — inloggen geblokkeerd",
        sub: "Geen gebruikerstoegang tijdens migratie",
      },
      {
        t: "12:00–18:00",
        type: "step",
        owner: "Carerix",
        title: "Archiveren & opschonen data actiefwerkt.carerix.net",
        sub: "Schone productieomgeving vóór de import",
      },
      {
        t: "17:00",
        type: "mile",
        owner: "Actief Werkt!",
        title: "Cockpit blokkeren — START go-live-proces",
        sub: "Bron bevroren; geen mutaties meer in Cockpit",
      },
      {
        t: "17:00",
        type: "check",
        owner: "Allen",
        title: "Start-cutover call (±15 min)",
        sub: "Bevestig de GO om Cockpit te blokkeren en de export te starten",
      },
      {
        t: "17:00 → vr 09:00",
        type: "mig",
        owner: "Teal",
        title: "Definitieve data-export via API uit Cockpit",
        sub: "Levert de finale dataset op vrijdag 09:00",
      },
    ],
  },
  {
    id: "vr",
    label: "Vrijdag 19 juni",
    phase: "Fase B · Productiemigratie (dag 1)",
    items: [
      {
        t: "09:00",
        type: "check",
        owner: "Allen",
        title: "Ochtendcall — stand-up",
        sub: "Finale dataset ontvangen? Dagplanning en blokkades benoemen",
      },
      {
        t: "09:00",
        type: "mig",
        owner: "Teal",
        title: "Aanlevering finale dataset",
        sub: "Trigger voor de imports",
      },
      {
        t: "09:30–17:00",
        type: "mig",
        owner: "Carerix",
        title: "Import kandidaten",
        sub: "Formele oplevering per e-mail (17:00)",
      },
      {
        t: "09:30–17:00",
        type: "mig",
        owner: "Carerix",
        title: "Import bedrijven (opdrachtgevers)",
        sub: "Formele oplevering per e-mail (17:00)",
      },
      {
        t: "17:00",
        type: "check",
        owner: "Allen",
        title: "Eindedagcall — close",
        sub: "Opleveringen valideren, openstaande issues, vooruitblik",
      },
      {
        t: "17:00–19:00",
        type: "valid",
        owner: "Actief Werkt!",
        title: "Validatie kandidaten + bedrijven (binnen 2 uur)",
        sub: "Feedback op tab 'feedback PROD migration': gebruiker, entiteit, omschrijving, ≥ 2 voorbeelden incl. CX-nummer",
      },
      {
        t: "17:00 → za 10:00",
        type: "mig",
        owner: "Carerix",
        title: "Import contactpersonen",
        sub: "Formele oplevering per e-mail (zaterdag 10:00)",
      },
    ],
  },
  {
    id: "za",
    label: "Zaterdag 20 juni",
    phase: "Fase B · Productiemigratie (dag 2)",
    items: [
      {
        t: "09:00",
        type: "check",
        owner: "Allen",
        title: "Ochtendcall — stand-up",
        sub: "Status van de nacht, dagplanning",
      },
      {
        t: "10:00–12:00",
        type: "valid",
        owner: "Actief Werkt!",
        title: "Validatie contactpersonen (binnen 2 uur)",
        sub: "Feedback op de feedback-tab",
      },
      {
        t: "10:00–18:00",
        type: "mig",
        owner: "Carerix",
        title: "Import vacatures (joborders)",
        sub: "Formele oplevering per e-mail (18:00)",
      },
      {
        t: "10:00 → zo 12:00",
        type: "mig",
        owner: "Carerix",
        title: "Import taken",
        sub: "Gebundeld in één notitieveld per entiteit (oplevering zondag 12:00)",
      },
      {
        t: "10:00 → zo 15:00",
        type: "mig",
        owner: "Carerix",
        title: "Import kandidaat-cv's & bijlagen",
        sub: "Bijlagen volledig overgenomen (oplevering zondag 15:00)",
      },
      {
        t: "17:00",
        type: "check",
        owner: "Allen",
        title: "Eindedagcall — close",
        sub: "Dagresultaten, openstaande issues, vooruitblik zondag",
      },
      {
        t: "18:00 → zo 12:00",
        type: "mig",
        owner: "Carerix",
        title: "Import matches",
        sub: "Oplevering zondag 12:00",
      },
      {
        t: "18:00 → zo 12:00",
        type: "mig",
        owner: "Carerix",
        title: "Import publicaties",
        sub: "Basis voor publicatie-activatie op maandag (oplevering zondag 12:00)",
      },
    ],
  },
  {
    id: "zo",
    label: "Zondag 21 juni",
    phase: "Fase B/C · Afronding migratie & synchronisatie",
    items: [
      {
        t: "09:00",
        type: "check",
        owner: "Allen",
        title: "Ochtendcall — stand-up",
        sub: "Laatste imports, plan richting Go/No-Go",
      },
      {
        t: "09:00–17:00",
        type: "mig",
        owner: "Teal",
        title: "Import bijlagen via Teal",
        sub: "Aanvullende bijlagen (oplevering 17:00)",
      },
      {
        t: "12:00–14:00",
        type: "valid",
        owner: "Actief Werkt!",
        title: "Validatie vacatures, taken, matches & publicaties (binnen 2 uur)",
        sub: "Feedback op de feedback-tab",
      },
      {
        t: "15:00–17:00",
        type: "valid",
        owner: "Actief Werkt!",
        title: "Validatie kandidaat-cv's & bijlagen (binnen 2 uur)",
        sub: "Feedback op de feedback-tab",
      },
      {
        t: "17:00",
        type: "check",
        owner: "Allen",
        title: "Eindedagcall — eindcontrole migratie",
        sub: "Formeel akkoord op de migratie voorbereiden",
      },
      {
        t: "17:00",
        type: "step",
        owner: "Actief Werkt!",
        title: "Formeel akkoord migratie aan Teal",
        sub: "Voorwaarde om de synchronisatie te mogen starten",
      },
      {
        t: "17:00–22:00",
        type: "mig",
        owner: "Teal",
        title: "Start synchronisatie Teal",
        sub: "Start pas ná het formele akkoord van Actief Werkt!",
      },
      {
        t: "±21:00",
        type: "gng",
        owner: "Stuurgroep",
        title: "Go/No-Go-besluit (voorlopig)",
        sub: "Koers bepalen; definitieve bevestiging maandag 07:00",
      },
    ],
  },
  {
    id: "ma",
    label: "Maandag 22 juni",
    phase: "Fase C · Go-live & vrijgave",
    items: [
      {
        t: "07:00",
        type: "gng",
        owner: "Stuurgroep",
        title: "Definitief Go/No-Go bevestigen",
        sub: "Laatste moment voor rollback: 07:30",
      },
      {
        t: "07:30–08:00",
        type: "step",
        owner: "Actief Werkt!",
        title: "SSO + accounts + triggers/automations activeren",
        sub: "Toegang en automatisering weer aan",
      },
      {
        t: "08:00–08:30",
        type: "step",
        owner: "Freshheads",
        title: "Website omzetten Cockpit → Carerix",
        sub: "Vacatures en sollicitaties verlopen via Carerix",
      },
      {
        t: "08:30",
        type: "mile",
        owner: "Actief Werkt!",
        title: "Organisatie informeren: GO — Carerix vrijgegeven",
        sub: "EINDE go-live-proces · eindgebruikers mogen starten in Carerix",
      },
      {
        t: "08:30–17:00",
        type: "step",
        owner: "Allen",
        title: "Alle geïmporteerde publicaties controleren & activeren",
        sub: "Elke consultant — vacatures weer live",
      },
    ],
  },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { data: checklistState, error } = useSWR<Record<string, boolean>>(
    "/api/checklist",
    fetcher,
    {
      refreshInterval: 5000,
    }
  );


  const toggleDay = (dayId: string) => {
    setCollapsed((prev) => ({ ...prev, [dayId]: !prev[dayId] }));
  };

  const toggleItem = async (itemId: string) => {
    const newState = !checklistState?.[itemId];

    mutate(
      "/api/checklist",
      { ...checklistState, [itemId]: newState },
      false
    );

    try {
      await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, completed: newState }),
      });
      mutate("/api/checklist");
    } catch (error) {
      console.error("Error updating checklist:", error);
      mutate("/api/checklist");
    }
  };

  const totalItems = DAYS.reduce((n, d) => n + d.items.length, 0);
  const doneCount = checklistState
    ? Object.values(checklistState).filter(Boolean).length
    : 0;
  const progress = totalItems ? Math.round((doneCount / totalItems) * 100) : 0;

  const getDayCount = (day: Day) => {
    return day.items.reduce((n, _, ii) => {
      const itemId = `${day.id}-${ii}`;
      return n + (checklistState?.[itemId] ? 1 : 0);
    }, 0);
  };

  const handleReset = async () => {
    if (!confirm("Alle vinkjes wissen?")) return;

    const emptyState: Record<string, boolean> = {};
    mutate("/api/checklist", emptyState, false);

    try {
      for (const day of DAYS) {
        for (let i = 0; i < day.items.length; i++) {
          const itemId = `${day.id}-${i}`;
          await fetch("/api/checklist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId, completed: false }),
          });
        }
      }
      mutate("/api/checklist");
    } catch (error) {
      console.error("Error resetting checklist:", error);
      mutate("/api/checklist");
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3f9]">
      <style jsx global>{`
        :root {
          --blue: #0149b6;
          --blue2: #008cd6;
          --orange: #ff8900;
          --green: #0eba6a;
          --ink: #172033;
          --muted: #5b6779;
          --faint: #8a94a6;
          --line: #e4eaf3;
          --page: #eef3f9;
          --card: #ffffff;
          --bandblue: #eef4ff;
          --bandgreen: #ecfaf2;
          --bandamber: #fff4e6;
          --bandmile: #e6f0ff;
        }

        .ic {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          display: inline-grid;
          place-items: center;
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }
        .ic.mig {
          background: var(--blue2);
        }
        .ic.check {
          background: var(--blue);
        }
        .ic.valid {
          background: var(--green);
        }
        .ic.mile {
          background: var(--blue);
        }
        .ic.gng {
          background: var(--orange);
        }
        .ic.step {
          background: #aeb8c7;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 99px;
          line-height: 1.6;
          white-space: nowrap;
        }
        .chip::before {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 99px;
          background: var(--c);
        }
        .chip {
          color: var(--c);
          background: color-mix(in srgb, var(--c) 11%, #fff);
          border: 1px solid color-mix(in srgb, var(--c) 26%, #fff);
        }
        .car {
          --c: #0149b6;
        }
        .actw {
          --c: #0e9e63;
        }
        .teal {
          --c: #6b4fbb;
        }
        .fh {
          --c: #e07a00;
        }
        .sg {
          --c: #334155;
        }
        .all {
          --c: #647387;
        }

        .row {
          border-left: 4px solid transparent;
        }
        .row.mig {
          border-left-color: #bcd6f3;
        }
        .row.step {
          border-left-color: #e1e7f0;
        }
        .row.check {
          background: var(--bandblue);
          border-left-color: var(--blue);
        }
        .row.check:hover {
          background: #e6f0ff;
        }
        .row.valid {
          background: var(--bandgreen);
          border-left-color: var(--green);
        }
        .row.valid:hover {
          background: #e2f6ec;
        }
        .row.mile {
          background: var(--bandmile);
          border-left: 5px solid var(--blue);
        }
        .row.mile:hover {
          background: #dcebff;
        }
        .row.gng {
          background: var(--bandamber);
          border-left: 5px solid var(--orange);
        }
        .row.gng:hover {
          background: #ffedd6;
        }
        .row.done {
          opacity: 0.72;
        }
        .row.done .title {
          color: var(--faint);
          text-decoration: line-through;
          text-decoration-color: #c4cedd;
        }
      `}</style>

      <div className="sticky top-0 z-30 bg-gradient-to-r from-[#013c98] via-[#0149b6] to-[#0a5fd0] text-white shadow-lg">
        <div className="max-w-[960px] mx-auto px-4 py-4 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-[34px] w-px bg-white/30"></div>
            <div>
              <h1 className="font-bold text-[19px] leading-tight tracking-wide">
                Go-live checklist — Actief Werkt!
              </h1>
              <p className="text-[12.5px] text-white/80 font-medium mt-0.5">
                Uur-tot-uur · do 18 juni → ma 22 juni 2026 · cutover, migratie
                & check-ins
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3.5 flex-wrap">
            <div className="min-w-[190px]">
              <div className="flex justify-between text-xs text-white/90 mb-1.5 font-semibold">
                <span>Voortgang</span>
                <span>
                  {doneCount} / {totalItems}
                </span>
              </div>
              <div className="h-2 bg-white/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 text-xs font-semibold bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition"
              >
                Print
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-semibold bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xs font-bold tracking-[0.13em] uppercase text-[#0149b6] mb-1.5">
            Hoe te gebruiken
          </h2>
          <p className="text-[13.5px] text-[#5b6779] max-w-[680px]">
            Loop de stappen per dag van boven naar beneden af en vink elke stap
            af zodra die klaar is. De blauwe balken zijn de{" "}
            <strong>check-in calls</strong>, de groene balken de{" "}
            <strong>validatievensters</strong> van Actief Werkt! (binnen 2 uur
            na elke oplevering), de oranje balken de{" "}
            <strong>Go/No-Go-momenten</strong> en de donkerblauwe balken de{" "}
            <strong>mijlpalen</strong> (start & vrijgave). Dit is een
            operationeel hulpmiddel naast het go-live draaiboek.
          </p>
        </div>

        <div className="bg-white border border-[#e4eaf3] rounded-xl p-3.5 shadow-sm mb-6">
          <div className="flex gap-4 flex-wrap text-sm">
            <div className="flex gap-2.5 flex-wrap items-center">
              <span className="text-[11px] uppercase tracking-wider text-[#8a94a6] mr-0.5">
                Type
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#5b6779] font-medium">
                <span className="ic mile">★</span>Mijlpaal
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#5b6779] font-medium">
                <span className="ic check">☎</span>Check-in / call
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#5b6779] font-medium">
                <span className="ic valid">✓</span>Validatie (&lt; 2 u)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#5b6779] font-medium">
                <span className="ic mig">⤓</span>Migratie
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#5b6779] font-medium">
                <span className="ic gng">◆</span>Go/No-Go
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#5b6779] font-medium">
                <span className="ic step">•</span>Actie
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {DAYS.map((day, di) => {
            const dayCount = getDayCount(day);
            const isDayDone = dayCount === day.items.length;

            return (
              <section
                key={day.id}
                className={`bg-white border border-[#e4eaf3] rounded-2xl shadow-sm overflow-hidden ${
                  collapsed[day.id] ? "collapsed" : ""
                }`}
              >
                <div
                  className="flex items-center gap-3.5 p-4 cursor-pointer select-none border-b border-[#e4eaf3] bg-gradient-to-b from-[#fbfdff] to-[#f4f8fd] hover:bg-[#f1f6fc] transition"
                  onClick={() => toggleDay(day.id)}
                >
                  <div className="flex-shrink-0 w-[34px] h-[34px] rounded-lg bg-[#0149b6] text-white font-bold text-[15px] flex items-center justify-center">
                    {di + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-[#172033]">
                      {day.label}
                    </h3>
                    <span className="block text-xs text-[#008cd6] font-semibold mt-0.5">
                      {day.phase}
                    </span>
                  </div>
                  <div
                    className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      isDayDone
                        ? "text-[#0a7d45] bg-[#e9f8f0] border-[#bfe8d2]"
                        : "text-[#5b6779] bg-[#eef3fa] border-[#e4eaf3]"
                    }`}
                  >
                    {dayCount} / {day.items.length}
                  </div>
                  <div
                    className={`flex-shrink-0 text-[#8a94a6] text-sm transition-transform ${
                      collapsed[day.id] ? "-rotate-90" : ""
                    }`}
                  >
                    ▼
                  </div>
                </div>

                {!collapsed[day.id] && (
                  <div className="py-1.5">
                    {day.items.map((item, ii) => {
                      const itemId = `${day.id}-${ii}`;
                      const isDone = checklistState?.[itemId] || false;
                      const ownerCls = OWNER[item.owner] || "all";

                      return (
                        <div
                          key={ii}
                          className={`row ${item.type} ${
                            isDone ? "done" : ""
                          } flex items-start gap-3 px-4 py-2.5 cursor-pointer transition hover:bg-[#f8fbff] ${
                            ii > 0 ? "border-t border-[#f0f4f9]" : ""
                          }`}
                          onClick={() => toggleItem(itemId)}
                        >
                          <div className="flex-shrink-0 w-[78px] text-xs font-semibold text-[#172033] pt-0.5 leading-tight">
                            {item.t}
                          </div>
                          <div className="flex-shrink-0 mt-0.5">
                            <span className={`ic ${item.type}`}>
                              {ICON[item.type]}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`title text-[14.5px] font-semibold text-[#172033] leading-snug ${
                                item.type === "mile" || item.type === "gng"
                                  ? "font-bold tracking-wide"
                                  : ""
                              } ${
                                item.type === "mile"
                                  ? "text-[#013c98]"
                                  : item.type === "gng"
                                  ? "text-[#b35900]"
                                  : ""
                              }`}
                            >
                              {item.title}
                            </div>
                            {item.sub && (
                              <div className="text-xs text-[#5b6779] mt-0.5 leading-relaxed">
                                {item.sub}
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0 flex items-center gap-2.5 pt-0.5">
                            <span className={`chip ${ownerCls}`}>
                              {item.owner}
                            </span>
                            <div
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                                isDone
                                  ? "bg-[#0149b6] border-[#0149b6]"
                                  : "bg-white border-[#c4cedd] hover:border-[#008cd6]"
                              }`}
                            >
                              {isDone && (
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="3.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-3.5 h-3.5"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <footer className="mt-6 text-center text-xs text-[#8a94a6]">
          Carerix-implementatie Actief Werkt! · go-live 22 juni 2026 · bron:
          detailplanning, tabblad 'Golive schedule'. Tijden zijn richttijden en
          worden in de dagelijkse calls bewaakt.
        </footer>
      </div>
    </div>
  );
}
