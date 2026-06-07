/* InfoSnack — Public share view (P-01): read-only, no auth, type-based */

function ShareContent({ snack, lang, t }) {
  const p = window.PLATFORM[snack.platform];
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 22px 0" }}>
      <article className="read" style={{ border: "3px solid var(--choc-600)", boxShadow: "var(--shadow-sticker)", borderRadius: 24 }}>
        <div className="tags">{snack.tags.map((tg) => <span className="tag" key={tg}>#{tg}</span>)}</div>
        <h1 className="title">{L(snack.title, lang)}</h1>
        <div className="rmeta">
          <span className={"pill " + p.pill}><Icon name={p.icon} size={12} /> {p.label}</span>
          <span>{snack.author}</span><span>{snack.published}</span>
        </div>
        <div className="summary">
          <div className="label"><Icon name="sparkles" size={13} /> {t("read.summary")}</div>
          <p className="one">{L(snack.one, lang)}</p>
          <ul>{snack.keyPoints.map((kp, i) => <li key={i} dangerouslySetInnerHTML={{ __html: L(kp, lang) }} />)}</ul>
        </div>
        <p dangerouslySetInnerHTML={{ __html: L(snack.body[0], lang) }} />
        <hr className="divider" />
        <div className="metalist">
          <div className="mrow"><span className="mk">{t("sh.source")}</span><span className="mv" style={{ color: "var(--sky-600)" }}>{snack.domain}</span></div>
          <div className="mrow"><span className="mk">{t("sh.collected")}</span><span className="mv">{snack.published}</span></div>
        </div>
      </article>
    </div>
  );
}

function ScreenShare({ nav, params }) {
  const { lang, t } = useLang();
  const kind = params.kind || "content";
  const snack = window.snackById(params.id) || window.SNACKS[0];
  const dg = window.DIGESTS.find((d) => d.id === params.id) || window.DIGESTS[0];

  return (
    <div className="share-wrap">
      <div className="share-top">
        <div className="brand"><img src="assets/logo-outline-kr.png" alt="" style={{ height: 24 }} /> InfoSnack</div>
        <div className="ro"><Icon name="lock" size={13} /> {t("readonly")}</div>
        <div style={{ marginLeft: 12 }}><LangToggle /></div>
      </div>

      {kind === "digest"
        ? <div style={{ padding: "32px 22px 0" }}><DigestRender dg={dg} /></div>
        : <ShareContent snack={snack} lang={lang} t={t} />}

      <div className="share-foot">
        <div className="madecard">
          <img src="assets/mascot-snackbag.png" alt="" />
          <div style={{ textAlign: "left" }}>
            <div style={{ fontFamily: "var(--font-display-kr)", fontSize: 20 }}>{t("sh.made")}</div>
            <div className="muted" style={{ fontSize: 13, margin: "4px 0 10px", maxWidth: 280, lineHeight: 1.5 }}>{t("sh.made.sub")}</div>
            <Btn variant="primary" size="sm" icon="cookie" onClick={() => nav("home")}>{t("sh.try")}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { ScreenShare });
