"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [suche, setSuche] = useState("");
  const [ergebnis, setErgebnis] = useState(null);
  const [lade, setLade] = useState(false);
  const [notiz, setNotiz] = useState("");
  const TAG_LISTE = [
    "Kraut",
    "Fest",
    "Lieblingspflanze",
    "Giftpflanze",
    "Heimisch",
    "Exotisch"
  ];
  const [tags, setTags] = useState([]);
  const [gespeichert, setGespeichert] = useState([]);
  const [editBuffer, setEditBuffer] = useState({});
  const [editSuccess, setEditSuccess] = useState({});
  const [sammlungSuche, setSammlungSuche] = useState("");
  const [sortierung, setSortierung] = useState("az"); // az, neu, alt
  const [tagFilter, setTagFilter] = useState([]);
  const [offen, setOffen] = useState({});
  const [seite, setSeite] = useState(1);
  const EINTRAEGE_PRO_SEITE = 5;
  const TAG_ICONS = {
    "Kraut": "🌿",
    "Fest": "🎉",
    "Lieblingspflanze": "⭐",
    "Giftpflanze": "☠️",
    "Heimisch": "🏡",
    "Exotisch": "🌍"
  };

  // Lade gespeicherte Einträge aus localStorage beim Start
  useEffect(() => {
    const daten = localStorage.getItem("heilkraeuter_sammlung");
    if (daten) setGespeichert(JSON.parse(daten));
  }, []);

  // Speichern in localStorage, wenn sich die Sammlung ändert
  useEffect(() => {
    localStorage.setItem("heilkraeuter_sammlung", JSON.stringify(gespeichert));
  }, [gespeichert]);

  // Editierbare Felder initialisieren, wenn Sammlung sich ändert
  useEffect(() => {
    const buffer = {};
    gespeichert.forEach((eintrag, idx) => {
      buffer[idx] = {
        beschreibung: eintrag.beschreibung,
        insta: eintrag.insta,
        notiz: eintrag.notiz
      };
    });
    setEditBuffer(buffer);
  }, [gespeichert]);

  // Simulierte API-Anfrage (Demo)
  const handleSuche = async (e) => {
    e.preventDefault();
    setLade(true);
    setErgebnis(null);
    setNotiz("");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setErgebnis({
      titel: suche || "Lavendel",
      beschreibung: `"${suche || "Lavendel"}" ist eine Heilpflanze, die beruhigend wirkt und oft bei Schlafproblemen eingesetzt wird. (Demo-Text)` ,
      insta: `🌿 ${suche || "Lavendel"} – für mehr Ruhe & Entspannung! #${(suche || "Lavendel").replace(/ /g, "")} #Heilkräuter #Naturkraft`
    });
    setLade(false);
  };

  // Speichern-Funktion
  const handleSpeichern = () => {
    if (!ergebnis) return;
    setGespeichert([
      ...gespeichert,
      {
        ...ergebnis,
        notiz: notiz,
        tags: tags,
        zeit: new Date().toLocaleString(),
        timestamp: Date.now()
      }
    ]);
    setErgebnis(null);
    setNotiz("");
    setTags([]);
  };

  // Notiz aktualisieren
  const handleNotizChange = (e) => setNotiz(e.target.value);

  // Notiz bei gespeichertem Eintrag ändern
  const handleGespeicherteNotiz = (idx, neueNotiz) => {
    const kopie = [...gespeichert];
    kopie[idx].notiz = neueNotiz;
    setGespeichert(kopie);
  };

  // Beschreibung bei gespeichertem Eintrag ändern
  const handleGespeicherteBeschreibung = (idx, neueBeschreibung) => {
    const kopie = [...gespeichert];
    kopie[idx].beschreibung = neueBeschreibung;
    setGespeichert(kopie);
  };

  // Instagram-Text bei gespeichertem Eintrag ändern
  const handleGespeicherteInsta = (idx, neuerInsta) => {
    const kopie = [...gespeichert];
    kopie[idx].insta = neuerInsta;
    setGespeichert(kopie);
  };

  // Eintrag löschen
  const handleLoeschen = (idx) => {
    const kopie = [...gespeichert];
    kopie.splice(idx, 1);
    setGespeichert(kopie);
  };

  // Änderungen im Editier-Buffer speichern
  const handleEditBufferChange = (idx, feld, wert) => {
    setEditBuffer((prev) => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        [feld]: wert
      }
    }));
  };

  // Änderungen übernehmen
  const handleEditSpeichern = (idx) => {
    const kopie = [...gespeichert];
    kopie[idx] = {
      ...kopie[idx],
      ...editBuffer[idx]
    };
    setGespeichert(kopie);
    setEditSuccess((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setEditSuccess((prev) => ({ ...prev, [idx]: false }));
    }, 2000);
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4"
      style={{
        background: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/background.jpg') center center / cover no-repeat fixed`,
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-green-900">HEILKRÄUTER & RITUALE</h1>
      <form onSubmit={handleSuche} className="flex flex-col items-center gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Suche nach Pflanze oder Fest..."
          value={suche}
          onChange={(e) => setSuche(e.target.value)}
          className="w-full p-2 border border-green-300 rounded"
        />
        <button
          type="submit"
          className="text-white px-4 py-2 rounded transition"
          style={{ backgroundColor: '#009975' }}
          disabled={lade}
        >
          {lade ? "Suche läuft..." : "Suchen"}
        </button>
      </form>

      {/* Ergebnis anzeigen */}
      {ergebnis && (
        <div className="mt-8 p-4 bg-white rounded shadow w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-2 text-green-800">{ergebnis.titel}</h2>
          <p className="mb-2">{ergebnis.beschreibung}</p>
          <div className="p-2 rounded mb-2" style={{ background: '#d8e3dc', color: '#3a5a40' }}>
            <strong>Instagram-Text:</strong><br/>
            {ergebnis.insta}
          </div>
          <textarea
            className="w-full p-2 border border-green-200 rounded mb-2"
            placeholder="Eigene Notiz hinzufügen..."
            value={notiz}
            onChange={handleNotizChange}
            rows={2}
          />
          <div className="flex flex-wrap gap-2 mb-2 justify-center">
            {TAG_LISTE.map((tag) => (
              <label key={tag} className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={tags.includes(tag)}
                  onChange={() => setTags(tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag])}
                />
                {tag}
              </label>
            ))}
          </div>
          <button
            onClick={handleSpeichern}
            className="text-white px-3 py-1 rounded transition"
            style={{ backgroundColor: '#009975' }}
          >
            Speichern
          </button>
        </div>
      )}

      {/* Gespeicherte Einträge */}
      {gespeichert.length > 0 && (
        <div className="mt-12 w-full max-w-md">
          <h3 className="text-lg font-bold mb-4 text-green-800">Meine Sammlung</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {TAG_LISTE.map(tag => (
              <button
                key={tag}
                className={`px-2 py-1 rounded text-xs border transition ${tagFilter.includes(tag) ? "bg-green-600 text-white border-green-700" : "bg-green-100 text-green-700 border-green-200"}`}
                onClick={() => setTagFilter(tagFilter.includes(tag) ? tagFilter.filter(t => t !== tag) : [...tagFilter, tag])}
              >
                {tag}
              </button>
            ))}
            {tagFilter.length > 0 && (
              <button
                className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-700 border border-gray-300 ml-2"
                onClick={() => setTagFilter([])}
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="In Sammlung suchen..."
              value={sammlungSuche}
              onChange={e => setSammlungSuche(e.target.value)}
              className="w-full sm:w-2/3 p-2 border border-green-200 rounded"
            />
            <select
              value={sortierung}
              onChange={e => setSortierung(e.target.value)}
              className="w-full sm:w-1/3 p-2 border border-green-200 rounded"
            >
              <option value="az">A–Z (Name)</option>
              <option value="neu">Neueste zuerst</option>
              <option value="alt">Älteste zuerst</option>
            </select>
          </div>
          {(() => {
            // Gefilterte und sortierte Einträge berechnen
            const gefiltert = gespeichert
              .filter(eintrag => {
                // Tag-Filter
                if (tagFilter.length > 0 && !(eintrag.tags || []).some(tag => tagFilter.includes(tag))) {
                  return false;
                }
                const such = sammlungSuche.toLowerCase();
                return (
                  eintrag.titel.toLowerCase().includes(such) ||
                  eintrag.beschreibung.toLowerCase().includes(such) ||
                  eintrag.insta.toLowerCase().includes(such) ||
                  (eintrag.notiz || "").toLowerCase().includes(such) ||
                  (eintrag.tags || []).some(tag => tag.toLowerCase().includes(such))
                );
              })
              .sort((a, b) => {
                if (sortierung === "az") {
                  return a.titel.localeCompare(b.titel);
                } else if (sortierung === "neu") {
                  return (b.timestamp || 0) - (a.timestamp || 0);
                } else if (sortierung === "alt") {
                  return (a.timestamp || 0) - (b.timestamp || 0);
                }
                return 0;
              });
            // Pagination
            const seitenAnzahl = Math.ceil(gefiltert.length / EINTRAEGE_PRO_SEITE) || 1;
            const start = (seite - 1) * EINTRAEGE_PRO_SEITE;
            const ende = start + EINTRAEGE_PRO_SEITE;
            const aktuell = gefiltert.slice(start, ende);
            // Wenn Seite zu hoch (z.B. nach Filter), zurück auf 1
            if (seite > seitenAnzahl) setSeite(1);
            return <>
              {aktuell.map((eintrag, idx) => {
                // Index für Akkordeon und EditBuffer anpassen:
                const globalIdx = gespeichert.indexOf(eintrag);
                return (
                  <div key={globalIdx} className="mb-6 p-4 bg-white rounded shadow">
                    <div className="flex justify-between items-center mb-1 cursor-pointer" onClick={() => setOffen(o => ({...o, [globalIdx]: !o[globalIdx]}))}>
                      <span className="font-semibold text-green-700 flex items-center gap-2">
                        {/* Icon für das erste Tag */}
                        {eintrag.tags && eintrag.tags.length > 0 && (
                          <span className="text-lg">{TAG_ICONS[eintrag.tags[0]] || "🌱"}</span>
                        )}
                        {eintrag.titel}
                        <span className="text-xs">{offen[globalIdx] ? "▲" : "▼"}</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {eintrag.tags && eintrag.tags.map((tag, i) => (
                          <span key={i} className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">{tag}</span>
                        ))}
                      </div>
                    </div>
                    {offen[globalIdx] && (
                      <div className="mt-2">
                        <textarea
                          className="w-full p-1 border border-green-100 rounded text-sm mb-1"
                          value={editBuffer[globalIdx]?.beschreibung || ""}
                          onChange={e => handleEditBufferChange(globalIdx, "beschreibung", e.target.value)}
                          rows={2}
                        />
                        <textarea
                          className="w-full p-1 border border-purple-200 rounded text-xs mb-2"
                          value={editBuffer[globalIdx]?.insta || ""}
                          onChange={e => handleEditBufferChange(globalIdx, "insta", e.target.value)}
                          rows={2}
                        />
                        <textarea
                          className="w-full p-1 border border-green-100 rounded text-xs"
                          value={editBuffer[globalIdx]?.notiz || ""}
                          onChange={e => handleEditBufferChange(globalIdx, "notiz", e.target.value)}
                          rows={2}
                        />
                        <button
                          onClick={() => handleEditSpeichern(globalIdx)}
                          className="text-white px-3 py-1 rounded transition mt-2 text-sm"
                          style={{ backgroundColor: '#009975' }}
                        >
                          Speichern
                        </button>
                        {editSuccess[globalIdx] && (
                          <div className="text-green-600 text-xs mt-1">Gespeichert!</div>
                        )}
                        <button onClick={() => handleLoeschen(globalIdx)} className="text-red-500 text-xs ml-2 mt-2">Löschen</button>
                        <div className="text-gray-400 text-xs mt-1">Gespeichert am: {eintrag.zeit}</div>
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Pagination Buttons */}
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => setSeite(s => Math.max(1, s - 1))}
                  disabled={seite === 1}
                  className="px-3 py-1 rounded bg-green-100 text-green-700 border border-green-200 disabled:opacity-50"
                >
                  Vorherige
                </button>
                <span className="px-2 py-1 text-xs">Seite {seite} / {seitenAnzahl}</span>
                <button
                  onClick={() => setSeite(s => Math.min(seitenAnzahl, s + 1))}
                  disabled={seite === seitenAnzahl}
                  className="px-3 py-1 rounded bg-green-100 text-green-700 border border-green-200 disabled:opacity-50"
                >
                  Nächste
                </button>
              </div>
            </>;
          })()}
        </div>
      )}
    </main>
  );
}
