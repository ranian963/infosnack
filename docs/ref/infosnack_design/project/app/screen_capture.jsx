/* InfoSnack — Capture (/capture): URL / YouTube / Text / File + live processing */

const CAP_STEPS = ["queued", "fetching", "extracting", "ai", "indexing", "ready"];
const CAP_STEP_LABEL = {
  queued:     { ko: "대기", en: "Queued" },
  fetching:   { ko: "가져오기", en: "Fetch" },
  extracting: { ko: "본문 추출", en: "Extract" },
  ai:         { ko: "AI 요약", en: "AI enrich" },
  indexing:   { ko: "색인", en: "Index" },
  ready:      { ko: "완료", en: "Ready" },
};

function ProcessingItem({ item, nav }) {
  const { lang, t } = useLang();
  const idx = CAP_STEPS.indexOf(item.step);
  const pct = Math.round(((idx + 1) / CAP_STEPS.length) * 100);
  const done = item.step === "ready";
  const review = item.step === "review";
  return (
    <div className="procitem" onClick={() => done && nav("reader", { id: "s1" })} style={{ cursor: done ? "pointer" : "default" }}>
      <div className={"pthumb thumb " + item.thumb}>{item.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="pt">{item.title}</div>
        <div className="ps">{item.domain}</div>
        {!done && !review ? (
          <>
            <div className="procbar"><i style={{ width: pct + "%" }}></i></div>
            <div className="steps">
              {CAP_STEPS.map((s, i) => (
                <span key={s} className={"step" + (i < idx ? " done" : i === idx ? " now" : "")}>{L(CAP_STEP_LABEL[s], lang)}</span>
              ))}
            </div>
          </>
        ) : null}
        {done ? <div className="steps" style={{ marginTop: 8 }}><StatusPill status="ready" /><span className="muted" style={{ fontSize: 12, alignSelf: "center" }}>{t("cap.done")}</span></div> : null}
        {review ? <div className="steps" style={{ marginTop: 8 }}><StatusPill status="review" /><span className="muted" style={{ fontSize: 12, alignSelf: "center" }}>{t("cap.yt.review")}</span></div> : null}
      </div>
      {done ? <Icon name="chevron-right" size={20} style={{ color: "var(--gray)" }} /> : null}
    </div>
  );
}

function ScreenCapture({ nav }) {
  const { lang, t } = useLang();
  const [tab, setTab] = React.useState("url");
  const [val, setVal] = React.useState("");
  const [items, setItems] = React.useState([]);
  const timers = React.useRef([]);
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const sample = {
    url:     { title: "Building multi-agent workflows with LangGraph", domain: "langchain.dev", thumb: "yellow", emoji: "🧠" },
    youtube: { title: "상태 머신으로 멀티 에이전트 조립하기", domain: "youtube.com · 자막 확인 필요", thumb: "pink", emoji: "🎥", review: true },
    text:    { title: lang === "ko" ? "직접 메모" : "Quick note", domain: lang === "ko" ? "메모 · note" : "note", thumb: "green", emoji: "📝" },
    file:    { title: "embedding-benchmark.pdf", domain: "PDF · OCR by Upstage", thumb: "purple", emoji: "📄" },
  };

  const save = () => {
    const base = sample[tab];
    const id = "p" + Date.now();
    const newItem = { id, ...base, step: "queued" };
    setItems((x) => [newItem, ...x]);
    setVal("");
    toast(t("toast.saved"));
    // simulate pipeline
    const seq = tab === "youtube" ? ["fetching", "extracting", "review"] : ["fetching", "extracting", "ai", "indexing", "ready"];
    seq.forEach((step, i) => {
      const tm = setTimeout(() => {
        setItems((x) => x.map((it) => it.id === id ? { ...it, step } : it));
      }, 900 * (i + 1));
      timers.current.push(tm);
    });
  };

  const canSave = tab === "file" ? true : val.trim().length > 0;

  return (
    <div className="page narrow">
      <div className="phead">
        <div>
          <div className="eyebrow">{t("nav.capture")}</div>
          <h1 style={{ marginTop: 6 }}>{t("cap.title")}</h1>
          <div className="sub" style={{ fontFamily: "var(--font-body)", color: "var(--gray)", marginTop: 8 }}>{t("cap.sub")}</div>
        </div>
      </div>

      <div className="cap-tabs">
        {[["url", "link"], ["youtube", "youtube"], ["text", "type"], ["file", "file-up"]].map(([k, ic]) => (
          <div key={k} className={"cap-tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>
            <Icon name={ic} size={17} /> {t("cap.tab." + k)}
          </div>
        ))}
      </div>

      {tab === "url" || tab === "youtube" ? (
        <div className="bigfield">
          <Icon name={tab === "youtube" ? "youtube" : "link"} size={22} />
          <input value={val} onChange={(e) => setVal(e.target.value)} placeholder={t(tab === "youtube" ? "cap.yt.ph" : "cap.url.ph")}
            onKeyDown={(e) => e.key === "Enter" && canSave && save()} />
          <Btn variant="primary" disabled={!canSave} onClick={save} icon="bookmark-plus">{t("cap.save")}</Btn>
        </div>
      ) : null}

      {tab === "text" ? (
        <div>
          <textarea className="bigtext" value={val} onChange={(e) => setVal(e.target.value)} placeholder={t("cap.text.ph")} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <Btn variant="primary" disabled={!canSave} onClick={save} icon="bookmark-plus">{t("cap.save")}</Btn>
          </div>
        </div>
      ) : null}

      {tab === "file" ? (
        <div>
          <div className="dropzone" onClick={save}>
            <Icon name="file-up" size={40} />
            <div style={{ fontWeight: 800, fontSize: 16, color: "var(--fg1)" }}>{t("cap.file.drop")}</div>
            <div style={{ marginTop: 6 }}>{t("cap.file.hint")}</div>
          </div>
        </div>
      ) : null}

      {items.length ? (
        <>
          <div className="sectitle">{t("cap.recent")}</div>
          {items.map((it) => <ProcessingItem key={it.id} item={it} nav={nav} />)}
        </>
      ) : (
        <div className="card sunken" style={{ marginTop: 24, display: "flex", gap: 14, alignItems: "center", padding: 18 }}>
          <img src="assets/mascot-snackbag.png" alt="" style={{ height: 64, borderRadius: 12 }} />
          <div>
            <div style={{ fontWeight: 800, fontFamily: "var(--font-display-kr)", fontSize: 18 }}>
              {lang === "ko" ? "저장은 3초, 분석은 알아서." : "Save in 3 seconds, we analyze the rest."}
            </div>
            <div className="muted" style={{ fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>
              {lang === "ko"
                ? "URL · YouTube · 메모 · PDF/이미지를 담으면 요약·태그·OCR·색인을 백그라운드에서 처리해요."
                : "Drop a URL, YouTube link, note, or PDF/image — summary, tags, OCR and indexing run in the background."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
Object.assign(window, { ScreenCapture });
