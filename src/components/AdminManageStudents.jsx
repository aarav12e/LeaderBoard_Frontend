import { Fragment } from "react";

export default function AdminManageStudents({
  filtered,
  search,
  setSearch,
  pointsUpdate,
  setPointsUpdate,
  linksUpdate,
  setLinksUpdate,
  expandedLinks,
  toggleLinkEdit,
  updateLinks,
  updatePoints,
  handleDelete,
  flashRow,
  rankColor,
  inputSx,
  focusSx,
  blurSx,
}) {
  return (
    <div className="adm-section fu fu4">
      <div className="adm-section-body">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
          <div className="adm-section-title" style={{ marginBottom: 0, flex: 1 }}>
            ✦ MANAGE OPERATIVES ({filtered.length})
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(0,255,160,0.3)", fontSize: 13, pointerEvents: "none" }}>⬡</span>
            <input className="adm-search-input" type="text" placeholder="SCAN BY NAME / ROLL..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>OPERATIVE</th>
                <th className="c">RANK</th>
                <th className="c">CURRENT XP</th>
                <th className="c">UPDATE XP</th>
                <th>LINKS</th>
                <th className="c">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const rc = rankColor(s.rank);
                const fl = flashRow[s._id];
                return (
                  <Fragment key={s._id}>
                    <tr className={fl === "success" ? "flash-success" : fl === "error" ? "flash-error" : ""}>
                      <td>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontWeight: 700, fontSize: 15, color: "#e8fff4", letterSpacing: "0.03em" }}>{s.name}</div>
                        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "rgba(0,255,200,0.4)", letterSpacing: "0.08em", marginTop: 3 }}>{s.roll}</div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="adm-rank" style={{ color: rc, borderColor: rc + "44", background: rc + "0d", textShadow: `0 0 10px ${rc}66` }}>
                          #{s.rank}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="adm-pts-chip">{s.points}</span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                          <input
                            type="number"
                            className="adm-pts-input"
                            placeholder="New"
                            value={pointsUpdate[s._id] !== undefined ? pointsUpdate[s._id] : ""}
                            onChange={e => setPointsUpdate({ ...pointsUpdate, [s._id]: e.target.value })}
                            onKeyDown={e => e.key === "Enter" && updatePoints(s._id)}
                          />
                          <button className="adm-btn-icon adm-btn-save" onClick={() => updatePoints(s._id)} title="Save XP">💾</button>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          {s.github ? <a href={s.github} target="_blank" rel="noreferrer" title={s.github} style={{ fontSize: 18, lineHeight: 1 }}>🐙</a> : <span style={{ opacity: 0.2, fontSize: 12 }}>—</span>}
                          {s.linkedin ? <a href={s.linkedin} target="_blank" rel="noreferrer" title={s.linkedin} style={{ fontSize: 18, lineHeight: 1 }}>💼</a> : <span style={{ opacity: 0.2, fontSize: 12 }}>—</span>}
                          <button className="adm-btn-link-edit" onClick={() => toggleLinkEdit(s._id, s)}>
                            {expandedLinks[s._id] ? "✕" : "✏️ EDIT"}
                          </button>
                        </div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button className="adm-btn-icon adm-btn-del" onClick={() => handleDelete(s._id)} title="Delete Operative">🗑️</button>
                      </td>
                    </tr>
                    {expandedLinks[s._id] && (
                      <tr className="adm-link-row">
                        <td colSpan={6}>
                          <div className="adm-link-row-inner">
                            <span style={{ fontSize: 11, color: "rgba(0,255,160,0.5)", letterSpacing: "0.1em" }}>🐙 GITHUB:</span>
                            <input style={{ ...inputSx, flex: 1, minWidth: 180, padding: "8px 12px" }}
                              placeholder="https://github.com/username"
                              value={linksUpdate[s._id]?.github || ""}
                              onFocus={focusSx}
                              onBlur={blurSx}
                              onChange={e => setLinksUpdate(prev => ({ ...prev, [s._id]: { ...prev[s._id], github: e.target.value } }))}
                            />
                            <span style={{ fontSize: 11, color: "rgba(0,255,160,0.5)", letterSpacing: "0.1em" }}>💼 LINKEDIN:</span>
                            <input style={{ ...inputSx, flex: 1, minWidth: 180, padding: "8px 12px" }}
                              placeholder="https://linkedin.com/in/username"
                              value={linksUpdate[s._id]?.linkedin || ""}
                              onFocus={focusSx}
                              onBlur={blurSx}
                              onChange={e => setLinksUpdate(prev => ({ ...prev, [s._id]: { ...prev[s._id], linkedin: e.target.value } }))}
                            />
                            <button className="adm-btn-save-links" onClick={() => updateLinks(s._id)}>💾 SAVE LINKS</button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="adm-empty">
              {search ? "◈ NO MATCH FOUND ◈" : "◈ NO OPERATIVES FOUND ◈"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
