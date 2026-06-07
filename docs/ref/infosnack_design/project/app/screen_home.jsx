/* InfoSnack — Home dashboard (오늘의 스낵) */

function ScreenHome({ nav }) {
  const { lang, t } = useLang();
  const recent = window.SNACKS;
  const trend = window.DIGESTS[0].trends;
  return (
    <div className="page">
      <div className="phead">
        <div>
          <h1>{t("home.title")}</h1>
          <div className="sub">THU · APR 18 · {t("home.greet")}</div>
        </div>
        <div className="acts">
          <Btn variant="ghost" icon="filter">{t("filter")}</Btn>
          <Btn variant="primary" icon="bookmark-plus" onClick={() => nav("capture")}>{t("cta.capture")}</Btn>
        </div>
      </div>

      <div className="statrow" style={{ marginBottom: 26 }}>
        <div className="stat"><div className="n">5</div><div className="l">{t("home.new")}</div></div>
        <div className="stat"><div className="n">12</div><div className="l">{t("lib.unread")}</div></div>
        <div className="stat"><div className="n">32</div><div className="l">{t("home.unwrapped")}</div></div>
        <div className="stat"><div className="n">5</div><div className="l">{t("home.contributors")}</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 22 }}>
        <div className="card sticker" style={{ background: "var(--sky-50)" }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>{t("home.trending")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
            {trend.map((tr) => (
              <div key={tr.rank} className="trend" style={{ borderBottom: "none", padding: 0 }}>
                <div className="rank">{tr.rank}</div>
                <div><div className="t">{L(tr.t, lang)}</div><div className="s">{tr.s}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sectitle">{t("home.recent")}</div>
      <div className="feed">
        {recent.map((s) => <SnackCard key={s.id} snack={s} onOpen={(sn) => nav("reader", { id: sn.id })} />)}
      </div>
    </div>
  );
}
Object.assign(window, { ScreenHome });
