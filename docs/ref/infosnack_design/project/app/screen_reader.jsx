/* InfoSnack — Content detail / Reader (L-02) + content-scoped chat panel */

function ReaderBody({ body, lang }) {
  return body.map((b, i) => {
    if (b.t === "p") return <p key={i} dangerouslySetInnerHTML={{ __html: L(b, lang) }} />;
    if (b.t === "h2") return <h2 key={i}>{L(b, lang)}</h2>;
    if (b.t === "quote") return <blockquote key={i}>{L(b, lang)}</blockquote>;
    if (b.t === "fig") return (
      <figure key={i}>
        <div className={"img thumb " + b.thumb}>{b.emoji}</div>
        <figcaption>
          {b.ocr ? <span className="ai-label"><Icon name="eye" size={10} /> OCR + Vision</span> : null}
          {L(b, lang)}
        </figcaption>
      </figure>
    );
    return null;
  });
}

function ContentChatPanel({ snack, onClose }) {
  const { lang, t } = useLang();
  const [msgs, setMsgs] = React.useState([{ role: "ai", brand: true, text: t("cchat.intro") }]);
  const [val, setVal] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const bodyRef = React.useRef(null);
  React.useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, busy]);

  const ask = (text) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setVal(""); setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setMsgs((m) => [...m, {
        role: "ai",
        text: lang === "ko"
          ? `이 스낵에 따르면 <b>${L(snack.one, lang)}</b> 핵심 근거는 본문 상태 머신 섹션에 있어요.`
          : `Per this snack, <b>${L(snack.one, lang)}</b> The key support is in the state-machine section.`,
        cite: snack,
      }]);
    }, 1100);
  };

  return (
    <div className="slideover" onClick={onClose}>
      <div className="scrim"></div>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="chat-head">
          <div className="orb"><Icon name="sparkles" size={19} /></div>
          <div><h3>{t("cchat.title")}</h3><div className="st"><span className="led" style={{ width: 7, height: 7, borderRadius: 9, background: "var(--success)" }}></span>{t("cchat.scope")}</div></div>
          <IconBtn icon="x" style={{ marginLeft: "auto" }} onClick={onClose} />
        </div>
        <div className="chat-body" ref={bodyRef} style={{ padding: 20 }}>
          {msgs.map((m, i) => (
            <React.Fragment key={i}>
              <div className={"bubble " + m.role + (m.brand ? " brand" : "")} dangerouslySetInnerHTML={{ __html: m.text }} />
              {m.cite ? (
                <div className="cite">
                  <div className={"mini thumb " + m.cite.thumb}>{m.cite.emoji}</div>
                  <div><div className="t">{L(m.cite.title, lang)}</div><div className="s">{m.cite.domain.toUpperCase()} · {m.cite.readMins}MIN</div></div>
                  <div className="q">{t("chat.cited")}</div>
                </div>
              ) : null}
            </React.Fragment>
          ))}
          {busy ? <div className="typing"><span></span><span></span><span></span></div> : null}
        </div>
        <div className="chat-input" style={{ padding: "14px 20px 18px" }}>
          <div className="wrap">
            <input value={val} onChange={(e) => setVal(e.target.value)} placeholder={t("cchat.placeholder")} onKeyDown={(e) => e.key === "Enter" && ask(val)} />
            <button className="send" onClick={() => ask(val)}><Icon name="arrow-up" size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenReader({ nav, params }) {
  const { lang, t } = useLang();
  const snack = window.snackById(params.id) || window.SNACKS[0];
  const [chat, setChat] = React.useState(false);
  const [read, setRead] = React.useState(false);
  const related = window.relatedFor(snack.id);
  const p = window.PLATFORM[snack.platform];

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 18, gap: 10 }}>
        <Btn variant="ghost" size="sm" icon="arrow-left" onClick={() => nav("library")}>{t("back.feed")}</Btn>
        <div style={{ marginLeft: "auto" }}><StatusPill status="ready" /></div>
      </div>

      <div className="reader">
        <article className="read">
          <div className="tags">
            {snack.tags.map((tg) => <span className="tag" key={tg}>#{tg}</span>)}
            {snack.aiTag ? <span className="tag ai">auto · AI</span> : null}
          </div>
          <h1 className="title">{L(snack.title, lang)}</h1>
          <div className="rmeta">
            <span className={"pill " + p.pill}><Icon name={p.icon} size={12} /> {p.label}</span>
            <span>{snack.author}</span>
            <span>{snack.readMins}{lang === "ko" ? "분" : "min"} · {snack.published}</span>
            <span>· {snack.by}{t("added.by")}</span>
          </div>

          <div className="summary">
            <div className="label"><Icon name="sparkles" size={13} /> {t("read.summary")}</div>
            <p className="one">{L(snack.one, lang)}</p>
            <ul>{snack.keyPoints.map((kp, i) => <li key={i} dangerouslySetInnerHTML={{ __html: L(kp, lang) }} />)}</ul>
          </div>

          <ReaderBody body={snack.body} lang={lang} />
        </article>

        <aside className="side">
          <div className="card soft">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn variant={read ? "ghost" : "primary"} size="sm" icon={read ? "check-circle-2" : "check"} onClick={() => { setRead(true); toast(t("toast.read")); }}>{t("read.read")}</Btn>
              <Btn variant="ghost" size="sm" icon="share-2" onClick={() => { nav("share", { kind: "content", id: snack.id }); }}>{t("share")}</Btn>
              <Btn variant="ghost" size="sm" icon="refresh-cw" onClick={() => toast(lang === "ko" ? "재처리를 시작했어요" : "Reprocessing…")}>{t("read.reprocess")}</Btn>
              <Btn variant="ghost" size="sm" icon="external-link">{t("read.original")}</Btn>
            </div>
            <Btn variant="accent" className="block" icon="sparkles" style={{ marginTop: 12 }} onClick={() => setChat(true)}>{t("read.ask")}</Btn>
          </div>

          <div className="card soft">
            <div className="card-h">{t("read.meta")}</div>
            <div className="metalist">
              <div className="mrow"><span className="mk">{t("read.type")}</span><span className="mv">{snack.type}</span></div>
              <div className="mrow"><span className="mk">{t("read.lang")}</span><span className="mv">{snack.lang.toUpperCase()}</span></div>
              <div className="mrow"><span className="mk">{t("read.author")}</span><span className="mv">{snack.author}</span></div>
              <div className="mrow"><span className="mk">{t("read.published")}</span><span className="mv">{snack.published}</span></div>
              <div className="mrow"><span className="mk">{t("read.entities")}</span><span className="mv">
                {snack.entities.map((e) => <span className="entity" key={e.name}>{e.name}<span className="ty">{e.type}</span></span>)}
              </span></div>
            </div>
          </div>

          <div className="card soft">
            <div className="card-h">{t("read.related")}</div>
            {related.map((r) => (
              <div className="related" key={r.id} onClick={() => nav("reader", { id: r.id })}>
                <div className={"mini thumb " + r.thumb}>{r.emoji}</div>
                <div><div className="t">{L(r.title, lang)}</div><div className="s">{r.domain.toUpperCase()} · {L(r.when, lang)}</div></div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {chat ? <ContentChatPanel snack={snack} onClose={() => setChat(false)} /> : null}
    </div>
  );
}
Object.assign(window, { ScreenReader });
