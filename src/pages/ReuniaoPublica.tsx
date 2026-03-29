import { useState, useRef, useCallback } from "react";
import Layout from "@/components/Layout";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Semana {
  id: number;
  titulo: string;
  presidente: string;
  leitorVigilia: string;
  discurso: {
    tema: string;
    orador: string;
    congregacao: string;
  };
  watchtower: {
    tema: string;
    condutor: string;
    leitor: string;
  };
  participantes: string[];
}

const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

const semanaVazia = (id: number): Semana => ({
  id,
  titulo: "",
  presidente: "",
  leitorVigilia: "",
  discurso: { tema: "", orador: "", congregacao: "" },
  watchtower: { tema: "", condutor: "", leitor: "" },
  participantes: [],
});

// ─── Sub-components ───────────────────────────────────────────────────────────
function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rp-campo">
      <div className="rp-campo-label">{label}</div>
      {children}
    </div>
  );
}

function InputField({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="rp-bloco">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? ""}
      />
    </div>
  );
}

function TagInput({
  label, items, onAdd, onRemove,
}: {
  label: string;
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
}) {
  const [val, setVal] = useState("");
  const add = () => {
    if (val.trim()) { onAdd(val.trim()); setVal(""); }
  };
  return (
    <div className="rp-bloco rp-add">
      <label>{label}</label>
      <div style={{ display: "flex", gap: 6, width: "90%", margin: "3px auto" }}>
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Nome..."
          style={{ flex: 1 }}
        />
        <button type="button" onClick={add} className="rp-tag-btn">+</button>
      </div>
      {items.length > 0 && (
        <div className="rp-nomes">
          {items.map((n, i) => (
            <span key={i} className="rp-nome-tag">
              {n}
              <button type="button" onClick={() => onRemove(i)}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Preview A4 ───────────────────────────────────────────────────────────────
function PreviewA4({
  congregacao, mes, ano, semanas, logoUrl,
}: {
  congregacao: string;
  mes: number;
  ano: string;
  semanas: Semana[];
  logoUrl: string | null;
}) {
  return (
    <div className="rp-previsu" id="previsu-a4">
      {/* Topo */}
      <div className="rp-titu-prev">
        <p className="rp-des">REUNIÃO PÚBLICA</p>
        <div className="rp-cong-bar">
          <span>⛪</span>
          <span>{congregacao || "Congregação"}</span>
        </div>
      </div>

      {/* Mês / Ano + Logo */}
      <div style={{ display: "flex", alignItems: "center", margin: "6px 0 8px" }}>
        <div className="rp-mes-ano">
          <p className="rp-mes">{MESES[mes]}</p>
          <p className="rp-ano">{ano}</p>
        </div>
        {logoUrl && (
          <div className="rp-img-pre">
            <img src={logoUrl} alt="logo" />
          </div>
        )}
      </div>

      {/* Tabela de semanas */}
      <div className="rp-tabela-wrapper">
        {semanas.map((s) => (
          <div key={s.id} className="rp-semana-bloco">
            <table className="rp-semanas-table">
              <thead>
                <tr className="rp-semana-titulo">
                  <th colSpan={2}>{s.titulo || `Semana ${s.id}`}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="rp-cat-label">Presidente:</td>
                  <td>{s.presidente}</td>
                </tr>
                <tr>
                  <td className="rp-cat-label">Leitor (Vigília):</td>
                  <td>{s.leitorVigilia}</td>
                </tr>
                <tr>
                  <td className="rp-cat-label">Discurso:</td>
                  <td>
                    {s.discurso.tema && <strong>{s.discurso.tema}</strong>}
                    {s.discurso.orador && ` — ${s.discurso.orador}`}
                    {s.discurso.congregacao && ` (${s.discurso.congregacao})`}
                  </td>
                </tr>
                <tr>
                  <td className="rp-cat-label">A Sentinela:</td>
                  <td>
                    {s.watchtower.tema && <strong>{s.watchtower.tema}</strong>}
                    {s.watchtower.condutor && ` — ${s.watchtower.condutor}`}
                    {s.watchtower.leitor && ` | Leitor: ${s.watchtower.leitor}`}
                  </td>
                </tr>
                {s.participantes.length > 0 && (
                  <tr>
                    <td className="rp-cat-label">Participantes:</td>
                    <td>{s.participantes.join(", ")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ReuniaoPublica = () => {
  const [congregacao, setCongregacao] = useState("");
  const [mes, setMes] = useState(new Date().getMonth());
  const [ano, setAno] = useState(String(new Date().getFullYear()));
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [semanas, setSemanas] = useState<Semana[]>([semanaVazia(1)]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const updateSemana = useCallback(<K extends keyof Semana>(
    id: number, key: K, val: Semana[K]
  ) => {
    setSemanas((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [key]: val } : s))
    );
  }, []);

  const updateNested = useCallback((
    id: number,
    section: "discurso" | "watchtower",
    key: string,
    val: string
  ) => {
    setSemanas((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [section]: { ...s[section], [key]: val } } : s
      )
    );
  }, []);

  const addSemana = () => {
    const nextId = semanas.length ? Math.max(...semanas.map((s) => s.id)) + 1 : 1;
    setSemanas((prev) => [...prev, semanaVazia(nextId)]);
  };

  const removeSemana = (id: number) => {
    setSemanas((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const exportImg = async () => {
    setLoading(true);
    try {
      const { default: html2canvas } = await import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js" as any);
      const el = document.getElementById("previsu-a4");
      if (!el) return;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const link = document.createElement("a");
      link.download = `reuniao-publica-${MESES[mes]}-${ano}.png`;
      link.href = canvas.toDataURL();
      link.click();
      showToast("Imagem exportada!");
    } catch {
      showToast("Instale html2canvas para exportar.");
    } finally {
      setLoading(false);
    }
  };

  const exportPdf = () => {
    window.print();
    showToast("Abrindo impressão...");
  };

  return (
    <Layout title="Reunião Pública">
      {/* ── Styles ── */}
      <style>{`
        /* ── Paleta ── */
        :root {
          --rp-navy: #1e3a6e;
          --rp-navy-dark: #162c54;
          --rp-navy-light: #7098d52a;
          --rp-gold: #c8a84b;
          --rp-gold-light: #e2c97e;
          --rp-bg: #f4f2ee;
          --rp-white: #ffffff;
          --rp-text: #1a1a2e;
          --rp-border: #c5bfb0;
          --rp-cell: #eef1f7;
          --rp-teal: #237db1cc;
          --rp-teal-dark: #2896d4;
        }

        /* ── Layout ── */
        .rp-main {
          width: 100%;
          background: var(--rp-bg);
          min-height: calc(100vh - 60px);
          font-family: Arial, Helvetica, sans-serif;
        }

        .rp-inner {
          display: flex;
          justify-content: center;
          gap: 24px;
          padding: 12px 16px;
          flex-wrap: wrap;
        }

        /* ── Editor ── */
        .rp-editor {
          width: 100%;
          max-width: 400px;
          background: var(--rp-cell);
          border-radius: 15px;
          padding: 1rem;
          box-shadow: 2px 2px 8px rgba(26,26,46,0.25);
          flex-shrink: 0;
        }

        .rp-editor-title {
          font-size: 17px;
          font-weight: 700;
          color: var(--rp-navy-dark);
          margin-bottom: 10px;
          letter-spacing: 1px;
          border-bottom: 2px solid var(--rp-gold);
          padding-bottom: 4px;
        }

        /* Campos gerais */
        .rp-campo {
          background: var(--rp-border);
          border-radius: 12px;
          padding: 12px 0 16px;
          margin-bottom: 10px;
        }

        .rp-campo-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--rp-navy-dark);
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 0 14px 6px;
          border-bottom: 1.5px solid var(--rp-gold);
          margin-bottom: 6px;
        }

        /* Semana */
        .rp-semana-card {
          background: var(--rp-border);
          border-radius: 14px;
          padding: 12px 0 16px;
          margin-bottom: 10px;
          position: relative;
        }

        .rp-semana-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px 6px;
          border-bottom: 1.5px solid var(--rp-gold);
          margin-bottom: 6px;
        }

        .rp-semana-header span {
          font-size: 13px;
          font-weight: 700;
          color: var(--rp-navy-dark);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .rp-semana-header button.rp-remove {
          background: transparent;
          border: none;
          color: #c0392b;
          font-size: 18px;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          box-shadow: none;
          width: auto;
          margin: 0;
          font-weight: 700;
        }

        /* Bloco input */
        .rp-bloco {
          display: flex;
          flex-direction: column;
          margin-top: 5px;
        }

        .rp-bloco label {
          width: 90%;
          margin: 0 auto;
          font-size: 13px;
          margin-top: 6px;
          color: var(--rp-navy-dark);
          font-weight: 700;
          letter-spacing: 0.4px;
        }

        .rp-bloco input {
          padding: 8px 10px;
          width: 90%;
          margin: 3px auto;
          border: 1px solid var(--rp-border);
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        .rp-bloco input:focus {
          outline: 2px solid var(--rp-gold);
        }

        .rp-bloco select {
          padding: 8px 10px;
          width: 90%;
          margin: 3px auto;
          border: 1px solid var(--rp-border);
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        /* Tag input */
        .rp-add {
          margin-bottom: 4px;
        }

        .rp-tag-btn {
          padding: 6px 14px !important;
          width: auto !important;
          border-radius: 6px !important;
          margin: 0 !important;
          background: var(--rp-navy-dark) !important;
          color: white !important;
          font-size: 18px !important;
          box-shadow: none !important;
        }

        .rp-nomes {
          width: 90%;
          margin: 6px auto 0;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .rp-nome-tag {
          background: var(--rp-navy);
          color: white;
          border-radius: 12px;
          padding: 2px 8px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rp-nome-tag button {
          background: none !important;
          border: none !important;
          color: white !important;
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
          padding: 0 !important;
          box-shadow: none !important;
          width: auto !important;
          margin: 0 !important;
        }

        /* Botões de ação */
        .rp-btn-add-sem {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }

        .rp-btn-add-sem button {
          padding: 8px 18px;
          border-radius: 10px;
          background: var(--rp-gold);
          color: var(--rp-navy-dark);
          font-weight: 700;
          border: 1px solid var(--rp-border);
          cursor: pointer;
          font-size: 13px;
        }

        .rp-btn-add-sem button:hover {
          background: var(--rp-gold-light);
        }

        .rp-btn-exportar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 14px 0 6px;
        }

        .rp-btn-exportar button {
          padding: 10px 22px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          font-size: 13px;
          border: none;
          transition: opacity 0.2s;
        }

        .rp-btn-exportar button:hover { opacity: 0.85; }

        .rp-btn-img {
          background: var(--rp-navy-dark);
          color: white;
        }

        .rp-btn-pdf {
          background: var(--rp-gold);
          color: var(--rp-navy-dark);
        }

        /* Logo upload */
        .rp-logo-area {
          width: 90%;
          margin: 6px auto;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .rp-logo-area button {
          padding: 6px 12px;
          border-radius: 8px;
          background: var(--rp-gold-light);
          color: var(--rp-navy-dark);
          font-weight: 600;
          border: none;
          cursor: pointer;
          font-size: 13px;
          width: auto !important;
          margin: 0 !important;
          box-shadow: none !important;
        }

        .rp-logo-preview {
          width: 40px;
          height: 40px;
          object-fit: contain;
          border-radius: 6px;
          border: 1px solid var(--rp-border);
        }

        /* ═══ PRÉ-VISUALIZAÇÃO A4 ═══ */
        .rp-previsu {
          width: 210mm;
          background: var(--rp-white);
          border: 2px solid #aaa;
          padding: 0.5cm;
          flex-shrink: 0;
          font-family: Arial, Helvetica, sans-serif;
          min-height: 297mm;
          box-shadow: 4px 4px 20px rgba(0,0,0,0.18);
        }

        .rp-titu-prev {
          margin-bottom: 6px;
        }

        .rp-des {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24pt;
          font-weight: 600;
          background: var(--rp-teal);
          text-shadow: 1px 1px 4px var(--rp-teal-dark);
          border-radius: 0 0 0 40px;
          height: 1.2cm;
          letter-spacing: 2px;
          margin: 0;
          color: white;
        }

        .rp-cong-bar {
          margin-top: -2px;
          margin-left: auto;
          font-size: 13pt;
          font-weight: 500;
          background: var(--rp-teal);
          text-shadow: 1px 1px 4px var(--rp-teal-dark);
          border-radius: 0 0 0 40px;
          height: 0.8cm;
          width: 125mm;
          display: flex;
          align-items: center;
          gap: 5px;
          padding-left: 14px;
          border-bottom: 2px solid black;
          color: white;
        }

        .rp-mes-ano {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .rp-mes {
          font-size: 18pt;
          font-weight: 700;
          letter-spacing: 3px;
          margin: 0;
          color: var(--rp-navy-dark);
        }

        .rp-ano {
          font-size: 16pt;
          font-weight: 400;
          color: #555;
          margin: 0;
        }

        .rp-img-pre {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .rp-img-pre img {
          width: 5cm;
          object-fit: contain;
        }

        /* Tabela semanas */
        .rp-tabela-wrapper {
          margin-top: 6px;
        }

        .rp-semana-bloco {
          margin-bottom: 0.25cm;
        }

        table.rp-semanas-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11pt;
          table-layout: auto;
        }

        table.rp-semanas-table tr.rp-semana-titulo th {
          background: var(--rp-navy-light);
          color: var(--rp-text);
          text-align: left;
          padding: 3px 7px;
          border: 1px solid #999;
          font-size: 11.5pt;
          letter-spacing: 1px;
        }

        table.rp-semanas-table td {
          border: 1px solid #bbb;
          padding: 2px 7px;
          vertical-align: middle;
          font-size: 10pt;
          background: #fff;
        }

        table.rp-semanas-table td.rp-cat-label {
          background: #e8eef7;
          color: var(--rp-navy-dark);
          font-weight: 700;
          font-size: 10.5pt;
          text-align: right;
          white-space: nowrap;
          width: 1%;
          padding-right: 8px;
        }

        /* Toast */
        .rp-toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: var(--rp-navy-dark);
          color: white;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 14px;
          z-index: 9999;
          pointer-events: none;
          transition: opacity 0.3s;
          opacity: ${toast ? 1 : 0};
        }

        /* Loading overlay */
        .rp-loading {
          display: ${loading ? "flex" : "none"};
          position: fixed;
          inset: 0;
          background: rgba(22,44,84,0.7);
          z-index: 10000;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          gap: 16px;
          color: white;
          font-size: 16px;
        }

        .rp-spinner {
          width: 48px;
          height: 48px;
          border: 5px solid var(--rp-gold-light);
          border-top-color: var(--rp-gold);
          border-radius: 50%;
          animation: rp-spin 0.8s linear infinite;
        }

        @keyframes rp-spin { to { transform: rotate(360deg); } }

        /* Print */
        @media print {
          .rp-editor, .rp-btn-exportar, .rp-toast, .rp-loading { display: none !important; }
          .rp-previsu { border: none; box-shadow: none; }
        }
      `}</style>

      <div className="rp-main">
        <div className="rp-inner">

          {/* ══ EDITOR ══ */}
          <div className="rp-editor">
            <div className="rp-editor-title">✦ Programação — Reunião Pública</div>

            {/* Congregação */}
            <Campo label="Congregação">
              <InputField
                label="Nome da Congregação"
                value={congregacao}
                onChange={setCongregacao}
                placeholder="Ex: Congregação Central"
              />
            </Campo>

            {/* Mês / Ano */}
            <Campo label="Período">
              <div className="rp-bloco">
                <label>Mês</label>
                <select
                  value={mes}
                  onChange={(e) => setMes(Number(e.target.value))}
                  style={{ width: "90%", margin: "3px auto" }}
                >
                  {MESES.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
              </div>
              <InputField label="Ano" value={ano} onChange={setAno} placeholder="2025" />
            </Campo>

            {/* Logo */}
            <Campo label="Logo / Imagem">
              <div className="rp-logo-area">
                <button type="button" onClick={() => fileRef.current?.click()}>
                  📁 Escolher imagem
                </button>
                {logoUrl && <img src={logoUrl} alt="logo" className="rp-logo-preview" />}
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl(null)}
                    style={{ background: "#fdd", color: "#c00" }}
                  >
                    ✕
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleLogo}
                />
              </div>
            </Campo>

            {/* Semanas */}
            {semanas.map((s) => (
              <div key={s.id} className="rp-semana-card">
                <div className="rp-semana-header">
                  <span>📅 Semana {s.id}</span>
                  {semanas.length > 1 && (
                    <button className="rp-remove" type="button" onClick={() => removeSemana(s.id)}>
                      ✕
                    </button>
                  )}
                </div>

                <InputField
                  label="Título da Semana"
                  value={s.titulo}
                  onChange={(v) => updateSemana(s.id, "titulo", v)}
                  placeholder="Ex: 1–7 de Janeiro"
                />
                <InputField
                  label="Presidente"
                  value={s.presidente}
                  onChange={(v) => updateSemana(s.id, "presidente", v)}
                />
                <InputField
                  label="Leitor (Vigília)"
                  value={s.leitorVigilia}
                  onChange={(v) => updateSemana(s.id, "leitorVigilia", v)}
                />

                {/* Discurso */}
                <div style={{ padding: "6px 14px 0", fontSize: 12, fontWeight: 700, color: "var(--rp-navy)", textTransform: "uppercase", letterSpacing: 1 }}>
                  Discurso Público
                </div>
                <InputField
                  label="Tema"
                  value={s.discurso.tema}
                  onChange={(v) => updateNested(s.id, "discurso", "tema", v)}
                />
                <InputField
                  label="Orador"
                  value={s.discurso.orador}
                  onChange={(v) => updateNested(s.id, "discurso", "orador", v)}
                />
                <InputField
                  label="Congregação (orador)"
                  value={s.discurso.congregacao}
                  onChange={(v) => updateNested(s.id, "discurso", "congregacao", v)}
                />

                {/* Watchtower */}
                <div style={{ padding: "6px 14px 0", fontSize: 12, fontWeight: 700, color: "var(--rp-navy)", textTransform: "uppercase", letterSpacing: 1 }}>
                  Estudo d'A Sentinela
                </div>
                <InputField
                  label="Tema"
                  value={s.watchtower.tema}
                  onChange={(v) => updateNested(s.id, "watchtower", "tema", v)}
                />
                <InputField
                  label="Condutor"
                  value={s.watchtower.condutor}
                  onChange={(v) => updateNested(s.id, "watchtower", "condutor", v)}
                />
                <InputField
                  label="Leitor"
                  value={s.watchtower.leitor}
                  onChange={(v) => updateNested(s.id, "watchtower", "leitor", v)}
                />

                {/* Participantes extras */}
                <TagInput
                  label="Participantes / Outros"
                  items={s.participantes}
                  onAdd={(v) => updateSemana(s.id, "participantes", [...s.participantes, v])}
                  onRemove={(i) =>
                    updateSemana(s.id, "participantes", s.participantes.filter((_, idx) => idx !== i))
                  }
                />
              </div>
            ))}

            <div className="rp-btn-add-sem">
              <button type="button" onClick={addSemana}>+ Adicionar Semana</button>
            </div>

            {/* Exportar */}
            <div className="rp-btn-exportar">
              <button type="button" className="rp-btn-img" onClick={exportImg}>
                🖼 Exportar Imagem
              </button>
              <button type="button" className="rp-btn-pdf" onClick={exportPdf}>
                🖨 Exportar PDF
              </button>
            </div>
          </div>

          {/* ══ PRÉ-VISUALIZAÇÃO ══ */}
          <PreviewA4
            congregacao={congregacao}
            mes={mes}
            ano={ano}
            semanas={semanas}
            logoUrl={logoUrl}
          />
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="rp-toast">{toast}</div>}

      {/* Loading */}
      <div className="rp-loading">
        <div className="rp-spinner" />
        <span>Gerando arquivo...</span>
      </div>
    </Layout>
  );
};

export default ReuniaoPublica;