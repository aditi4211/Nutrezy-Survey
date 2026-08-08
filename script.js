/* =============================================================
   NUTREZY SURVEY SITE — SCRIPT
   Vanilla JS only. No frameworks, no build step.
   Sections:
   0. Config (paste your Google Sheets URL here — see README)
   1. Survey data (edit questions here — see README)
   2. Floating circle layout + rendering
   3. Modal open/close
   4. Form rendering per question + contact-details step
   5. Navigation, validation, progress
   6. Submit, confetti, thank-you, auto-close
   7. Google Sheets submission (Apps Script web app)
   8. localStorage (save-in-progress) + JSON export
   9. Small extras: sparkles, cursor glow
   ============================================================= */

/* ---------- 0. CONFIG ---------- */
/* Paste your Google Apps Script "Web app" URL here (see README section 10).
   Leave it blank ("") and the site will fall back to downloading each
   response as a .json file instead, so you never lose data either way. */
const CONFIG = {
  GOOGLE_SHEETS_URL: "https://script.google.com/macros/s/AKfycbw-3kpvbqi4LGNVx_UgfvkPR61l-M6eYncSkop89mpFYJNENGdDhuEM0_wfJZzDn9pCgA/exec"
};

/* ---------- 1. SURVEY DATA ---------- */
/* Each survey matches one of the 10 uploaded questionnaires, word-for-word.
   type: 'radio' | 'checkbox' | 'dropdown' | 'text' | 'textarea'         */
const SURVEYS = [
  {
    id: 1,
    bubble: "Snacks ;) ?",
    title: "Healthy Snacking Habits",
    objective: "Understand overall snacking behaviour.",
    questions: [
      { type: "radio", text: "How often do you consume packaged snacks?", options: ["Daily", "3–5 times/week", "1–2 times/week", "Rarely"] },
      { type: "radio", text: "How often do you intentionally choose a healthy snack instead of a regular snack?", options: ["Always", "Often", "Sometimes", "Never"] },
      { type: "dropdown", text: "What is your primary reason for choosing a healthy snack?", options: ["Health", "Fitness", "Weight management", "Taste", "Convenience"] },
      { type: "checkbox", text: "At what time do you usually consume healthy snacks?", options: ["Morning", "Afternoon", "Evening", "Post-workout"] }
    ]
  },
  {
    id: 2,
    bubble: "What is your type?",
    title: "Purchase Behaviour",
    objective: "Understand buying patterns.",
    questions: [
      { type: "radio", text: "How often do you buy healthy snacks?", options: ["Always", "Often", "Sometimes", "Never"] },
      { type: "checkbox", text: "Where do you usually buy them?", options: ["Blinkit", "Zepto", "Instamart", "Amazon", "Supermarket"] },
      { type: "radio", text: "Do you buy individual packs or multipacks?", options: ["Individual packs", "Multipacks"] },
      { type: "dropdown", text: "What usually triggers your purchase?", options: ["Need", "Discount", "Recommendation", "Advertisement"] }
    ]
  },
  {
    id: 3,
    bubble: "Whom do you love more?",
    title: "Favourite Brands",
    objective: "Identify leading competitors.",
    questions: [
      { type: "text", text: "Which healthy snack brands do you buy most often?" },
      { type: "text", text: "Which brand do you trust the most?" },
      { type: "radio", text: "Have you heard of Nutrezy?", options: ["Yes", "No"] },
      { type: "textarea", text: "Why do you prefer your favourite brand?" }
    ]
  },
  {
    id: 4,
    bubble: "What do you want??",
    title: "Product Preferences",
    objective: "Identify preferred categories.",
    questions: [
      { type: "checkbox", text: "Which products do you buy most?", options: ["Protein Bars", "Granola", "Trail Mix", "Dry Fruits", "Millet Snacks"] },
      { type: "text", text: "Which flavours do you prefer?" },
      { type: "radio", text: "Which ingredient is most important?", options: ["Protein", "Fibre", "Low Sugar", "Natural Ingredients"] },
      { type: "text", text: "Which product would you like to see more of?" }
    ]
  },
  {
    id: 5,
    bubble: "Let's talk money.",
    title: "Pricing",
    objective: "Understand willingness to pay.",
    questions: [
      { type: "text", text: "How much are you willing to spend on a healthy snack?" },
      { type: "radio", text: "Do discounts influence your purchase?", options: ["Yes", "No"] },
      { type: "radio", text: "Would you pay more for better ingredients?", options: ["Yes", "No"] },
      { type: "radio", text: "Which matters more?", options: ["Price", "Quality"] }
    ]
  },
  {
    id: 6,
    bubble: "Let's meet somewhere!",
    title: "Platform Preferences",
    objective: "Understand platform usage.",
    questions: [
      { type: "dropdown", text: "Which platform do you use most?", options: ["Blinkit", "Zepto", "Instamart", "Amazon", "Supermarket"] },
      { type: "checkbox", text: "Why do you prefer that platform?", options: ["Fast delivery", "Offers", "Variety", "Convenience"] },
      { type: "radio", text: "Have you discovered a new snack brand through quick commerce?", options: ["Yes", "No"] },
      { type: "dropdown", text: "Which platform has the best healthy snack collection?", options: ["Blinkit", "Zepto", "Instamart", "Amazon", "Supermarket"] }
    ]
  },
  {
    id: 7,
    bubble: "How are you so sure?",
    title: "Purchase Drivers",
    objective: "Identify decision factors.",
    questions: [
      { type: "radio", text: "What influences your purchase the most?", options: ["Taste", "Protein", "Brand", "Price", "Ingredients"] },
      { type: "radio", text: "Do online ratings affect your decision?", options: ["Yes", "No"] },
      { type: "radio", text: "Do reviews affect your purchase?", options: ["Yes", "No"] },
      { type: "radio", text: "Would you try a new healthy snack brand?", options: ["Yes", "No"] }
    ]
  },
  {
    id: 8,
    bubble: "Art or smART?",
    title: "Packaging & Claims",
    objective: "Understand communication preferences.",
    questions: [
      { type: "radio", text: "What attracts you first?", options: ["Packaging", "Brand", "Price", "Claims"] },
      { type: "dropdown", text: "Which claim attracts you most?", options: ["High Protein", "No Added Sugar", "High Fibre", "Clean Label"] },
      { type: "radio", text: "Do you read ingredient labels?", options: ["Yes", "No"] },
      { type: "radio", text: "Does sustainable packaging influence you?", options: ["Yes", "No"] }
    ]
  },
  {
    id: 9,
    bubble: "Snack Spree!!",
    title: "Promotions & Bundles",
    objective: "Understand promotional effectiveness.",
    questions: [
      { type: "radio", text: "Which offer encourages you most?", options: ["Buy 1 Get 1", "Flat Discount", "Bundle Pack", "Free Delivery"] },
      { type: "radio", text: "Have you ever bought a bundle pack?", options: ["Yes", "No"] },
      { type: "radio", text: "Do combo offers encourage trial?", options: ["Yes", "No"] },
      { type: "radio", text: "Would you subscribe for regular deliveries?", options: ["Yes", "No"] }
    ]
  },
  {
    id: 10,
    bubble: "What. do. you. EXPECT??",
    title: "Customer Expectations",
    objective: "Identify unmet needs.",
    questions: [
      { type: "textarea", text: "What is missing in today's healthy snack brands?" },
      { type: "text", text: "Which new product would you like to see?" },
      { type: "textarea", text: "What would make you switch brands?" },
      { type: "textarea", text: "What one improvement would you suggest for healthy snack brands?" }
    ]
  }
];

/* ---------- 2. FLOATING CIRCLE LAYOUT ---------- */
const circlesField = document.getElementById("circlesField");
let circleEls = [];

function layoutCircles() {
  circlesField.innerHTML = "";
  circleEls = [];

  const fieldRect = circlesField.getBoundingClientRect();
  const isSmall = fieldRect.width < 760;
  const placed = []; // { x, y, r } in px, x/y are center coords

  SURVEYS.forEach((survey, i) => {
    const size = isSmall ? 68 + Math.random() * 20 : 120 + Math.random() * 40;
    const radius = size / 2;

    // Try random non-overlapping placement; fall back to a ring layout after enough attempts.
    let x, y, attempts = 0;
    const margin = radius + 8;
    const minGap = isSmall ? 6 : 14;
    do {
      x = margin + Math.random() * (fieldRect.width - margin * 2);
      y = margin + Math.random() * (fieldRect.height - margin * 2);
      attempts++;
    } while (
      attempts < 200 &&
      placed.some(p => Math.hypot(p.x - x, p.y - y) < p.r + radius + minGap) 
    );

    // Keep circles away from the centre hero text on desktop
    if (!isSmall) {
      const cx = fieldRect.width / 2, cy = fieldRect.height / 2;
      const distFromCenter = Math.hypot(cx - x, cy - y);
      const safeZone = 210;
      if (distFromCenter < safeZone) {
        const angle = Math.atan2(y - cy, x - cx) || Math.random() * Math.PI * 2;
        x = cx + Math.cos(angle) * safeZone;
        y = cy + Math.sin(angle) * safeZone;
        x = Math.max(margin, Math.min(fieldRect.width - margin, x));
        y = Math.max(margin, Math.min(fieldRect.height - margin, y));
      }
    }

    placed.push({ x, y, r: radius });

    const el = document.createElement("button");
    el.type = "button";
    el.className = "circle";
    el.dataset.surveyId = survey.id;
    el.dataset.tone = String((i % 5) + 1);
    el.style.width = el.style.height = `${size}px`;
    el.style.left = `${x - radius}px`;
    el.style.top = `${y - radius}px`;
    el.style.setProperty("--dur", `${11 + Math.random() * 8}s`);
    el.style.setProperty("--delay", `${Math.random() * -12}s`);
    el.setAttribute("aria-label", `Open survey: ${survey.bubble}`);
    el.innerHTML = `<span>${survey.bubble}</span>`;

    el.addEventListener("click", () => {
      el.classList.remove("pop");
      void el.offsetWidth; // restart animation
      el.classList.add("pop");
      spawnSparkles(el);
      openSurvey(survey.id);
    });

    circlesField.appendChild(el);
    circleEls.push(el);
  });
}

/* Small decorative sparkle burst on click (micro-interaction, CSS-driven) */
function spawnSparkles(el) {
  const rect = el.getBoundingClientRect();
  const fieldRect = circlesField.getBoundingClientRect();
  for (let i = 0; i < 6; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    const angle = (Math.PI * 2 * i) / 6;
    const cx = rect.left - fieldRect.left + rect.width / 2 + Math.cos(angle) * rect.width * 0.4;
    const cy = rect.top - fieldRect.top + rect.height / 2 + Math.sin(angle) * rect.height * 0.4;
    s.style.left = `${cx}px`;
    s.style.top = `${cy}px`;
    circlesField.appendChild(s);
    setTimeout(() => s.remove(), 1500);
  }
}

/* Re-layout on load and on resize (debounced) */
window.addEventListener("load", layoutCircles);
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(layoutCircles, 250);
});

/* ---------- 3. MODAL OPEN / CLOSE ---------- */
const overlay = document.getElementById("modalOverlay");
const modalCard = document.getElementById("modalCard");
const btnClose = document.getElementById("modalClose");
const surveyForm = document.getElementById("surveyForm");
const modalTitle = document.getElementById("modalTitle");
const modalObjective = document.getElementById("modalObjective");
const progressLabel = document.getElementById("progressLabel");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnSubmit = document.getElementById("btnSubmit");
const thankYou = document.getElementById("thankYou");

let currentSurvey = null;
let currentQIndex = 0;
let answers = {};
let lastFocusedEl = null;

function openSurvey(surveyId) {
  currentSurvey = SURVEYS.find(s => s.id === surveyId);
  currentQIndex = 0;
  const saved = loadProgress(surveyId);
  answers = (saved && saved.answers) || {};
  currentQIndex = (saved && saved.qIndex) || 0;

  thankYou.hidden = true;
  surveyForm.hidden = false;
  document.querySelector(".modal-progress").hidden = false;
  modalTitle.hidden = false;
  modalObjective.hidden = false;
  document.querySelector(".modal-nav").hidden = false;

  modalTitle.textContent = currentSurvey.title;
  modalObjective.textContent = currentSurvey.objective;

  renderQuestion();
  lastFocusedEl = document.activeElement;
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
  setTimeout(() => modalCard.querySelector("input,select,textarea,button")?.focus(), 50);
}

function closeSurvey() {
  overlay.hidden = true;
  document.body.style.overflow = "";
  if (lastFocusedEl) lastFocusedEl.focus();
}

btnClose.addEventListener("click", closeSurvey);

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeSurvey();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !overlay.hidden) closeSurvey();
});

/* ---------- 4. RENDER A QUESTION ---------- */
function renderQuestion() {
  surveyForm.innerHTML = "";

  const q = currentSurvey.questions[currentQIndex];
  const savedAnswer = answers[currentQIndex];

  const block = document.createElement("div");
  block.className = "question-block";

  const label = document.createElement("p");
  label.className = "question-text";
  label.textContent = q.text;
  block.appendChild(label);

  if (q.type === "radio" || q.type === "checkbox") {
    const list = document.createElement("div");
    list.className = "options-list";
    q.options.forEach((opt) => {
      const pill = document.createElement("label");
      pill.className = "option-pill";
      const input = document.createElement("input");
      input.type = q.type;
      input.name = "q" + currentQIndex;
      input.value = opt;
      if (q.type === "checkbox") {
        const checkedArr = Array.isArray(savedAnswer) ? savedAnswer : [];
        input.checked = checkedArr.includes(opt);
      } else {
        input.checked = savedAnswer === opt;
      }
      input.addEventListener("change", () => {
        list.querySelectorAll(".option-pill").forEach(p => {
          const inp = p.querySelector("input");
          p.classList.toggle("checked", inp.checked);
        });
        saveCurrentAnswer(q);
      });
      pill.appendChild(input);
      pill.appendChild(document.createTextNode(opt));
      if (input.checked) pill.classList.add("checked");
      list.appendChild(pill);
    });
    block.appendChild(list);
  } else if (q.type === "dropdown") {
    const select = document.createElement("select");
    select.className = "form-select";
    const placeholder = document.createElement("option");
    placeholder.textContent = "Select an option…";
    placeholder.value = "";
    select.appendChild(placeholder);
    q.options.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      if (savedAnswer === opt) o.selected = true;
      select.appendChild(o);
    });
    select.addEventListener("change", () => saveCurrentAnswer(q));
    block.appendChild(select);
  } else if (q.type === "textarea") {
    const ta = document.createElement("textarea");
    ta.className = "form-textarea";
    ta.placeholder = "Type your answer…";
    ta.value = savedAnswer || "";
    ta.addEventListener("input", () => saveCurrentAnswer(q));
    block.appendChild(ta);
  } else {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "form-text";
    input.placeholder = "Type your answer…";
    input.value = savedAnswer || "";
    input.addEventListener("input", () => saveCurrentAnswer(q));
    block.appendChild(input);
  }

  surveyForm.appendChild(block);
  updateProgressUI();
  updateNavButtons();
  saveProgress(currentSurvey.id, answers, currentQIndex);
}

function saveCurrentAnswer(q) {
  if (q.type === "checkbox") {
    const checked = [...surveyForm.querySelectorAll('input[type="checkbox"]:checked')].map(i => i.value);
    answers[currentQIndex] = checked;
  } else if (q.type === "radio") {
    const checked = surveyForm.querySelector('input[type="radio"]:checked');
    answers[currentQIndex] = checked ? checked.value : undefined;
  } else if (q.type === "dropdown") {
    answers[currentQIndex] = surveyForm.querySelector("select").value;
  } else {
    answers[currentQIndex] = surveyForm.querySelector("input,textarea").value;
  }
  saveProgress(currentSurvey.id, answers, currentQIndex);
}

/* ---------- 5. PROGRESS + NAV ---------- */
function updateProgressUI() {
  const total = currentSurvey.questions.length;
  const current = currentQIndex + 1;
  const percent = Math.round((current / total) * 100);
  progressLabel.textContent = `Survey ${currentSurvey.id} of ${SURVEYS.length}`;
  progressFill.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;
}

function updateNavButtons() {
  const isLast = currentQIndex === currentSurvey.questions.length - 1;
  btnPrev.disabled = currentQIndex === 0;
  btnNext.hidden = isLast;
  btnSubmit.hidden = !isLast;
}

btnPrev.addEventListener("click", () => {
  if (currentQIndex > 0) { currentQIndex--; renderQuestion(); }
});

btnNext.addEventListener("click", () => {
  if (currentQIndex < currentSurvey.questions.length - 1) { currentQIndex++; renderQuestion(); }
});

btnSubmit.addEventListener("click", submitSurvey);

/* ---------- 6. SUBMIT / THANK YOU / CONFETTI ---------- */
function submitSurvey() {
  // Persist final response + export JSON (bonus feature) + send to Google Sheets
  const responseRecord = {
    surveyId: currentSurvey.id,
    surveyTitle: currentSurvey.title,
    submittedAt: new Date().toISOString(),
    answers: currentSurvey.questions.map((q, idx) => ({ question: q.text, answer: answers[idx] ?? null }))
  };
  storeCompletedResponse(responseRecord);
  exportResponseAsJSON(responseRecord);
  submitToGoogleSheet(responseRecord);
  clearProgress(currentSurvey.id);

  surveyForm.hidden = true;
  document.querySelector(".modal-progress").hidden = true;
  modalTitle.hidden = true;
  modalObjective.hidden = true;
  document.querySelector(".modal-nav").hidden = true;
  thankYou.hidden = false;

  launchConfetti();

  setTimeout(closeSurvey, 3000);
}

function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const ctx = canvas.getContext("2d");
  const colors = ["#FFD9C2", "#FFF3B0", "#C8F4DE", "#E3D9FF", "#C9E9FF", "#FFD6E8"];
  const pieces = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 40,
    size: 4 + Math.random() * 5,
    speed: 1.5 + Math.random() * 2.5,
    drift: (Math.random() - 0.5) * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI
  }));

  let frame = 0;
  function tick() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation + frame * 0.02);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
    if (frame < 90) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  tick();
}

/* ---------- 7. Google Sheets + localStorage: save-in-progress + export ---------- */

/* Sends the finished response to your Google Sheet via a Google Apps
   Script "Web app" (see README section 10 for the 5-minute setup).
   If CONFIG.GOOGLE_SHEETS_URL is left blank, this quietly does nothing —
   the .json download and localStorage backup below still happen either way. */
function submitToGoogleSheet(record) {
  if (!CONFIG.GOOGLE_SHEETS_URL) return;

  // Flatten the answers array into a single row-friendly object so each
  // question becomes its own column in the sheet.
  const flatRow = {
    "Survey ID": record.surveyId,
    "Survey Title": record.surveyTitle,
    "Submitted At": record.submittedAt
  };
  record.answers.forEach((a, i) => {
    flatRow[`Q${i + 1}: ${a.question}`] = Array.isArray(a.answer) ? a.answer.join(", ") : (a.answer ?? "");
  });

  // Apps Script web apps don't send CORS headers back, so the browser
  // can't read the response — that's fine, we don't need to. "no-cors"
  // still delivers the request; we just can't inspect what came back.
  fetch(CONFIG.GOOGLE_SHEETS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" }, // avoids a CORS preflight
    body: JSON.stringify(flatRow)
  }).catch(() => {
    /* Network hiccup — the response is still safe in the downloaded
       .json file and in this browser's localStorage backup. */
  });
}

/* ---------- 8. localStorage: save-in-progress + export ---------- */
function progressKey(surveyId) { return `nutrezy_progress_survey_${surveyId}`; }

function saveProgress(surveyId, answersObj, qIndex) {
  try {
    localStorage.setItem(progressKey(surveyId), JSON.stringify({ answers: answersObj, qIndex }));
  } catch (e) { /* localStorage unavailable — fail silently, survey still works in-session */ }
}

function loadProgress(surveyId) {
  try {
    const raw = localStorage.getItem(progressKey(surveyId));
    if (!raw) return null;
    return JSON.parse(raw); // { answers, qIndex }
  } catch (e) { return null; }
}

function clearProgress(surveyId) {
  try { localStorage.removeItem(progressKey(surveyId)); } catch (e) { /* ignore */ }
}

function storeCompletedResponse(record) {
  try {
    const all = JSON.parse(localStorage.getItem("nutrezy_responses") || "[]");
    all.push(record);
    localStorage.setItem("nutrezy_responses", JSON.stringify(all));
  } catch (e) { /* ignore */ }
}

/* Downloads this single response as a .json file — quick, quiet export */
function exportResponseAsJSON(record) {
  try {
    const blob = new Blob([JSON.stringify(record, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nutrezy-survey-${record.surveyId}-response.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) { /* export is a bonus — never block submission if it fails */ }
}

/* ---------- 9. CURSOR GLOW ---------- */
const glow = document.getElementById("cursorGlow");
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.addEventListener("mousemove", (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
    glow.classList.add("active");
  });
  document.addEventListener("mouseleave", () => glow.classList.remove("active"));
}
