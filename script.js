(() => {
  const root = document.documentElement;
  const status = document.getElementById("status");

  // ===== Theme =====
  const THEME_KEY = "sky_theme";
  const btnTheme = document.getElementById("toggleTheme");

  function setTheme(theme) {
    if (theme) root.setAttribute("data-theme", theme);
    else root.removeAttribute("data-theme");
    localStorage.setItem(THEME_KEY, theme || "");
    btnTheme.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || "";
  if (savedTheme === "dark") setTheme("dark");

  btnTheme.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    setTheme(isDark ? "" : "dark");
    status.textContent = isDark ? "已切换到浅色模式。" : "已切换到深色模式。";
    clearLater();
  });

  function clearLater() {
    window.clearTimeout(clearLater._t);
    clearLater._t = window.setTimeout(() => (status.textContent = ""), 3200);
  }

  // ===== Copy letter =====
  const btnCopy = document.getElementById("copyLetter");
  const letterText = document.getElementById("letterText");

  btnCopy.addEventListener("click", async () => {
    const text = letterText.innerText.trim();
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "已复制：把这束光，送给小狮子。";
    } catch {
      status.textContent = "复制失败：浏览器可能不支持剪贴板权限。";
    }
    clearLater();
  });

  // ===== Note storage =====
  const NOTE_KEY = "sky_note";
  const form = document.getElementById("noteForm");
  const msg = document.getElementById("msg");
  const preview = document.getElementById("savedPreview");
  const clearBtn = document.getElementById("clearNote");

  function renderPreview(value) {
    preview.textContent = value ? `你写下的：${value}` : "（还没有保存小纸条）";
  }

  function loadNote() {
    try {
      return localStorage.getItem(NOTE_KEY) || "";
    } catch {
      return "";
    }
  }

  function saveNote(value) {
    localStorage.setItem(NOTE_KEY, value);
  }

  const existing = loadNote();
  msg.value = existing;
  renderPreview(existing);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = msg.value.trim();
    saveNote(v);
    renderPreview(v);
    status.textContent = "已保存。";
    clearLater();
  });

  clearBtn.addEventListener("click", () => {
    saveNote("");
    msg.value = "";
    renderPreview("");
    status.textContent = "已清空。";
    clearLater();
  });

  // ===== “点亮一句”小仪式 =====
  const lightBtn = document.getElementById("lightBtn");
  const lightText = document.getElementById("lightText");

  const lines = [
    "今天也一起点亮一下：谢谢你来啦！",
    "风再大也不怕，因为你会等我一下下。",
    "云很软，路很长，但并肩就很安心。",
    "同伴最棒的地方：不需要解释太多，也能懂。",
    "把手伸过来的那一刻：我直接被治愈。",
    "你负责可靠，我负责开心（偶尔也负责迷路）。",
    "谢谢你把普通的一天，照亮成“值得记住”的一天。"
  ];

  let hasShownOnce = false;
  let clickCount = 0;
  const EASTER_EGG_AT = 7;

  function pickOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function showLine() {
    clickCount += 1;

    const first = !hasShownOnce;
    if (first) {
      hasShownOnce = true;
      lightBtn.textContent = "再点亮一句";
      status.textContent = "点亮成功。";
    } else {
      status.textContent = "又亮了一点。";
    }

    let text = "";
    if (clickCount === EASTER_EGG_AT) {
      text = "小狮子！我把感谢藏在每一次并肩、每一次点亮里～";
      status.textContent = "你触发了一个小彩蛋。";
    } else {
      text = pickOne(lines);
    }

    lightText.classList.remove("is-show");
    void lightText.offsetWidth;
    lightText.textContent = text;
    lightText.classList.add("is-show");
    clearLater();
  }

  if (lightBtn && lightText) {
    lightBtn.addEventListener("click", showLine);
  }

  // ===== “掷一朵云”（每日首次固定一句） =====
  const cloudBtn = document.getElementById("cloudBtn");
  const cloudText = document.getElementById("cloudText");

  const CLOUD_KEY_DATE = "cloud_daily_date";
  const CLOUD_KEY_TEXT = "cloud_daily_text";

  // 每日首次从这里抽一条并固定（俏皮 + 温柔混合）
  const dailyCloudPool = [
    "☁️ 今日专属：小狮子上线，我的路就自动亮一点。",
    "☁️ 今日专属：风有点大？没事，我跟着你就行。",
    "☁️ 今日专属：云很软，你也很靠谱（我认证）。",
    "☁️ 今日专属：把手伸过来那一下——我就不慌了。",
    "☁️ 今日专属：同伴位给你留着，随时并肩。",
    "☁️ 今日专属：今天也请继续温柔营业一下下～",
    "☁️ 今日专属：谢谢你，专门把我从迷路里捞出来。",
    "☁️ 今日专属：你负责可靠，我负责开心（偶尔也负责慢）。",
    "☁️ 今日专属：云在飘、风在吹，我们慢慢走就很对。",
    "☁️ 今日专属：并肩这件事，真的会让人变勇敢。",
    "☁️ 今日专属：我把感谢藏在“再等我一下”的那种耐心里。",
    "☁️ 今日专属：今天的光分你一半，剩下的我自己也够用。"
  ];

  // 当天第二次起使用的随机短句
  const cloudPuffs = [
    "☁️ 云给你：今天也谢谢你在。",
    "☁️ 掉落一朵云：有你这个同伴我很安心。",
    "☁️ 小云飘过：谢谢你愿意等我一下下。",
    "☁️ 轻轻一朵：把手伸过来的瞬间我记很久。",
    "☁️ 云里藏字：并肩真的很有力量。",
    "☁️ 云说：你很可靠（认证）。",
    "☁️ 云提醒：慢慢走也没关系。"
  ];

  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function getDailyCloud() {
    const today = todayKey();
    const savedDate = localStorage.getItem(CLOUD_KEY_DATE) || "";
    const savedText = localStorage.getItem(CLOUD_KEY_TEXT) || "";

    if (savedDate === today && savedText) return savedText;

    const text = pickOne(dailyCloudPool);
    localStorage.setItem(CLOUD_KEY_DATE, today);
    localStorage.setItem(CLOUD_KEY_TEXT, text);
    return text;
  }

  function hasTossedToday() {
    const today = todayKey();
    return localStorage.getItem(CLOUD_KEY_DATE) === today;
  }

  function pickDifferent(arr, current) {
    if (arr.length <= 1) return arr[0] || "";
    let next = current;
    while (next === current) next = pickOne(arr);
    return next;
  }

  function tossCloud() {
    const firstToday = !hasTossedToday();

    let next = "";
    if (firstToday) {
      next = getDailyCloud();
      status.textContent = "今日第一朵云 ☁️";
    } else {
      const current = cloudText.textContent || "";
      next = pickDifferent(cloudPuffs, current);
      status.textContent = "云丢出去啦 ☁️";
    }

    cloudText.classList.remove("is-show");
    void cloudText.offsetWidth;
    cloudText.textContent = next;
    cloudText.classList.add("is-show");

    clearLater();
  }

  if (cloudBtn && cloudText) {
    cloudBtn.addEventListener("click", tossCloud);
  }
})();
