/* InfoSnack — Sources: manage (AC-01), add wizard (AC-02), detail/edit (AC-03) */

function srcStatus(status, t) {
  const map = {
    active:          ["ready", t("src.active")],
    paused:          ["paused", t("src.paused")],
    failed:          ["failed", t("src.failed")],
    needs_credential:["review", t("src.needcred")],
  };
  const m = map[status] || map.active;
  return <span className={"status " + m[0]}><span className="led"></span>{m[1]}</span>;
}

function ScreenSources({ nav }) {
  const { lang, t } = useLang();
  const list = window.SOURCES;
  return (
    <div className="page">
      <div className="phead">
        <div><h1>{t("src.title")}</h1><div className="sub" style={{ fontFamily: "var(--font-body)", color: "var(--gray)" }}>{t("src.sub")}</div></div>
        <div className="acts"><Btn variant="primary" icon="plus" onClick={() => nav("sourceNew")}>{t("src.add")}</Btn></div>
      </div>

      {list.length ? list.map((s) => (
        <div className={"srcrow" + (s.autopaused ? " warn" : "")} key={s.id} onClick={() => nav("sourceDetail", { id: s.id })}>
          <div className="srcicon"><Icon name={s.icon} size={22} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
              <span className="sname">{s.name}</span>
              <span className="typebadge">{L(s.typeLabel, lang)}</span>
            </div>
            <div className="smeta">
              <span>{t("src.last")}: {L(s.last, lang)}</span>
              <span>{t("src.every")} {L(s.schedule, lang)}</span>
              {s.autopaused ? <span style={{ color: "var(--warning)", fontWeight: 800 }}>⚠ {t("src.autopaused")}</span> : null}
            </div>
          </div>
          {srcStatus(s.status, t)}
          <Icon name="chevron-right" size={20} style={{ color: "var(--gray)" }} />
        </div>
      )) : (
        <EmptyState title={t("src.empty.h")} body={t("src.empty.p")}
          action={<Btn variant="primary" icon="plus" onClick={() => nav("sourceNew")}>{t("src.add")}</Btn>} />
      )}
    </div>
  );
}

function SourceWizard({ nav }) {
  const { lang, t } = useLang();
  const [step, setStep] = React.useState(1);
  const [url, setUrl] = React.useState("");
  const [detecting, setDetecting] = React.useState(false);
  const [name, setName] = React.useState("LangChain Blog");
  const [sched, setSched] = React.useState("15m");

  const detect = () => {
    if (!url.trim()) return;
    setDetecting(true);
    setTimeout(() => { setDetecting(false); setStep(2); }, 900);
  };

  const Steps = (
    <div className="wstep">
      {[["wiz.s1", 1], ["wiz.s2", 2], ["wiz.s3", 3]].map(([k, n], i) => (
        <React.Fragment key={k}>
          {i > 0 ? <div className="line"></div> : null}
          <div className={"s" + (step === n ? " on" : step > n ? " done" : "")}>
            <span className="num">{step > n ? <Icon name="check" size={13} /> : n}</span>{t(k)}
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="page narrow">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 14, gap: 10 }}>
        <Btn variant="ghost" size="sm" icon="arrow-left" onClick={() => nav("sources")}>{t("src.title")}</Btn>
      </div>
      <div className="phead" style={{ justifyContent: "center" }}>
        <div style={{ textAlign: "center", width: "100%" }}>
          <div className="eyebrow">{t("nav.sources")}</div>
          <h1 style={{ marginTop: 6 }}>{t("wiz.title")}</h1>
        </div>
      </div>

      <div className="wizard">
        {Steps}

        {step === 1 ? (
          <div>
            <div className="bigfield">
              <Icon name="link" size={22} />
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t("wiz.paste.ph")} onKeyDown={(e) => e.key === "Enter" && detect()} />
              <Btn variant="primary" disabled={!url.trim() || detecting} onClick={detect} icon={detecting ? "loader" : "wand-2"}>
                {detecting ? t("wiz.detecting") : t("wiz.next")}
              </Btn>
            </div>
            <p className="muted" style={{ fontSize: 13, marginTop: 12, textAlign: "center" }}>{t("wiz.paste.hint")}</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
              {["RSS", "arXiv", "GitHub", "Hugging Face", "Site"].map((x) => <span className="typebadge" key={x}>{x}</span>)}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <div className="detected">
              <Icon name="check-circle-2" size={22} />
              <div>
                <div style={{ fontWeight: 800 }}>{t("wiz.detected")}: RSS 피드</div>
                <div className="muted" style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>{url || "blog.langchain.dev/rss/"}</div>
              </div>
            </div>
            <div className="field">
              <label>{t("wiz.name")}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label>{t("wiz.schedule")}</label>
              <select value={sched} onChange={(e) => setSched(e.target.value)}>
                <option value="15m">{lang === "ko" ? "15분마다" : "Every 15 minutes"}</option>
                <option value="1h">{lang === "ko" ? "1시간마다" : "Hourly"}</option>
                <option value="6h">{lang === "ko" ? "6시간마다" : "Every 6 hours"}</option>
                <option value="1d">{lang === "ko" ? "하루 1번" : "Daily"}</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <Btn variant="ghost" onClick={() => setStep(1)}>{t("back")}</Btn>
              <Btn variant="primary" iconRight="arrow-right" onClick={() => setStep(3)}>{t("wiz.next")}</Btn>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <div className="sectitle" style={{ marginTop: 0 }}>{t("wiz.sample")}</div>
            {window.WIZARD_SAMPLE.map((it, i) => (
              <div className="preview-item" key={i}>
                <div className={"pmini thumb " + it.thumb}>{it.emoji}</div>
                <div><div className="ph">{L(it.h, lang)}</div><div className="pmt">{it.m}</div></div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <Btn variant="ghost" onClick={() => setStep(2)}>{t("back")}</Btn>
              <Btn variant="primary" icon="check" onClick={() => { toast(t("toast.sourceadd")); nav("sources"); }}>{t("wiz.create")}</Btn>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ScreenSourceDetail({ nav, params }) {
  const { lang, t } = useLang();
  const s = window.SOURCES.find((x) => x.id === params.id) || window.SOURCES[0];
  const [paused, setPaused] = React.useState(s.status === "paused");
  return (
    <div className="page narrow">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 14, gap: 10 }}>
        <Btn variant="ghost" size="sm" icon="arrow-left" onClick={() => nav("sources")}>{t("src.title")}</Btn>
      </div>
      <div className="phead">
        <div className="row" style={{ alignItems: "flex-start" }}>
          <div className="srcicon" style={{ width: 54, height: 54 }}><Icon name={s.icon} size={26} /></div>
          <div>
            <h1 style={{ fontSize: 28 }}>{s.name}</h1>
            <div className="row" style={{ marginTop: 8, gap: 9 }}>
              <span className="typebadge">{L(s.typeLabel, lang)}</span>
              {srcStatus(paused ? "paused" : s.status, t)}
            </div>
          </div>
        </div>
        <div className="acts">
          {paused
            ? <Btn variant="primary" size="sm" icon="play" onClick={() => { setPaused(false); toast(t("toast.resumed")); }}>{t("src.resume")}</Btn>
            : <Btn variant="ghost" size="sm" icon="pause" onClick={() => { setPaused(true); toast(t("toast.paused")); }}>{t("src.pause")}</Btn>}
          <Btn variant="ghost" size="sm" icon="refresh-cw" onClick={() => toast(lang === "ko" ? "지금 수집을 시작했어요" : "Run started")}>{t("src.runnow")}</Btn>
        </div>
      </div>

      {s.autopaused ? (
        <div className="card" style={{ borderColor: "var(--warning)", background: "var(--warning-bg)", display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
          <Icon name="alert-triangle" size={22} style={{ color: "var(--warning)" }} />
          <div style={{ fontWeight: 700, fontSize: 14 }}>{t("src.autopaused")}</div>
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18 }}>
        <div className="card soft">
          <div className="card-h">{t("src.config")}</div>
          <div className="field"><label>{t("wiz.name")}</label><input defaultValue={s.name} /></div>
          <div className="field"><label>URL</label><input defaultValue={s.url} /></div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>{t("wiz.schedule")}</label>
            <select defaultValue="x"><option value="x">{t("src.every")} {L(s.schedule, lang)}</option></select>
          </div>
        </div>

        <div className="card soft">
          <div className="card-h">{t("src.runs")}</div>
          {s.runs.map((r, i) => (
            <div className="runrow" key={i}>
              <Icon name={r.ok ? "check-circle-2" : "x-circle"} size={16} style={{ color: r.ok ? "var(--success)" : "var(--danger)" }} />
              <span className="when">{r.when}</span>
              <span style={{ color: r.ok ? "var(--fg1)" : "var(--danger)" }}>{L(r.msg, lang)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenSources, SourceWizard, ScreenSourceDetail });
