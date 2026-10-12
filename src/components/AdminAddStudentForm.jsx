export default function AdminAddStudentForm({ form, setForm, submit, inputSx, focusSx, blurSx }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  return (
    <div className="adm-section fu fu3">
      <div className="adm-section-body">
        <div className="adm-section-title">✦ ADD NEW OPERATIVE</div>
        <form onSubmit={handleSubmit}>
          <div className="adm-form-grid">
            {[
              { ph: "Roll Number *", key: "roll", type: "text" },
              { ph: "Student Name *", key: "name", type: "text" },
              { ph: "Points (XP)", key: "points", type: "number" },
              { ph: "LinkedIn URL", key: "linkedin", type: "text" },
            ].map(({ ph, key, type }) => (
              <input
                key={key}
                type={type}
                style={inputSx}
                placeholder={ph}
                value={form[key] ?? ""}
                onFocus={focusSx}
                onBlur={blurSx}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
              />
            ))}
            <input
              type="text"
              style={inputSx}
              placeholder="GitHub URL"
              className="adm-full"
              value={form.github ?? ""}
              onFocus={focusSx}
              onBlur={blurSx}
              onChange={e => setForm({ ...form, github: e.target.value })}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
            <button type="submit" className="adm-btn">+ ADD OPERATIVE</button>
          </div>
        </form>
      </div>
    </div>
  );
}
