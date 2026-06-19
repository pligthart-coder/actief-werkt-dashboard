"use client";

import { mutate } from "swr";

interface MigrationEntity {
  id: string;
  date: string;
  activity: string;
  startActivity: string;
  deliveryDate: string;
  expectedTime: string;
  processingTime: string | null;
  recordsInFile: number | null;
  dataImported: number | null;
  readyForTest: boolean;
  readyForTestDate: string | null;
  ok: boolean;
  okDate: string | null;
  notOk: boolean;
  notOkDate: string | null;
  approval: boolean;
  approvalDate: string | null;
  owner: string;
}

interface Props {
  entities: MigrationEntity[] | undefined;
}

export default function MigrationStatus({ entities }: Props) {
  const updateEntity = async (activity: string, field: string, value: any) => {
    try {
      await fetch("/api/migration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity, field, value }),
      });
      mutate("/api/migration");
    } catch (error) {
      console.error("Error updating entity:", error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!entities || entities.length === 0) {
    return (
      <div className="bg-white border border-[#e4eaf3] rounded-xl p-8 shadow-sm text-center">
        <p className="text-[#5b6779] mb-4">Geen migratie entiteiten gevonden.</p>
        <button
          onClick={async () => {
            const defaultEntities = [
              {
                date: "Friday 19-6",
                activity: "Import candidates",
                startActivity: "9:30",
                deliveryDate: "Saturday 20-6",
                expectedTime: "17:00",
                processingTime: null,
                recordsInFile: null,
                dataImported: null,
                readyForTest: false,
                ok: false,
                notOk: false,
                approval: false,
                owner: "Carerix",
              },
              {
                date: "Friday 19-6",
                activity: "Import companies",
                startActivity: "9:30",
                deliveryDate: "Friday 19-6",
                expectedTime: "17:00",
                processingTime: null,
                recordsInFile: null,
                dataImported: null,
                readyForTest: false,
                ok: false,
                notOk: false,
                approval: false,
                owner: "Carerix",
              },
              {
                date: "Friday 19-6",
                activity: "Import contacts",
                startActivity: "17:00",
                deliveryDate: "Friday 19-6",
                expectedTime: "17:00",
                processingTime: null,
                recordsInFile: null,
                dataImported: null,
                readyForTest: false,
                ok: false,
                notOk: false,
                approval: false,
                owner: "Carerix",
              },
              {
                date: "Saturday 20-6",
                activity: "Candidate CV's Attachments",
                startActivity: "10:00",
                deliveryDate: "Sunday 21-6",
                expectedTime: "22:00",
                processingTime: null,
                recordsInFile: null,
                dataImported: null,
                readyForTest: false,
                ok: false,
                notOk: false,
                approval: false,
                owner: "Carerix",
              },
              {
                date: "Friday 19-6",
                activity: "Import joborders",
                startActivity: "18:00",
                deliveryDate: "Saturday 20-6",
                expectedTime: "15:00",
                processingTime: null,
                recordsInFile: null,
                dataImported: null,
                readyForTest: false,
                ok: false,
                notOk: false,
                approval: false,
                owner: "Carerix",
              },
              {
                date: "Saturday 20-6",
                activity: "Import Matches",
                startActivity: "18:00",
                deliveryDate: "Sunday 21-6",
                expectedTime: "12:00",
                processingTime: null,
                recordsInFile: null,
                dataImported: null,
                readyForTest: false,
                ok: false,
                notOk: false,
                approval: false,
                owner: "Carerix",
              },
              {
                date: "Friday 19-6",
                activity: "Import Publications",
                startActivity: "18:00",
                deliveryDate: "Saturday 20-6",
                expectedTime: "15:00",
                processingTime: null,
                recordsInFile: null,
                dataImported: null,
                readyForTest: false,
                ok: false,
                notOk: false,
                approval: false,
                owner: "Carerix",
              },
              {
                date: "Saturday 20-6",
                activity: "Import Tasks",
                startActivity: "12:00",
                deliveryDate: "Sunday 21-6",
                expectedTime: "12:00",
                processingTime: null,
                recordsInFile: null,
                dataImported: null,
                readyForTest: false,
                ok: false,
                notOk: false,
                approval: false,
                owner: "Carerix",
              },
            ];

            await fetch("/api/migration", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(defaultEntities),
            });
            mutate("/api/migration");
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Initialiseer Migratie Entiteiten
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e4eaf3] rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-[#013c98] to-[#0149b6] text-white">
              <th className="px-3 py-3 text-left text-xs font-semibold">Date</th>
              <th className="px-3 py-3 text-left text-xs font-semibold">Activity</th>
              <th className="px-3 py-3 text-left text-xs font-semibold">Start</th>
              <th className="px-3 py-3 text-left text-xs font-semibold">Delivery</th>
              <th className="px-3 py-3 text-left text-xs font-semibold">Time</th>
              <th className="px-3 py-3 text-left text-xs font-semibold">Processing (h)</th>
              <th className="px-3 py-3 text-right text-xs font-semibold">Records</th>
              <th className="px-3 py-3 text-right text-xs font-semibold">Imported</th>
              <th className="px-3 py-3 text-center text-xs font-semibold">Ready for Test</th>
              <th className="px-3 py-3 text-center text-xs font-semibold">OK</th>
              <th className="px-3 py-3 text-center text-xs font-semibold">NOT OK</th>
              <th className="px-3 py-3 text-center text-xs font-semibold">Approval</th>
              <th className="px-3 py-3 text-left text-xs font-semibold">Owner</th>
            </tr>
          </thead>
          <tbody>
            {entities.map((entity, idx) => (
              <tr
                key={entity.id}
                className={`border-b border-[#e4eaf3] hover:bg-[#f8fafc] transition ${
                  idx % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"
                }`}
              >
                <td className="px-3 py-3 text-xs text-[#5b6779]">{entity.date}</td>
                <td className="px-3 py-3 text-xs font-medium text-[#172033]">
                  {entity.activity}
                </td>
                <td className="px-3 py-3 text-xs text-[#5b6779]">{entity.startActivity}</td>
                <td className="px-3 py-3 text-xs text-[#5b6779]">{entity.deliveryDate}</td>
                <td className="px-3 py-3 text-xs text-[#5b6779]">{entity.expectedTime}</td>
                <td className="px-3 py-3 text-xs text-[#5b6779]">
                  <input
                    type="number"
                    value={entity.processingTime || ""}
                    onChange={(e) =>
                      updateEntity(entity.activity, "processingTime", e.target.value || null)
                    }
                    className="w-16 px-2 py-1 border border-[#e4eaf3] rounded text-center"
                    placeholder="-"
                  />
                </td>
                <td className="px-3 py-3 text-xs text-[#5b6779] text-right">
                  <input
                    type="number"
                    value={entity.recordsInFile || ""}
                    onChange={(e) =>
                      updateEntity(
                        entity.activity,
                        "recordsInFile",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="w-20 px-2 py-1 border border-[#e4eaf3] rounded text-right"
                    placeholder="-"
                  />
                </td>
                <td className="px-3 py-3 text-xs text-[#5b6779] text-right">
                  <input
                    type="number"
                    value={entity.dataImported || ""}
                    onChange={(e) =>
                      updateEntity(
                        entity.activity,
                        "dataImported",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                    className="w-20 px-2 py-1 border border-[#e4eaf3] rounded text-right"
                    placeholder="-"
                  />
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <input
                      type="checkbox"
                      checked={entity.readyForTest}
                      onChange={(e) =>
                        updateEntity(entity.activity, "readyForTest", e.target.checked)
                      }
                      className="w-4 h-4 cursor-pointer"
                    />
                    {entity.readyForTestDate && (
                      <span className="text-[10px] text-[#8a94a6]">
                        {formatDate(entity.readyForTestDate)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <input
                      type="checkbox"
                      checked={entity.ok}
                      onChange={(e) => updateEntity(entity.activity, "ok", e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    {entity.okDate && (
                      <span className="text-[10px] text-green-600">
                        {formatDate(entity.okDate)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <input
                      type="checkbox"
                      checked={entity.notOk}
                      onChange={(e) => updateEntity(entity.activity, "notOk", e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    {entity.notOkDate && (
                      <span className="text-[10px] text-red-600">
                        {formatDate(entity.notOkDate)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <input
                      type="checkbox"
                      checked={entity.approval}
                      onChange={(e) =>
                        updateEntity(entity.activity, "approval", e.target.checked)
                      }
                      className="w-4 h-4 cursor-pointer"
                      disabled={entity.owner !== "Actief Werkt!"}
                    />
                    {entity.approvalDate && (
                      <span className="text-[10px] text-blue-600">
                        {formatDate(entity.approvalDate)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-xs">
                  <select
                    value={entity.owner}
                    onChange={(e) => updateEntity(entity.activity, "owner", e.target.value)}
                    className="px-2 py-1 border border-[#e4eaf3] rounded text-xs bg-white"
                  >
                    <option value="Carerix">Carerix</option>
                    <option value="Actief Werkt!">Actief Werkt!</option>
                    <option value="Teal">Teal</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
