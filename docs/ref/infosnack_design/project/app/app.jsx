/* InfoSnack — Router + mount. Hash-deep-linkable for the gallery launcher. */

const SHELL_ACTIVE = {
  home: "home", library: "library", reader: "library", capture: "capture",
  sources: "sources", sourceNew: "sources", sourceDetail: "sources",
  digests: "digests", digest: "digests", digestEdit: "digests", chat: "chat",
};

function parseHash() {
  const h = (window.location.hash || "").replace(/^#\/?/, "");
  if (!h) return { route: "home", params: {} };
  const seg = h.split("/");
  const route = seg[0];
  if (route === "share") return { route: "share", params: { kind: seg[1] || "content", id: seg[2] || "s1" } };
  if (["reader", "digest", "digestEdit", "sourceDetail"].includes(route)) return { route, params: { id: seg[1] } };
  return { route, params: {} };
}
function formatHash(route, params) {
  if (route === "share") return `#share/${params.kind || "content"}/${params.id || "s1"}`;
  if (["reader", "digest", "digestEdit", "sourceDetail"].includes(route) && params.id) return `#${route}/${params.id}`;
  return `#${route}`;
}

function App() {
  const [{ route, params }, setState] = React.useState(() => parseHash());

  const nav = React.useCallback((r, p = {}) => {
    window.location.hash = formatHash(r, p);
  }, []);

  React.useEffect(() => {
    const onHash = () => setState(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  React.useEffect(() => {
    const el = document.querySelector(".surface");
    if (el) el.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [route, params.id, params.kind]);

  // Public share is full-screen (no auth chrome)
  if (route === "share") return <ScreenShare nav={nav} params={params} />;

  let screen = null;
  if (route === "home") screen = <ScreenHome nav={nav} />;
  else if (route === "library") screen = <ScreenLibrary nav={nav} />;
  else if (route === "reader") screen = <ScreenReader nav={nav} params={params} />;
  else if (route === "capture") screen = <ScreenCapture nav={nav} />;
  else if (route === "sources") screen = <ScreenSources nav={nav} />;
  else if (route === "sourceNew") screen = <SourceWizard nav={nav} />;
  else if (route === "sourceDetail") screen = <ScreenSourceDetail nav={nav} params={params} />;
  else if (route === "digests") screen = <ScreenDigests nav={nav} />;
  else if (route === "digest") screen = <ScreenDigestDetail nav={nav} params={params} />;
  else if (route === "digestEdit") screen = <ScreenDigestCuration nav={nav} params={params} />;
  else if (route === "chat") screen = <ScreenChat />;
  else screen = <ScreenHome nav={nav} />;

  const bare = route === "chat";
  return (
    <AppShell active={SHELL_ACTIVE[route] || "home"} onNav={nav} bare={bare}>
      {screen}
    </AppShell>
  );
}

function Root() {
  return (
    <LangProvider>
      <App />
      <ToastHost />
    </LangProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
