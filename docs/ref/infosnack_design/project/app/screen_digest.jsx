/* InfoSnack — Digests: list (D-01), detail (D-02), curation editor (D-03) */

function DigestRender({ dg }) {
  const { lang, t } = useLang();
  const picks = dg.picks.map(window.snackById).filter(Boolean);
  return (
    <div className="digest">
      <div className="dhead">
        <img src="assets/logo-cookie-kr.jpg" className="logo" alt="" />
        <div className="lbl">weekly digest · {dg.vol}</div>
        <h1>{L(dg.title, lang)}</h1>
        <p className="when">{dg.range} · {L(dg.team, lang)}</p>
        <div className="chips">
          {dg.stats.map((s, i) => <div className="stat" key={i}><div className="n">{s.n}</div><div className="l">{L(s.l, lang)}</div></div>)}
        </div>
      </div>

      <div className="dsection">
        <h2><Icon name="trending-up" size={21} /> {t("dg.trend")}</h2>
        {dg.trends.map((tr) => (
          <div className="trend" key={tr.rank}>
            <div className="rank">{tr.rank}</div>
            <div><div className="t">{L(tr.t, lang)}</div><div className="s">{tr.s}</div></div>
          </div>
        ))}
      </div>

      <div className="dsection">
        <h2><Icon name="star" size={21} /> {t("dg.picks")}</h2>
        <p className="intro">{t("dg.picks.intro")}</p>
        {picks.map((p) => (
          <div className="pick" key={p.id}>
            <div className={"pthumb thumb " + p.thumb}>{p.emoji}</div>
            <div>
              <h3>{L(p.title, lang)}</h3>
              <p>{L(p.summary, lang)}</p>
              <div className="pm">{p.domain.toUpperCase()} · {p.readMins}MIN · {p.by}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dsection">
        <h2><Icon name="message-square-heart" size={21} /> {t("dg.discuss")}</h2>
        <div className="discuss">
          <div className="lbl">discussion topic</div>
          <p>{L(dg.discuss, lang)}</p>
        </div>
      </div>

      <div className="dcta">
        <Btn variant="primary" iconRight="arrow-right">{t("dg.viewall")}</Btn>
      </div>
    </div>
  );
}

function ScreenDigests({ nav }) {
  const { lang, t } = useLang();
  return (
    <div className="page">
      <div className="phead">
        <div><h1>{t("dg.title")}</h1><div className="sub" style={{ fontFamily: "var(--font-body)", color: "var(--gray)" }}>{t("dg.sub")}</div></div>
      </div>
      <div className="sectitle" style={{ marginTop: 0 }}>{t("dg.list")}</div>
      <div className="dlist">
        {window.DIGESTS.map((dg) => (
          <div className="dcard" key={dg.id} onClick={() => nav(dg.status === "draft" ? "digestEdit" : "digest", { id: dg.id })}>
            <div className="top"><span className="vol">{dg.vol}</span></div>
            <div className="dc-body">
              <h3>{L(dg.title, lang)}</h3>
              <div className="dc-when">{dg.range}</div>
              <div className="dc-foot">
                <span className={"badge " + (dg.status === "published" ? "pub" : "draft")}>{dg.status === "published" ? t("dg.published") : t("dg.draft")}</span>
                {dg.isNew ? <span className="badge new">NEW</span> : null}
                <span className="muted" style={{ marginLeft: "auto", fontSize: 12 }}>{dg.stats[0].n} {L(dg.stats[0].l, lang)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenDigestDetail({ nav, params }) {
  const { lang, t } = useLang();
  const dg = window.DIGESTS.find((d) => d.id === params.id) || window.DIGESTS[0];
  const draft = dg.status === "draft";
  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 18, gap: 10, maxWidth: 720, margin: "0 auto 18px" }}>
        <Btn variant="ghost" size="sm" icon="arrow-left" onClick={() => nav("digests")}>{t("dg.list")}</Btn>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {draft ? (
            <>
              <Btn variant="ghost" size="sm" icon="pencil" onClick={() => nav("digestEdit", { id: dg.id })}>{t("dg.curate")}</Btn>
              <Btn variant="primary" size="sm" icon="send" onClick={() => { toast(t("toast.published")); nav("digests"); }}>{t("dg.publish")}</Btn>
            </>
          ) : (
            <Btn variant="primary" size="sm" icon="share-2" onClick={() => nav("share", { kind: "digest", id: dg.id })}>{t("share")}</Btn>
          )}
        </div>
      </div>
      <DigestRender dg={dg} />
    </div>
  );
}

function ScreenDigestCuration({ nav, params }) {
  const { lang, t } = useLang();
  const dg = window.DIGESTS.find((d) => d.id === params.id) || window.DIGESTS[2];
  const [items, setItems] = React.useState(() => window.CURATION.map((c) => ({ ...c, note: c.note ? L(c.note, lang) : "" })));
  const includedN = items.filter((i) => i.included).length;

  const toggle = (id) => setItems((x) => x.map((i) => i.id === id ? { ...i, included: !i.included } : i));
  const setNote = (id, v) => setItems((x) => x.map((i) => i.id === id ? { ...i, note: v } : i));
  const move = (idx, dir) => setItems((x) => {
    const n = [...x]; const j = idx + dir;
    if (j < 0 || j >= n.length) return x;
    [n[idx], n[j]] = [n[j], n[idx]]; return n;
  });

  return (
    <div className="page narrow">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 14, gap: 10 }}>
        <Btn variant="ghost" size="sm" icon="arrow-left" onClick={() => nav("digest", { id: dg.id })}>{t("back")}</Btn>
      </div>
      <div className="phead">
        <div>
          <div className="eyebrow">{dg.vol} · {dg.range}</div>
          <h1 style={{ marginTop: 6 }}>{t("cur.title")}</h1>
          <div className="sub" style={{ fontFamily: "var(--font-body)", color: "var(--gray)", marginTop: 8 }}>{t("cur.sub")}</div>
        </div>
      </div>

      {items.map((it, idx) => {
        const s = window.snackById(it.id);
        return (
          <div className={"curitem" + (it.included ? "" : " excluded")} key={it.id}>
            <div className="grip" style={{ flexDirection: "column", gap: 2 }}>
              <button className="btn ghost iconbtn" style={{ width: 24, height: 22, borderRadius: 7 }} onClick={() => move(idx, -1)}><Icon name="chevron-up" size={14} /></button>
              <button className="btn ghost iconbtn" style={{ width: 24, height: 22, borderRadius: 7 }} onClick={() => move(idx, 1)}><Icon name="chevron-down" size={14} /></button>
            </div>
            <div className={"cthumb thumb " + s.thumb}>{s.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <h3 style={{ margin: 0 }}>{L(s.title, lang)}</h3>
                {it.aiPick ? <span className="tag ai" style={{ flexShrink: 0 }}>{t("cur.aipick")}</span> : null}
              </div>
              <p>{L(s.summary, lang)}</p>
              <input className="cnote" value={it.note} onChange={(e) => setNote(it.id, e.target.value)} placeholder={t("cur.note.ph")} />
            </div>
            <div className="cact">
              <button className={"toggle" + (it.included ? " on" : "")} onClick={() => toggle(it.id)} title={t("cur.include")}></button>
              <span className="muted" style={{ fontSize: 10, fontWeight: 800 }}>{it.included ? t("cur.include") : "—"}</span>
            </div>
          </div>
        );
      })}

      <div className="card sticker" style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18, position: "sticky", bottom: 12 }}>
        <div style={{ fontFamily: "var(--font-display-kr)", fontSize: 18 }}>
          <b style={{ color: "var(--sky-600)" }}>{includedN}</b>{lang === "ko" ? "개 포함" : " " + t("cur.included.n")}
        </div>
        <Btn variant="primary" icon="send" style={{ marginLeft: "auto" }} onClick={() => { toast(t("toast.published")); nav("digest", { id: dg.id }); }}>{t("cur.confirm")}</Btn>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenDigests, ScreenDigestDetail, ScreenDigestCuration, DigestRender });
