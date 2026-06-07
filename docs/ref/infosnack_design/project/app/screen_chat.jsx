/* InfoSnack — Global AI chat (C-01): library-wide Graph RAG with citations */

function aiAnswer(text, lang) {
  const k = text.toLowerCase();
  const S = window.snackById;
  if (k.includes("langgraph") || k.includes("에이전트") || k.includes("agent")) {
    return {
      html: lang === "ko"
        ? "이번 주 LangGraph 태그 스낵은 <b>4개</b>예요. 공통 주제는 <b>멀티 에이전트 상태 관리</b>예요:"
        : "There are <b>4</b> LangGraph snacks this week. The common thread is <b>multi-agent state management</b>:",
      bullets: lang === "ko"
        ? ["조건부 엣지로 분기 (진우 · 화)", "Checkpointer로 긴 대화 유지 (수민 · 수)", "Supervisor 패턴 (도윤 · 목)"]
        : ["Branch with conditional edges (Jinwoo · Tue)", "Keep long chats with checkpointers (Sumin · Wed)", "Supervisor pattern (Doyoon · Thu)"],
      cites: [S("s1")],
    };
  }
  if (k.includes("rag") || k.includes("검색") || k.includes("embedding") || k.includes("1536")) {
    return {
      html: lang === "ko"
        ? "검색은 <b>hybrid search → RRF → rerank</b> 순서로 동작해요. 임베딩 기본 차원은 <b>1536</b>인데, pgvector HNSW의 2000차원 제한 때문이에요."
        : "Search runs <b>hybrid → RRF → rerank</b>. The default embedding is <b>1536</b> dims because of pgvector HNSW's 2000-dim cap.",
      cites: [S("s5"), S("s2")],
    };
  }
  if (k.includes("ocr") || k.includes("차트") || k.includes("chart") || k.includes("vision") || k.includes("이미지")) {
    return {
      html: lang === "ko"
        ? "차트·이미지 수치 추출은 <b>Upstage OCR</b>로 전처리한 뒤 Vision 모델로 보강해요. 벤치마크에선 Claude가 평균적으로 더 정확했어요."
        : "Chart/image extraction pre-processes with <b>Upstage OCR</b> then a vision model. In the benchmark, Claude was more accurate on average.",
      cites: [S("s4")],
    };
  }
  return {
    html: lang === "ko"
      ? "저장한 스낵에서 관련 내용을 찾아봤어요. 더 좁히려면 태그나 기간을 알려주세요. 답에는 항상 출처를 달아요."
      : "I searched your saved snacks. Tell me a tag or timeframe to narrow it down — and I always cite sources.",
    cites: [window.SNACKS[0]],
  };
}

function ScreenChat() {
  const { lang, t } = useLang();
  const [msgs, setMsgs] = React.useState([{ role: "ai", brand: true, html: t("chat.intro") }]);
  const [val, setVal] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [msgs, busy]);
  React.useEffect(() => { setMsgs([{ role: "ai", brand: true, html: t("chat.intro") }]); }, [lang]);

  const ask = (text) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", html: text }]);
    setVal(""); setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setMsgs((m) => [...m, { role: "ai", ...aiAnswer(text, lang) }]);
    }, 1200);
  };

  const suggests = lang === "ko"
    ? ["이번 주 LangGraph 글 요약해줘", "왜 임베딩 차원이 1536이야?", "차트 OCR은 어떤 모델이 나아?"]
    : ["Summarize LangGraph this week", "Why is the embedding 1536-dim?", "Which model is better at chart OCR?"];

  return (
    <div className="chatwrap">
      <div className="chat-head">
        <div className="orb"><Icon name="sparkles" size={19} /></div>
        <div>
          <h3>{t("chat.title")}</h3>
          <div className="st"><span className="led" style={{ width: 7, height: 7, borderRadius: 9, background: "var(--success)", display: "inline-block" }}></span> {t("chat.status")}</div>
        </div>
      </div>

      <div className="chat-body" ref={ref}>
        <div className="chat-scroll">
          {msgs.map((m, i) => (
            <React.Fragment key={i}>
              <div className={"bubble " + m.role + (m.brand ? " brand" : "")}>
                <span dangerouslySetInnerHTML={{ __html: m.html }} />
                {m.bullets ? <ul>{m.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul> : null}
              </div>
              {m.cites ? m.cites.map((c) => (
                <div className="cite" key={c.id}>
                  <div className={"mini thumb " + c.thumb}>{c.emoji}</div>
                  <div><div className="t">{L(c.title, lang)}</div><div className="s">{c.domain.toUpperCase()} · {c.readMins}MIN</div></div>
                  <div className="q">{t("chat.cited")}</div>
                </div>
              )) : null}
            </React.Fragment>
          ))}
          {busy ? <div className="typing"><span></span><span></span><span></span></div> : null}
        </div>
      </div>

      <div className="chat-input">
        <div className="inwrap">
          <div className="wrap">
            <input value={val} onChange={(e) => setVal(e.target.value)} placeholder={t("chat.placeholder")} onKeyDown={(e) => e.key === "Enter" && ask(val)} />
            <button className="send" onClick={() => ask(val)}><Icon name="arrow-up" size={16} /></button>
          </div>
          <div className="suggest">
            {suggests.map((s) => <button key={s} onClick={() => ask(s)}>{s}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { ScreenChat });
