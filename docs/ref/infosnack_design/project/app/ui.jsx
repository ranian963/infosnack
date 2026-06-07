/* InfoSnack — shared UI primitives */
const { useEffect, useRef, useState: _useState } = React;

/* Lucide icon — populates a span we own so React/lucide never fight over the node */
function Icon({ name, size = 18, className, style }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`;
    if (window.lucide) window.lucide.createIcons();
  }, [name, size]);
  return React.createElement("span", {
    ref, className: "ic " + (className || ""), "aria-hidden": "true",
    style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, ...(style || {}) },
  });
}

function Btn({ variant = "ghost", size, icon, iconRight, children, className = "", ...rest }) {
  const cls = ["btn", variant, size ? size : "", className].filter(Boolean).join(" ");
  return (
    <button className={cls} {...rest}>
      {icon ? <Icon name={icon} size={size === "sm" ? 14 : 16} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={size === "sm" ? 14 : 16} /> : null}
    </button>
  );
}

function IconBtn({ icon, size = 18, className = "", ...rest }) {
  return <button className={"btn ghost iconbtn " + className} {...rest}><Icon name={icon} size={size} /></button>;
}

function Tag({ children, ai, plain, onClick }) {
  return <span className={"tag" + (ai ? " ai" : "") + (plain ? " plain" : "")} onClick={onClick}>{children}</span>;
}

function PlatformPill({ platform }) {
  const p = window.PLATFORM[platform] || window.PLATFORM.blog;
  return <span className={"pill " + p.pill}><Icon name={p.icon} size={12} /> {p.label}</span>;
}

function Avatar({ name, sm }) {
  return <div className={"avatar" + (sm ? " sm" : "")}>{(name || "?").slice(0, 1)}</div>;
}

function StatusPill({ status }) {
  const { t } = useLang();
  const map = {
    ready:   ["ready", "준비됨", "Ready"],
    proc:    ["proc", "처리 중", "Processing"],
    review:  ["review", "확인 필요", "Needs review"],
    failed:  ["failed", "실패", "Failed"],
    paused:  ["paused", "일시중지", "Paused"],
  };
  const { lang } = useLang();
  const m = map[status] || map.ready;
  return <span className={"status " + m[0]}><span className="led"></span>{lang === "ko" ? m[1] : m[2]}</span>;
}

/* Gradient thumbnail with emoji (+ optional overlay children) */
function Thumb({ thumb, emoji, className = "", style, children }) {
  return <div className={"thumb " + thumb + " " + className} style={style}>{children}{emoji}</div>;
}

/* Snack card (feed + lists) */
function SnackCard({ snack, onOpen, listView }) {
  const { lang, t } = useLang();
  const cls = "snack" + (snack.featured && !listView ? " featured" : "") + (listView ? " row" : "");
  return (
    <div className={cls} onClick={() => onOpen && onOpen(snack)}>
      <Thumb thumb={snack.thumb} emoji={snack.emoji} style={{ height: listView ? undefined : 142 }}>
        <span className="platform"><PlatformPill platform={snack.platform} /></span>
        {snack.unread ? <span className="unread"></span> : null}
      </Thumb>
      <div className="body">
        <div className="tags">
          {snack.tags.slice(0, 2).map((tg) => <span className="tag" key={tg}>#{tg}</span>)}
          {snack.aiTag ? <span className="tag ai">auto · AI</span> : null}
        </div>
        <h3>{L(snack.title, lang)}</h3>
        <p>{L(snack.summary, lang)}</p>
        <div className="meta">
          <span>{L(snack.when, lang)} · {snack.by}{lang === "ko" ? t("added.by") : " " + t("added.by")}</span>
          <span>{snack.readMins}{lang === "ko" ? "분" : "m"}</span>
        </div>
      </div>
    </div>
  );
}

/* Thumb wrapper for cards needs children (platform pill etc.) */
function ThumbBox({ thumb, emoji, height, children }) {
  return <div className={"thumb " + thumb} style={{ height }}>{children}{emoji}</div>;
}

function EmptyState({ title, body, action }) {
  return (
    <div className="empty">
      <img src="assets/mascot-snackbag.png" alt="" />
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  );
}

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="langtog">
      <button className={lang === "ko" ? "on" : ""} onClick={() => setLang("ko")}>KO</button>
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
    </div>
  );
}

/* Toast host via tiny event bus */
const _toastBus = { fn: null };
function toast(msg) { if (_toastBus.fn) _toastBus.fn(msg); }
function ToastHost() {
  const [msg, setMsg] = _useState(null);
  useEffect(() => {
    _toastBus.fn = (m) => { setMsg(m); setTimeout(() => setMsg(null), 2400); };
    return () => { _toastBus.fn = null; };
  }, []);
  if (!msg) return null;
  return <div className="toast"><Icon name="check-circle-2" size={17} />{msg}</div>;
}

Object.assign(window, {
  Icon, Btn, IconBtn, Tag, PlatformPill, Avatar, StatusPill, Thumb, ThumbBox,
  SnackCard, EmptyState, LangToggle, ToastHost, toast,
});
