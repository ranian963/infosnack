/* InfoSnack — App shell: sidebar, mobile drawer, brand */

function Sidebar({ active, onNav, onClose }) {
  const { t } = useLang();
  const NAV = [
    { key: "home", icon: "home", label: t("nav.home") },
    { key: "library", icon: "library", label: t("nav.library"), count: 247 },
    { key: "capture", icon: "bookmark-plus", label: t("nav.capture") },
    { key: "sources", icon: "rss", label: t("nav.sources"), count: 5 },
    { key: "digests", icon: "newspaper", label: t("nav.digests") },
    { key: "chat", icon: "message-circle", label: t("nav.chat") },
  ];
  const SOFT = [
    { key: "search", icon: "search", label: t("nav.search") },
    { key: "admin", icon: "wrench", label: t("nav.admin") },
    { key: "settings", icon: "settings", label: t("nav.settings") },
  ];
  const go = (key, routable) => {
    if (!routable) { toast("이 화면은 이번 갤러리 범위 밖이에요 🍪"); return; }
    onNav(key); onClose && onClose();
  };
  return (
    <aside className="nav">
      <div className="brand" onClick={() => go("home", true)}>
        <img src="assets/logo-outline-kr.png" alt="" /> InfoSnack
      </div>
      <Btn variant="primary" className="cap-btn" icon="bookmark-plus" onClick={() => go("capture", true)}>
        {t("cta.capture")}
      </Btn>
      {NAV.map((n) => (
        <button key={n.key} className={"navbtn" + (active === n.key ? " active" : "")} onClick={() => go(n.key, true)}>
          <Icon name={n.icon} size={18} /> {n.label}
          {n.count ? <span className="count">{n.count}</span> : null}
        </button>
      ))}

      <div className="sec-label">{t("nav.tags")}</div>
      <div className="tag-list">
        {window.TAGS.slice(0, 5).map((tag) => (
          <div className="tag-row" key={tag.name} onClick={() => go("library", true)}>
            <span className="dot" style={{ background: tag.color }}></span>{tag.name}
            <span className="n">{tag.count}</span>
          </div>
        ))}
      </div>

      <div className="sec-label">{t("nav.platforms")}</div>
      <div className="tag-list">
        {window.PLATFORMS_NAV.map((p) => (
          <div className="tag-row" key={p} onClick={() => go("library", true)}>
            <Icon name={window.PLATFORM[p].icon} size={14} /> {window.PLATFORM[p].label}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto" }}>
        {SOFT.map((n) => (
          <button key={n.key} className="navbtn" style={{ opacity: .55 }} onClick={() => go(n.key, false)}>
            <Icon name={n.icon} size={18} /> {n.label}
          </button>
        ))}
      </div>

      <div className="me" onClick={() => go("settings", false)}>
        <Avatar name="진" />
        <div className="who">
          <div className="n">진우</div>
          <div className="r">AI Agent 팀 · member</div>
        </div>
        <div style={{ marginLeft: "auto" }}><LangToggle /></div>
      </div>
    </aside>
  );
}

function AppShell({ active, onNav, bare, children }) {
  const [drawer, setDrawer] = React.useState(false);
  const { t } = useLang();
  return (
    <div className={"app"}>
      <Sidebar active={active} onNav={onNav} />
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, height: "100vh" }}>
        <div className="mtop">
          <div className="brand" onClick={() => onNav("home")}>
            <img src="assets/logo-outline-kr.png" alt="" style={{ height: 24 }} /> InfoSnack
          </div>
          <div className="ham" style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <LangToggle />
            <IconBtn icon="menu" onClick={() => setDrawer(true)} />
          </div>
        </div>
        {bare
          ? <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
          : <div className="surface" style={{ flex: 1 }}>{children}</div>}
      </div>
      {drawer ? (
        <div className="drawer" onClick={() => setDrawer(false)}>
          <div className="scrim"></div>
          <div onClick={(e) => e.stopPropagation()}>
            <Sidebar active={active} onNav={onNav} onClose={() => setDrawer(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

Object.assign(window, { Sidebar, AppShell });
