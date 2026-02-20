// ── State ─────────────────────────────────────────────────────────────────
let flashcards = [];
let questions = [];
let filteredQuestions = [];
let currentIndex = 0;
let isFlipped = false;
let mode = 'flashcards'; // 'flashcards' | 'questions'

// ── DOM ───────────────────────────────────────────────────────────────────
const cardElement    = document.getElementById('flashcard');
const sceneElement   = document.getElementById('scene');
const textElement    = document.getElementById('card-text');
const labelElement   = document.getElementById('card-label');
const progressText   = document.getElementById('progress-text');
const progressBar    = document.getElementById('progress-bar');
const btnPrev        = document.getElementById('btn-prev');
const btnNext        = document.getElementById('btn-next');
const btnShuffle     = document.getElementById('btn-shuffle');
const tabFlashcards  = document.getElementById('tab-flashcards');
const tabQuestions   = document.getElementById('tab-questions');
const sectionFilter  = document.getElementById('section-filter');
const sectionFilterContainer = document.getElementById('section-filter-container');

// ── Init ──────────────────────────────────────────────────────────────────
async function init() {
    try {
        const [fcRes, qRes] = await Promise.all([
            fetch('./flashcards.txt'),
            fetch('../questions/practice_problems.txt')
        ]);
        if (!fcRes.ok) throw new Error('Failed to load flashcards.txt');
        if (!qRes.ok)  throw new Error('Failed to load practice_problems.txt');

        parseFlashcards(await fcRes.text());
        parseQuestions(await qRes.text());
        populateSectionFilter();
        updateUI();
    } catch (error) {
        console.error(error);
        showError('Failed to load data. Make sure you are running via a local server (python3 -m http.server 8080).');
    }
}

// ── Parsers ───────────────────────────────────────────────────────────────
function parseFlashcards(text) {
    const lines = text.split('\n');
    let currentQ = null, currentA = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('Q: ')) {
            currentQ = line.substring(3).trim();
        } else if (line.startsWith('A: ')) {
            currentA = line.substring(3).trim();
            let j = i + 1;
            while (j < lines.length && !lines[j].trim().startsWith('Q: ') && !lines[j].startsWith('=')) {
                if (lines[j].trim()) currentA += ' ' + lines[j].trim();
                j++;
            }
            i = j - 1;
            if (currentQ && currentA) {
                flashcards.push({ q: currentQ, a: currentA });
                currentQ = null;
                currentA = null;
            }
        }
    }
}

function parseQuestions(text) {
    const lines = text.split('\n');
    let currentSection = '';
    let currentNumber  = null;
    let currentText    = null;
    const problemStart = /^(\d+)\.\s+(.+)/;

    for (const line of lines) {
        const stripped = line.trimEnd();
        if (stripped.startsWith('=') || stripped.startsWith('-')) continue;
        if (/^SECTION \d+:/.test(stripped)) { currentSection = stripped; continue; }

        const m = stripped.match(problemStart);
        if (m) {
            if (currentText !== null) {
                questions.push({ number: currentNumber, section: currentSection, text: currentText.trim() });
            }
            currentNumber = parseInt(m[1]);
            currentText   = m[2];
        } else if (currentText !== null) {
            currentText += '\n' + stripped;
        }
    }
    if (currentText !== null) {
        questions.push({ number: currentNumber, section: currentSection, text: currentText.trim() });
    }
    filteredQuestions = [...questions];
}

function populateSectionFilter() {
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = 'All Sections';
    sectionFilter.appendChild(allOpt);

    const seen = new Set();
    for (const q of questions) {
        if (!seen.has(q.section)) {
            seen.add(q.section);
            const opt = document.createElement('option');
            opt.value = q.section;
            const parts = q.section.match(/^SECTION (\d+):\s*(.+)$/);
            opt.textContent = parts ? `${parts[1]}. ${parts[2]}` : q.section;
            sectionFilter.appendChild(opt);
        }
    }
}

// ── UI ────────────────────────────────────────────────────────────────────
function updateUI() {
    const items = mode === 'flashcards' ? flashcards : filteredQuestions;
    if (!items.length) { showError('No items to display.'); return; }

    const item = items[currentIndex];
    isFlipped = false;

    if (mode === 'flashcards') {
        labelElement.textContent = 'Term';
        textElement.textContent  = item.q;
        cardElement.classList.remove('question-mode');
        sceneElement.classList.remove('question-mode');
        sectionFilterContainer.style.display = 'none';
        btnShuffle.style.display = '';
    } else {
        const parts = item.section.match(/^SECTION (\d+):\s*(.+)$/);
        labelElement.textContent = parts ? `Section ${parts[1]} — ${parts[2]}` : item.section;
        textElement.textContent  = `${item.number}. ${item.text}`;
        cardElement.classList.add('question-mode');
        sceneElement.classList.add('question-mode');
        sectionFilterContainer.style.display = 'flex';
        btnShuffle.style.display = 'none';
    }

    const progress = ((currentIndex + 1) / items.length) * 100;
    progressText.textContent  = `${currentIndex + 1} / ${items.length}`;
    progressBar.style.width   = `${progress}%`;
    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex === items.length - 1;
}

function flipCard() {
    if (mode !== 'flashcards' || !flashcards.length) return;
    isFlipped = !isFlipped;
    const card = flashcards[currentIndex];
    labelElement.textContent = isFlipped ? 'Definition' : 'Term';
    textElement.textContent  = isFlipped ? card.a : card.q;
}

function showError(msg) {
    textElement.textContent = msg;
    textElement.style.color = '#ff6b6b';
    labelElement.textContent = 'Error';
    progressText.textContent = 'Error';
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// ── Events ────────────────────────────────────────────────────────────────
tabFlashcards.addEventListener('click', () => {
    mode = 'flashcards';
    currentIndex = 0;
    tabFlashcards.classList.add('active');
    tabQuestions.classList.remove('active');
    updateUI();
});

tabQuestions.addEventListener('click', () => {
    mode = 'questions';
    currentIndex = 0;
    tabFlashcards.classList.remove('active');
    tabQuestions.classList.add('active');
    updateUI();
});

sectionFilter.addEventListener('change', () => {
    const val = sectionFilter.value;
    filteredQuestions = val === 'all' ? [...questions] : questions.filter(q => q.section === val);
    currentIndex = 0;
    updateUI();
});

cardElement.addEventListener('click', () => {
    if (mode === 'flashcards') flipCard();
});

btnPrev.addEventListener('click', () => {
    if (currentIndex > 0) { currentIndex--; updateUI(); }
});

btnNext.addEventListener('click', () => {
    const items = mode === 'flashcards' ? flashcards : filteredQuestions;
    if (currentIndex < items.length - 1) { currentIndex++; updateUI(); }
});

btnShuffle.addEventListener('click', () => {
    if (mode === 'flashcards' && flashcards.length > 0) {
        shuffleArray(flashcards);
        currentIndex = 0;
        updateUI();
    }
});

document.addEventListener('keydown', (e) => {
    const items = mode === 'flashcards' ? flashcards : filteredQuestions;
    if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentIndex < items.length - 1 && document.activeElement !== btnShuffle) {
            currentIndex++; updateUI();
        }
    } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) { currentIndex--; updateUI(); }
    } else if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && mode === 'flashcards') {
        flipCard();
    }
});

// ── Start ─────────────────────────────────────────────────────────────────
init();
