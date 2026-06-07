/* InfoSnack — Library (L-01): search, filters, view toggle, collections panel */

const COLLECTIONS = [
  { id: "c1", name: { ko: "에이전트 아키텍처", en: "Agent architecture" }, count: 14, emoji: "🧩", thumb: "blue" },
  { id: "c2", name: { ko: "RAG 레시피", en: "RAG recipes" }, count: 9, emoji: "🍱", thumb: "green" },
  { id: "c3", name: { ko: "프롬프트 노트", en: "Prompt notes" }, count: 6, emoji: "✍️", thumb: "yellow" },
];

function CollectionPanel({ onClose }) {
  const { lang, t } = useLang();
  return (
    <div className="slideover" onClick={onClose}>
      <div className="scrim"></div>
      <div className="panel" onClick={(e) => e.stopPropagation()}>
        <div className="chat-head">
          <div className="orb" style={{ background: "var(--cookie-400)" }}><Icon name="folder" size={19} style={{ color: "var(--choc-700)" }} /></div>
          <div><h3>{t("lib.manage.coll")}</h3><div className="muted" style={{ fontSize: 12 }}>{t("lib.coll.desc")}</div></div>
          <IconBtn icon="x" style={{ marginLeft: "auto" }} onClick={onClose} />
        </div>
        <div style={{ padding: 22, overflow: "auto", flex: 1 }}>
          {COLLECTIONS.map((c) => (
            <div key={c.id} className="card" style={{ display: "flex", gap: 13, alignItems: "center", marginBottom: 12, padding: 14 }}>
              <div className={"thumb " + c.thumb} style={{ width: 48, height: 48, borderRadius: 12, fontSize: 22 }}>{c.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontFamily: "var(--font-display)" }}>{L(c.name, lang)}</div>
                <div className="muted" style={{ fontSize: 12 }}>{c.count} {t("lib.count")}</div>
              </div>
              <IconBtn icon="more-horizontal" />
            </div>
          ))}
          <Btn variant="accent" className="block" icon="plus" style={{ marginTop: 8 }} onClick={() => toast(lang === "ko" ? "새 컬렉션을 만들었어요" : "New collection created")}>
            {t("lib.newcollection")}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function ScreenLibrary({ nav }) {
  const { lang, t } = useLang();
  const [q, setQ] = React.useState("");
  const [tag, setTag] = React.useState("all");
  const [view, setView] = React.useState("card");
  const [panel, setPanel] = React.useState(false);

  let list = window.SNACKS;
  if (tag !== "all") list = list.filter((s) => s.tags.includes(tag) || s.platform === tag);
  if (q.trim()) {
    const k = q.toLowerCase();
    list = list.filter((s) => (L(s.title, lang) + L(s.summary, lang) + s.tags.join(" ")).toLowerCase().includes(k));
  }

  const chips = [["all", t("all")], ...window.TAGS.slice(0, 3).map((x) => ["#" + x.name, "#" + x.name]), ["thisweek", t("lib.thisweek")], ["youtube", "YouTube"]];

  return (
    <div className="page">
      <div className="phead">
        <div>
          <h1>{t("lib.title")}</h1>
          <div className="sub">{window.SNACKS.length}{lang === "ko" ? "" : " "}{t("lib.count")} · 247 total</div>
        </div>
        <div className="acts">
          <Btn variant="ghost" icon="folder" onClick={() => setPanel(true)}>{t("lib.collections")}</Btn>
          <Btn variant="ghost" icon="check-square">{t("lib.bulk")}</Btn>
          <Btn variant="primary" icon="bookmark-plus" onClick={() => nav("capture")}>{t("cta.capture")}</Btn>
        </div>
      </div>

      <div className="search">
        <Icon name="search" size={18} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("lib.search")} />
        <span className="kbd">⌘ K</span>
      </div>

      <div className="filters">
        {chips.map(([k, lab]) => {
          const key = k.startsWith("#") ? k.slice(1) : k;
          return <span key={k} className={"chip" + (tag === key || (k === "all" && tag === "all") ? " on" : "")}
            onClick={() => setTag(k === "all" ? "all" : key)}>{lab}</span>;
        })}
        <span className="chip" onClick={() => setPanel(true)}>+ {t("lib.collections")}</span>
        <div style={{ marginLeft: "auto" }} className="vtog">
          <button className={view === "card" ? "on" : ""} onClick={() => setView("card")}><Icon name="layout-grid" size={16} /></button>
          <button className={view === "list" ? "on" : ""} onClick={() => setView("list")}><Icon name="list" size={16} /></button>
        </div>
      </div>

      {list.length ? (
        <div className={"feed" + (view === "list" ? " list" : "")}>
          {list.map((s) => <SnackCard key={s.id} snack={s} listView={view === "list"} onOpen={(sn) => nav("reader", { id: sn.id })} />)}
        </div>
      ) : (
        <EmptyState
          title={lang === "ko" ? "부스러기뿐이에요" : "Just crumbs"}
          body={lang === "ko" ? "이 필터에 맞는 스낵이 없어요. 다른 태그를 눌러보거나 새로 담아보세요." : "No snacks match this filter. Try another tag or save a new one."}
          action={<Btn variant="primary" icon="bookmark-plus" onClick={() => nav("capture")}>{t("cta.capture")}</Btn>}
        />
      )}

      {panel ? <CollectionPanel onClose={() => setPanel(false)} /> : null}
    </div>
  );
}
Object.assign(window, { ScreenLibrary, COLLECTIONS });
