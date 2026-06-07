/* InfoSnack — i18n: Korean (primary) + English. Voice per design system. */
const { createContext, useContext, useState, useCallback } = React;

const STRINGS = {
  // nav
  "nav.home":        { ko: "홈", en: "Home" },
  "nav.library":     { ko: "라이브러리", en: "Library" },
  "nav.capture":     { ko: "수집", en: "Capture" },
  "nav.sources":     { ko: "수집처", en: "Sources" },
  "nav.search":      { ko: "검색", en: "Search" },
  "nav.digests":     { ko: "다이제스트", en: "Digests" },
  "nav.chat":        { ko: "AI 챗봇", en: "AI chat" },
  "nav.admin":       { ko: "관리자", en: "Admin" },
  "nav.settings":    { ko: "설정", en: "Settings" },
  "nav.tags":        { ko: "태그", en: "Tags" },
  "nav.platforms":   { ko: "플랫폼", en: "Platforms" },
  "cta.capture":     { ko: "링크 담기", en: "Take a bite" },

  // common
  "all":             { ko: "전체", en: "All" },
  "back.feed":       { ko: "피드로 돌아가기", en: "Back to feed" },
  "back":            { ko: "뒤로", en: "Back" },
  "save":            { ko: "저장", en: "Save" },
  "cancel":          { ko: "취소", en: "Cancel" },
  "delete":          { ko: "삭제", en: "Delete" },
  "edit":            { ko: "편집", en: "Edit" },
  "share":           { ko: "공유", en: "Share" },
  "readonly":        { ko: "읽기 전용", en: "Read-only" },
  "min":             { ko: "분", en: "min" },
  "added.by":        { ko: "님이 담음", en: "saved" },
  "ago.m":           { ko: "분 전", en: "m ago" },
  "ago.d":           { ko: "일 전", en: "d ago" },
  "yesterday":       { ko: "어제", en: "yesterday" },
  "filter":          { ko: "필터", en: "Filter" },
  "newest":          { ko: "최신순", en: "Newest" },

  // home
  "home.title":      { ko: "오늘의 스낵 🍪", en: "Today's snacks 🍪" },
  "home.greet":      { ko: "다섯 입, 1분 컷.", en: "Five bites, one minute." },
  "home.new":        { ko: "오늘 새 스낵", en: "new today" },
  "home.unwrapped":  { ko: "이번 주 모은 스낵", en: "snacks this week" },
  "home.contributors": { ko: "함께한 팀원", en: "contributors" },
  "home.tags":       { ko: "새로 생긴 태그", en: "new tags" },
  "home.trending":   { ko: "지금 팀에서 뜨는 주제", en: "Trending in your team" },
  "home.recent":     { ko: "방금 도착한 스낵", en: "Just arrived" },
  "home.continue":   { ko: "이어서 읽기", en: "Pick up where you left off" },

  // library
  "lib.title":       { ko: "라이브러리", en: "Library" },
  "lib.search":      { ko: "저장한 스낵에서 찾기… (본문, 이미지 OCR까지)", en: "Search your snacks… (body & image OCR)" },
  "lib.count":       { ko: "개의 스낵", en: "snacks" },
  "lib.collections": { ko: "컬렉션", en: "Collections" },
  "lib.newcollection": { ko: "새 컬렉션", en: "New collection" },
  "lib.thisweek":    { ko: "이번 주", en: "This week" },
  "lib.unread":      { ko: "안 읽음", en: "Unread" },
  "lib.bulk":        { ko: "선택", en: "Select" },
  "lib.manage.coll": { ko: "컬렉션 관리", en: "Manage collections" },
  "lib.coll.desc":   { ko: "관련 스낵을 한 단지에 모아두세요.", en: "Group related snacks into one jar." },
  "lib.coll.add":    { ko: "콘텐츠 추가", en: "Add content" },
  "lib.view.card":   { ko: "카드", en: "Cards" },
  "lib.view.list":   { ko: "목록", en: "List" },

  // reader
  "read.summary":    { ko: "AI 한 입 요약", en: "AI bite-sized summary" },
  "read.read":       { ko: "읽음으로", en: "Mark read" },
  "read.original":   { ko: "원문", en: "Original" },
  "read.reprocess":  { ko: "재처리", en: "Reprocess" },
  "read.export":     { ko: "내보내기", en: "Export" },
  "read.related":    { ko: "관련 스낵 · Graph RAG", en: "Related snacks · Graph RAG" },
  "read.meta":       { ko: "메타데이터", en: "Metadata" },
  "read.entities":   { ko: "엔티티", en: "Entities" },
  "read.tags":       { ko: "태그", en: "Tags" },
  "read.lang":       { ko: "언어", en: "Language" },
  "read.type":       { ko: "유형", en: "Type" },
  "read.author":     { ko: "작성자", en: "Author" },
  "read.published":  { ko: "게시일", en: "Published" },
  "read.ask":        { ko: "이 스낵에게 묻기", en: "Ask this snack" },
  "read.activity":   { ko: "활동", en: "Activity" },

  // content chat
  "cchat.title":     { ko: "이 스낵에게 묻기", en: "Ask this snack" },
  "cchat.scope":     { ko: "현재 콘텐츠만 대상", en: "Scoped to this content" },
  "cchat.placeholder": { ko: "이 스낵에 대해 물어보세요…", en: "Ask about this snack…" },
  "cchat.intro":     { ko: "이 스낵 본문과 이미지 속 텍스트까지 읽고 답해드려요. 답에는 항상 출처를 달아요.", en: "I read this snack — body and image text — and always cite my sources." },

  // global chat
  "chat.title":      { ko: "스낵에게 묻기", en: "Ask your snacks" },
  "chat.status":     { ko: "Graph RAG 활성", en: "Graph RAG active" },
  "chat.placeholder": { ko: "스낵에게 뭐든 물어보세요…", en: "Ask your snacks anything…" },
  "chat.intro":      { ko: "안녕! 저장한 247개 스낵에서 뭐든 물어봐요. 팀원이 담은 링크 · 이미지 속 텍스트까지 찾아드려요.", en: "Hi! Ask anything across your 247 saved snacks — links your teammates saved and even text inside images." },
  "chat.cited":      { ko: "인용됨", en: "cited" },

  // capture
  "cap.title":       { ko: "한 입 담기", en: "Take a bite" },
  "cap.sub":         { ko: "링크 하나, 3초면 충분해요. 분석은 알아서 진행돼요.", en: "One link, three seconds. We'll do the rest in the background." },
  "cap.tab.url":     { ko: "URL", en: "URL" },
  "cap.tab.youtube": { ko: "YouTube", en: "YouTube" },
  "cap.tab.text":    { ko: "텍스트", en: "Text" },
  "cap.tab.file":    { ko: "PDF · 이미지", en: "PDF · Image" },
  "cap.url.ph":      { ko: "https:// 주소를 붙여넣으세요", en: "Paste a https:// link" },
  "cap.yt.ph":       { ko: "YouTube 영상 또는 Shorts 주소", en: "YouTube watch or Shorts URL" },
  "cap.text.ph":     { ko: "저장할 메모나 선택한 텍스트를 붙여넣으세요…", en: "Paste a note or selected text…" },
  "cap.file.drop":   { ko: "PDF 또는 이미지를 여기에 끌어다 놓으세요", en: "Drag a PDF or image here" },
  "cap.file.hint":   { ko: "한 번에 1개 파일 · OCR은 Upstage가 처리해요", en: "One file at a time · OCR by Upstage" },
  "cap.save":        { ko: "스낵 단지에 담기", en: "Tuck into the jar" },
  "cap.recent":      { ko: "방금 담은 스낵", en: "Just saved" },
  "cap.processing":  { ko: "포장 뜯는 중…", en: "Unwrapping…" },
  "cap.done":        { ko: "스낵 단지에 잘 넣어뒀어요.", en: "Tucked into your snack jar." },
  "cap.yt.review":   { ko: "자막이 없어 확인이 필요해요", en: "No transcript — needs review" },

  // sources
  "src.title":       { ko: "수집처", en: "Sources" },
  "src.sub":         { ko: "주기마다 자동으로 스낵을 모아오는 곳이에요.", en: "Places that auto-collect snacks on a schedule." },
  "src.add":         { ko: "수집처 추가", en: "Add source" },
  "src.empty.h":     { ko: "아직 등록한 수집처가 없어요", en: "No sources yet" },
  "src.empty.p":     { ko: "RSS, arXiv, GitHub, Hugging Face… 주소만 붙여넣으면 종류를 알아서 알아봐요.", en: "RSS, arXiv, GitHub, Hugging Face… paste a URL and we'll detect the type." },
  "src.active":      { ko: "활성", en: "Active" },
  "src.paused":      { ko: "일시중지", en: "Paused" },
  "src.failed":      { ko: "실패", en: "Failed" },
  "src.needcred":    { ko: "인증 필요", en: "Needs credential" },
  "src.last":        { ko: "마지막 수집", en: "Last run" },
  "src.every":       { ko: "주기", en: "Every" },
  "src.autopaused":  { ko: "반복 실패로 자동 일시중지됨", en: "Auto-paused after repeated failures" },
  "src.runs":        { ko: "최근 실행", en: "Recent runs" },
  "src.config":      { ko: "수집 설정", en: "Collection settings" },
  "src.resume":      { ko: "재개", en: "Resume" },
  "src.pause":       { ko: "일시중지", en: "Pause" },
  "src.runnow":      { ko: "지금 수집", en: "Run now" },
  // wizard
  "wiz.title":       { ko: "수집처 추가", en: "Add a source" },
  "wiz.s1":          { ko: "주소 붙여넣기", en: "Paste URL" },
  "wiz.s2":          { ko: "옵션", en: "Options" },
  "wiz.s3":          { ko: "미리보기", en: "Preview" },
  "wiz.paste.ph":    { ko: "RSS · 사이트 · arXiv · GitHub · Hugging Face 주소", en: "RSS · site · arXiv · GitHub · Hugging Face URL" },
  "wiz.paste.hint":  { ko: "주소를 붙여넣으면 종류를 자동으로 알아봐요.", en: "Paste a URL and we'll detect the type automatically." },
  "wiz.detected":    { ko: "종류를 알아봤어요", en: "Detected source type" },
  "wiz.sample":      { ko: "이런 스낵들이 들어와요", en: "Sample of what you'll get" },
  "wiz.name":        { ko: "표시 이름", en: "Display name" },
  "wiz.schedule":    { ko: "수집 주기", en: "Schedule" },
  "wiz.next":        { ko: "다음", en: "Next" },
  "wiz.create":      { ko: "수집처 만들기", en: "Create source" },
  "wiz.detecting":   { ko: "종류를 알아보는 중…", en: "Detecting…" },

  // digests
  "dg.title":        { ko: "다이제스트", en: "Digests" },
  "dg.sub":          { ko: "한 주의 스낵을 한 입 크기로 모았어요.", en: "Your week of snacks, bite-sized." },
  "dg.list":         { ko: "지난 다이제스트", en: "Past digests" },
  "dg.published":    { ko: "배포됨", en: "Published" },
  "dg.draft":        { ko: "초안", en: "Draft" },
  "dg.thisweek":     { ko: "이번 주 스낵 모음", en: "This week's snacks" },
  "dg.trend":        { ko: "이번 주 트렌드", en: "This week's trends" },
  "dg.picks":        { ko: "팀의 추천 스낵", en: "Team picks" },
  "dg.picks.intro":  { ko: "이번 주 가장 많이 읽히고, 댓글이 달렸던 것들이에요.", en: "Most-read and most-discussed this week." },
  "dg.discuss":      { ko: "월요일 회의에서 얘기해볼만한", en: "Worth raising on Monday" },
  "dg.viewall":      { ko: "피드에서 전체 보기", en: "See all in feed" },
  "dg.collected":    { ko: "수집된 스낵", en: "snacks collected" },
  "dg.curate":       { ko: "큐레이션 편집", en: "Edit curation" },
  "dg.publish":      { ko: "배포하기", en: "Publish" },
  "dg.sharelink":    { ko: "공유 링크", en: "Share link" },
  // curation
  "cur.title":       { ko: "다이제스트 큐레이션", en: "Digest curation" },
  "cur.sub":         { ko: "AI가 고른 이번 주 후보예요. 포함/제외하고 순서를 바꿔보세요.", en: "AI-picked candidates. Include, exclude, reorder." },
  "cur.include":     { ko: "포함", en: "Include" },
  "cur.note.ph":     { ko: "큐레이터 코멘트 (선택)", en: "Curator comment (optional)" },
  "cur.included.n":  { ko: "개 포함", en: "included" },
  "cur.confirm":     { ko: "확정하고 배포", en: "Confirm & publish" },
  "cur.aipick":      { ko: "AI 추천", en: "AI pick" },

  // share
  "sh.made":         { ko: "InfoSnack으로 만들어졌어요", en: "Made with InfoSnack" },
  "sh.made.sub":     { ko: "흩어진 링크를 한 입 크기 스낵으로. 우리 팀도 시작해볼까요?", en: "Turn scattered links into bite-sized snacks. Start with your team?" },
  "sh.try":          { ko: "InfoSnack 둘러보기", en: "Explore InfoSnack" },
  "sh.source":       { ko: "원본 출처", en: "Original source" },
  "sh.collected":    { ko: "수집 시각", en: "Collected" },

  // toast
  "toast.saved":     { ko: "스낵 단지에 잘 넣어뒀어요", en: "Tucked into your snack jar" },
  "toast.read":      { ko: "읽음으로 표시했어요", en: "Marked as read" },
  "toast.published": { ko: "다이제스트를 배포했어요", en: "Digest published" },
  "toast.shared":    { ko: "공유 링크를 복사했어요", en: "Share link copied" },
  "toast.sourceadd": { ko: "수집처를 추가했어요", en: "Source added" },
  "toast.resumed":   { ko: "수집을 다시 시작했어요", en: "Collection resumed" },
  "toast.paused":    { ko: "수집을 잠시 멈췄어요", en: "Collection paused" },
};

const LangContext = createContext({ lang: "ko", setLang: () => {}, t: (k) => k });

function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem("infosnack_lang") || "ko");
  const setLang = useCallback((l) => { setLangState(l); localStorage.setItem("infosnack_lang", l); }, []);
  const t = useCallback((key) => {
    const e = STRINGS[key];
    if (!e) return key;
    return e[lang] != null ? e[lang] : e.ko;
  }, [lang]);
  return React.createElement(LangContext.Provider, { value: { lang, setLang, t } }, children);
}
function useLang() { return useContext(LangContext); }
// bilingual content helper: L({ko,en}, lang)
function L(obj, lang) {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] != null ? obj[lang] : obj.ko;
}

Object.assign(window, { STRINGS, LangProvider, useLang, L, LangContext });
