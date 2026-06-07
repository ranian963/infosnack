/* InfoSnack — mock data (bilingual). Content reads via L(obj, lang). */

const PLATFORM = {
  youtube:  { label: "YouTube",  pill: "yt",   icon: "play",      thumb: "pink",   emoji: "🎥" },
  x:        { label: "X",        pill: "x",    icon: "at-sign",   thumb: "purple", emoji: "💬" },
  linkedin: { label: "LinkedIn", pill: "in",   icon: "briefcase", thumb: "blue",   emoji: "💼" },
  reddit:   { label: "Reddit",   pill: "rd",   icon: "message-square", thumb: "green", emoji: "🔧" },
  blog:     { label: "Blog",     pill: "blog", icon: "file-text", thumb: "yellow", emoji: "🧠" },
  pdf:      { label: "PDF",      pill: "pdf",  icon: "file",      thumb: "purple", emoji: "📄" },
  arxiv:    { label: "arXiv",    pill: "pdf",  icon: "graduation-cap", thumb: "purple", emoji: "📑" },
};

const TAGS = [
  { name: "AI-Agent",    color: "#18AEF6", count: 42 },
  { name: "LangGraph",   color: "#FBDB5B", count: 28 },
  { name: "RAG",         color: "#2FB56A", count: 19 },
  { name: "Vision AI",   color: "#E54B4B", count: 14 },
  { name: "Prompt Eng.", color: "#776C34", count: 11 },
  { name: "pgvector",    color: "#7A36C9", count: 7 },
];

const PLATFORMS_NAV = ["youtube", "x", "linkedin", "reddit"];

const SNACKS = [
  {
    id: "s1", platform: "youtube", thumb: "pink", emoji: "🎥", unread: true, featured: true,
    domain: "youtube.com", readMins: 12, type: "video", lang: "ko", status: "ready",
    author: "Harrison Chase", published: "2026.04.16", when: { ko: "2분 전", en: "2m ago" }, by: "진우",
    tags: ["AI-Agent", "LangGraph"],
    title: { ko: "상태 머신으로 멀티 에이전트 조립하기", en: "Assembling multi-agent systems as state machines" },
    summary: { ko: "LangGraph의 그래프 기반 에이전트 워크플로우 튜토리얼. 조건부 엣지 활용법.", en: "A tutorial on LangGraph's graph-based agent workflows and conditional edges." },
    one: { ko: "LangGraph는 에이전트를 노드+엣지의 상태 머신으로 모델링해요.", en: "LangGraph models agents as a node+edge state machine." },
    keyPoints: [
      { ko: "에이전트를 <b>노드 + 엣지</b>의 상태 머신으로 모델링해요.", en: "Model agents as a <b>node + edge</b> state machine." },
      { ko: "조건부 엣지로 분기 로직을 선언적으로 작성.", en: "Declare branching with conditional edges." },
      { ko: "Checkpointer로 긴 대화도 중단/재개 가능.", en: "Checkpointers let long chats pause and resume." },
    ],
    entities: [
      { name: "LangGraph", type: "product" }, { name: "Harrison Chase", type: "person" },
      { name: "LangChain", type: "org" }, { name: "Checkpointer", type: "concept" },
    ],
    body: [
      { t: "p", ko: "기존 LangChain의 Agent 구조는 \"도구를 고르고 → 실행하고 → 결과로 다시 고른다\"의 단순 ReAct 루프였어요. 멀티 에이전트로 넘어가면 금세 흐름이 복잡해지는데, LangGraph는 이걸 <b>그래프</b>로 풀어요.", en: "LangChain's classic agent was a simple ReAct loop: pick a tool, run it, decide again. Multi-agent flows get tangled fast — LangGraph untangles them as a <b>graph</b>." },
      { t: "h2", ko: "상태 머신이란", en: "What is a state machine" },
      { t: "p", ko: "각 에이전트는 노드가 되고, 노드 간 조건은 엣지가 됩니다. 공유 상태(state)는 TypedDict로 정의해요. 흐름이 코드가 아니라 <b>데이터</b>로 표현된다는 게 핵심이에요.", en: "Each agent becomes a node; conditions between them become edges. Shared state is a TypedDict. The flow is expressed as <b>data</b>, not code." },
      { t: "fig", thumb: "blue", emoji: "🧠", ocr: true, ko: "다이어그램: Supervisor 노드에서 Researcher / Coder / Writer 노드로 분기. 각 하위 에이전트 결과는 Supervisor로 다시 수렴.", en: "Diagram: a Supervisor node branches to Researcher / Coder / Writer; each sub-agent's result converges back to the Supervisor." },
      { t: "quote", ko: "\"그래프로 그리면, 팀이 그림만 보고도 에이전트 흐름을 이해할 수 있어요.\"", en: "\"Drawn as a graph, the team understands the agent flow from the picture alone.\"" },
      { t: "h2", ko: "조건부 엣지", en: "Conditional edges" },
      { t: "p", ko: "일반 엣지는 항상 다음 노드로 가지만, 조건부 엣지는 함수의 반환값에 따라 분기해요. \"도구 결과에 따라 다른 에이전트 호출\" 같은 게 깨끗하게 표현됩니다.", en: "A normal edge always advances; a conditional edge branches on a function's return value. \"Call a different agent depending on a tool result\" stays clean." },
    ],
  },
  {
    id: "s2", platform: "blog", thumb: "yellow", emoji: "🧠", unread: false,
    domain: "medium.com", readMins: 6, type: "article", lang: "ko", status: "ready",
    author: "Jina Kim", published: "2026.04.15", when: { ko: "어제", en: "yesterday" }, by: "수민",
    tags: ["RAG", "pgvector"], aiTag: true,
    title: { ko: "Graph RAG vs 일반 RAG: 언제 무엇을 써야 할까", en: "Graph RAG vs plain RAG: when to use which" },
    summary: { ko: "멀티홉 질의에서 Graph RAG가 유리한 이유와 구현 복잡도 tradeoff.", en: "Why Graph RAG wins on multi-hop queries, and the complexity tradeoff." },
    one: { ko: "멀티홉 질의엔 Graph RAG, 단순 검색엔 일반 RAG가 충분해요.", en: "Graph RAG for multi-hop; plain RAG is plenty for simple lookups." },
    keyPoints: [
      { ko: "엔티티 관계가 중요한 질문일수록 Graph RAG가 유리해요.", en: "The more entity relationships matter, the more Graph RAG helps." },
      { ko: "일반 RAG는 구축이 단순하고 대부분의 검색에 충분해요.", en: "Plain RAG is simpler to build and enough for most search." },
      { ko: "pgvector의 1536차원이면 초기 규모엔 충분해요.", en: "pgvector at 1536 dims is plenty for early scale." },
    ],
    entities: [ { name: "Graph RAG", type: "concept" }, { name: "pgvector", type: "product" }, { name: "RRF", type: "concept" } ],
    body: [
      { t: "p", ko: "RAG는 검색해서 붙여주는 게 전부지만, 질문이 여러 단계를 거치면 단순 벡터 검색만으로는 답이 흩어져요. Graph RAG는 엔티티와 관계를 그래프로 묶어 멀티홉 추론을 돕습니다.", en: "RAG just retrieves and appends — but multi-step questions scatter across chunks. Graph RAG ties entities and relations into a graph to support multi-hop reasoning." },
      { t: "h2", ko: "언제 일반 RAG로 충분한가", en: "When plain RAG is enough" },
      { t: "p", ko: "\"이 문서 요약해줘\" 같은 단일 출처 질의는 hybrid search + rerank로 충분해요. 굳이 그래프를 만들 필요가 없습니다.", en: "Single-source asks like \"summarize this\" are handled by hybrid search + rerank. No graph needed." },
    ],
  },
  {
    id: "s3", platform: "x", thumb: "purple", emoji: "💬", unread: false,
    domain: "x.com", readMins: 2, type: "note", lang: "ko", status: "ready",
    author: "@anthropiceng", published: "2026.04.14", when: { ko: "2일 전", en: "2d ago" }, by: "도윤",
    tags: ["Prompt Eng."],
    title: { ko: "\"시스템 프롬프트에 역할 대신 목표를 적으세요\"", en: "\"Write goals, not roles, in your system prompt\"" },
    summary: { ko: "Anthropic 엔지니어의 스레드 — 실전 prompt 튜닝 팁 7개.", en: "An Anthropic engineer's thread — 7 practical prompt-tuning tips." },
    one: { ko: "역할 부여보다 명확한 목표 서술이 더 잘 작동해요.", en: "Stating a clear goal beats assigning a role." },
    keyPoints: [
      { ko: "\"너는 전문가야\"보다 \"이걸 달성해\"가 더 안정적.", en: "\"Achieve this\" is steadier than \"you are an expert\"." },
      { ko: "예시는 2~3개면 충분, 너무 많으면 과적합.", en: "2–3 examples is enough; more overfits." },
    ],
    entities: [ { name: "Anthropic", type: "org" }, { name: "Claude", type: "product" } ],
    body: [
      { t: "p", ko: "역할(role)을 부여하면 모델이 페르소나를 연기하느라 정작 과업을 놓치곤 해요. 목표(goal)를 직접 적으면 출력이 더 일관됩니다.", en: "Assigning a role makes the model act a persona and miss the task. Stating the goal directly yields more consistent output." },
    ],
  },
  {
    id: "s4", platform: "reddit", thumb: "green", emoji: "🔧", unread: false,
    domain: "reddit.com", readMins: 5, type: "article", lang: "en", status: "ready",
    author: "r/LocalLLaMA", published: "2026.04.13", when: { ko: "3일 전", en: "3d ago" }, by: "진우",
    tags: ["Vision AI", "OCR"], aiTag: true,
    title: { ko: "차트 이미지에서 수치 뽑아내기 — GPT-4V vs Claude", en: "Pulling numbers from chart images — GPT-4V vs Claude" },
    summary: { ko: "인포그래픽·차트 추출 비교 벤치마크. 데이터 시각화 이해도에서 Claude가 앞섬.", en: "A benchmark on chart extraction; Claude leads on data-viz comprehension." },
    one: { ko: "차트 수치 추출은 Claude가 평균적으로 더 정확했어요.", en: "Claude was more accurate at extracting chart values on average." },
    keyPoints: [
      { ko: "막대·선 그래프 수치 추출 정확도에서 Claude 우위.", en: "Claude led on bar/line chart value accuracy." },
      { ko: "OCR은 Upstage Document OCR로 전처리하면 더 안정적.", en: "Pre-processing with Upstage Document OCR was steadier." },
    ],
    entities: [ { name: "GPT-4V", type: "product" }, { name: "Claude", type: "product" }, { name: "Upstage", type: "org" } ],
    body: [
      { t: "p", ko: "차트 이미지는 OCR만으로는 부족하고 시각적 관계 이해가 필요해요. 두 모델을 동일 프롬프트로 비교했습니다.", en: "Chart images need visual reasoning beyond OCR. We compared both models on identical prompts." },
      { t: "fig", thumb: "green", emoji: "📊", ocr: true, ko: "막대그래프 OCR 결과: 2024 Q1 42% / Q2 51% / Q3 63% — Claude가 세 값 모두 정확히 추출.", en: "Bar chart OCR: 2024 Q1 42% / Q2 51% / Q3 63% — Claude extracted all three correctly." },
    ],
  },
  {
    id: "s5", platform: "arxiv", thumb: "purple", emoji: "📑", unread: true,
    domain: "arxiv.org", readMins: 18, type: "paper", lang: "en", status: "ready",
    author: "Qwen Team", published: "2026.03.28", when: { ko: "4일 전", en: "4d ago" }, by: "수민",
    tags: ["RAG", "pgvector"],
    title: { ko: "Qwen3 Embedding: 차원 축소가 검색 품질에 미치는 영향", en: "Qwen3 Embedding: how dimension reduction affects retrieval" },
    summary: { ko: "8B 임베딩을 1536차원으로 줄여도 검색 품질이 거의 유지된다는 실험.", en: "Reducing the 8B embedding to 1536 dims keeps retrieval quality nearly intact." },
    one: { ko: "1536차원이면 pgvector HNSW에서 안전하고 품질 손실도 적어요.", en: "1536 dims is safe for pgvector HNSW with little quality loss." },
    keyPoints: [
      { ko: "pgvector의 HNSW는 2000차원 제한이 있어 1536을 권장.", en: "pgvector HNSW caps at 2000 dims, so 1536 is recommended." },
      { ko: "4096차원은 halfvec나 별도 vector DB가 필요.", en: "4096 dims needs halfvec or a separate vector DB." },
    ],
    entities: [ { name: "Qwen3", type: "product" }, { name: "pgvector", type: "product" }, { name: "HNSW", type: "concept" } ],
    body: [
      { t: "p", ko: "임베딩 차원이 높을수록 표현력은 좋지만 인덱스 빌드와 메모리 비용이 커져요. 이 논문은 1536차원이 비용 대비 품질의 sweet spot임을 보입니다.", en: "Higher dimensions express more but cost index-build time and memory. This paper shows 1536 dims is the cost/quality sweet spot." },
    ],
  },
  {
    id: "s6", platform: "linkedin", thumb: "blue", emoji: "💼", unread: false,
    domain: "linkedin.com", readMins: 4, type: "article", lang: "ko", status: "ready",
    author: "박성호", published: "2026.04.12", when: { ko: "5일 전", en: "5d ago" }, by: "도윤",
    tags: ["AI-Agent"],
    title: { ko: "사내 지식 검색을 챗봇으로 바꾼 6개월 회고", en: "Six months of replacing internal search with a chatbot" },
    summary: { ko: "팀 위키 검색을 RAG 챗봇으로 옮기며 배운 운영 교훈.", en: "Ops lessons from moving team-wiki search to a RAG chatbot." },
    one: { ko: "검색을 챗봇으로 바꾸니 \"원문 인용\"이 신뢰의 핵심이었어요.", en: "Citing the source was the key to trust after switching to chat." },
    keyPoints: [
      { ko: "citation 없는 답은 팀이 신뢰하지 않았어요.", en: "Answers without citations weren't trusted." },
      { ko: "권한 필터를 검색 단계에서 적용해야 안전해요.", en: "Apply permission filters at the retrieval stage." },
    ],
    entities: [ { name: "RAG", type: "concept" }, { name: "Confluence", type: "product" } ],
    body: [
      { t: "p", ko: "처음엔 답변 품질만 신경 썼지만, 팀이 실제로 쓰게 된 결정타는 \"이 답이 어디서 나왔는지\" 항상 보여준 거였어요.", en: "We obsessed over answer quality first, but what made the team adopt it was always showing where each answer came from." },
    ],
  },
];

// related snacks for reader side
function relatedFor(id) {
  return SNACKS.filter((s) => s.id !== id).slice(0, 3);
}

// ---------- Digests ----------
const DIGESTS = [
  {
    id: "d12", vol: "vol.12", status: "published", isNew: true,
    title: { ko: "이번 주 스낵 모음", en: "This week's snacks" },
    range: "APR 14 – APR 18", team: { ko: "AI Agent 팀", en: "AI Agent team" },
    stats: [
      { n: 32, l: { ko: "수집된 스낵", en: "snacks" } },
      { n: 5, l: { ko: "팀원 참여", en: "contributors" } },
      { n: 8, l: { ko: "새 태그", en: "new tags" } },
    ],
    trends: [
      { rank: "01", t: { ko: "LangGraph 상태 머신 패턴", en: "LangGraph state-machine patterns" }, s: "4 SNACKS · MENTIONED 11×" },
      { rank: "02", t: { ko: "Graph RAG 아키텍처", en: "Graph RAG architecture" }, s: "3 SNACKS · MENTIONED 9×" },
      { rank: "03", t: { ko: "Vision AI로 차트 분석", en: "Vision AI for charts" }, s: "3 SNACKS · MENTIONED 7×" },
    ],
    picks: ["s1", "s2", "s4"],
    discuss: { ko: "우리 에이전트에도 LangGraph의 checkpointer 패턴이 필요할까? 긴 대화 유지가 실제 우리 유즈케이스에 있나?", en: "Does our agent need LangGraph's checkpointer pattern? Do we actually have long-conversation use cases?" },
  },
  {
    id: "d11", vol: "vol.11", status: "published", isNew: false,
    title: { ko: "지난 주 스낵 모음", en: "Last week's snacks" },
    range: "APR 7 – APR 11", team: { ko: "AI Agent 팀", en: "AI Agent team" },
    stats: [ { n: 28, l: { ko: "수집된 스낵", en: "snacks" } }, { n: 4, l: { ko: "팀원 참여", en: "contributors" } }, { n: 6, l: { ko: "새 태그", en: "new tags" } } ],
    trends: [
      { rank: "01", t: { ko: "pgvector 차원 결정", en: "pgvector dimension choices" }, s: "3 SNACKS · MENTIONED 8×" },
      { rank: "02", t: { ko: "프롬프트 인젝션 방어", en: "Prompt-injection defense" }, s: "2 SNACKS · MENTIONED 5×" },
    ],
    picks: ["s5", "s3"],
    discuss: { ko: "임베딩 모델을 바꾸면 전체 재색인이 필요한데, blue/green 인덱스 전략을 미리 정해둘까요?", en: "Swapping the embedding model needs a full re-index — should we pre-decide a blue/green index strategy?" },
  },
  {
    id: "d13", vol: "vol.13", status: "draft", isNew: false,
    title: { ko: "이번 주 스낵 모음 (초안)", en: "This week (draft)" },
    range: "APR 21 – APR 25", team: { ko: "AI Agent 팀", en: "AI Agent team" },
    stats: [ { n: 19, l: { ko: "후보 스낵", en: "candidates" } }, { n: 5, l: { ko: "팀원 참여", en: "contributors" } }, { n: 4, l: { ko: "새 태그", en: "new tags" } } ],
    trends: [
      { rank: "01", t: { ko: "Webhook & Google Chat 알림", en: "Webhook & Google Chat" }, s: "3 SNACKS · MENTIONED 6×" },
    ],
    picks: ["s6", "s2", "s4"],
    discuss: { ko: "다이제스트 알림을 Google Chat incoming webhook으로 보내볼까요?", en: "Should we send digest notifications via a Google Chat incoming webhook?" },
  },
];

// curation candidates (for draft digest)
const CURATION = [
  { id: "s2", included: true,  aiPick: true,  note: "" },
  { id: "s6", included: true,  aiPick: true,  note: { ko: "회고가 우리 상황이랑 비슷해요", en: "This retro mirrors our situation" } },
  { id: "s4", included: true,  aiPick: false, note: "" },
  { id: "s5", included: false, aiPick: true,  note: "" },
  { id: "s3", included: false, aiPick: false, note: "" },
];

// ---------- Sources ----------
const SOURCES = [
  {
    id: "src1", name: "LangChain Blog", type: "rss", typeLabel: { ko: "RSS 피드", en: "RSS feed" },
    status: "active", last: { ko: "12분 전", en: "12m ago" }, schedule: { ko: "15분마다", en: "every 15m" },
    url: "https://blog.langchain.dev/rss/", failures: 0, icon: "rss",
    runs: [
      { when: "APR 18 · 14:02", ok: true,  msg: { ko: "새 항목 3개 수집", en: "3 new items" } },
      { when: "APR 18 · 13:47", ok: true,  msg: { ko: "새 항목 0개", en: "0 new items" } },
      { when: "APR 18 · 13:32", ok: true,  msg: { ko: "새 항목 1개 수집", en: "1 new item" } },
    ],
  },
  {
    id: "src2", name: "arXiv · cs.CL \"RAG\"", type: "arxiv", typeLabel: { ko: "arXiv 검색", en: "arXiv query" },
    status: "active", last: { ko: "1시간 전", en: "1h ago" }, schedule: { ko: "하루 1번", en: "daily" },
    url: "arxiv.org/list/cs.CL · query=retrieval augmented", failures: 0, icon: "graduation-cap",
    runs: [
      { when: "APR 18 · 09:00", ok: true, msg: { ko: "새 논문 5편 수집", en: "5 new papers" } },
      { when: "APR 17 · 09:00", ok: true, msg: { ko: "새 논문 2편 수집", en: "2 new papers" } },
    ],
  },
  {
    id: "src3", name: "langchain-ai/langgraph", type: "github", typeLabel: { ko: "GitHub 릴리스/이슈", en: "GitHub releases/issues" },
    status: "active", last: { ko: "3시간 전", en: "3h ago" }, schedule: { ko: "1시간마다", en: "hourly" },
    url: "github.com/langchain-ai/langgraph", failures: 0, icon: "github",
    runs: [
      { when: "APR 18 · 11:00", ok: true, msg: { ko: "릴리스 v0.2.4 수집", en: "release v0.2.4" } },
    ],
  },
  {
    id: "src4", name: "Hugging Face · \"embedding\"", type: "huggingface", typeLabel: { ko: "Hugging Face 모델/카드", en: "Hugging Face model/card" },
    status: "needs_credential", last: { ko: "2일 전", en: "2d ago" }, schedule: { ko: "5분마다", en: "every 5m" },
    url: "huggingface.co/models?search=embedding", failures: 1, icon: "box",
    runs: [
      { when: "APR 16 · 22:10", ok: false, msg: { ko: "401 인증 실패 — HF 토큰 필요", en: "401 — HF token required" } },
    ],
  },
  {
    id: "src5", name: "ai.googleblog.com", type: "site", typeLabel: { ko: "일반 웹사이트", en: "Website crawl" },
    status: "paused", last: { ko: "1일 전", en: "1d ago" }, schedule: { ko: "6시간마다", en: "every 6h" },
    url: "https://ai.googleblog.com", failures: 5, icon: "globe", autopaused: true,
    runs: [
      { when: "APR 17 · 06:00", ok: false, msg: { ko: "503 응답 — 5회 연속 실패", en: "503 — 5 consecutive failures" } },
      { when: "APR 17 · 00:00", ok: false, msg: { ko: "503 응답", en: "503 response" } },
    ],
  },
];

// wizard sample preview items
const WIZARD_SAMPLE = [
  { thumb: "yellow", emoji: "🧠", h: { ko: "Reflection Agents로 자기 교정하기", en: "Self-correction with reflection agents" }, m: "blog.langchain.dev · APR 18" },
  { thumb: "blue", emoji: "📝", h: { ko: "LangGraph 0.2 릴리스 노트", en: "LangGraph 0.2 release notes" }, m: "blog.langchain.dev · APR 17" },
  { thumb: "green", emoji: "🔗", h: { ko: "도구 호출 스트리밍 가이드", en: "Streaming tool-calls guide" }, m: "blog.langchain.dev · APR 16" },
];

function snackById(id) { return SNACKS.find((s) => s.id === id); }

Object.assign(window, {
  PLATFORM, TAGS, PLATFORMS_NAV, SNACKS, DIGESTS, CURATION, SOURCES, WIZARD_SAMPLE,
  relatedFor, snackById,
});
