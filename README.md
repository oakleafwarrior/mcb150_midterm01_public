# MCB 150 — Midterm 1 Study Tools
Spring 2026 | Prof. Saxton

---

## Folder Structure

```
midterm01_study/
├── README.md                          you are here
├── MCB150+Midterm+1+study+guide.pdf
│
├── flashcards/
│   ├── flashcards.txt                 term/definition pairs (Lectures 1–9)
│   ├── cli_flashcards.py              terminal flashcard app
│   ├── index.html                     web app (flashcards + practice questions)
│   ├── script.js
│   └── styles.css
│
└── questions/
    ├── practice_problems.txt          58 exam-style practice problems
    └── pset_problems.txt              transcribed PSET 1–4 questions
```

---

## Web App

A browser-based app with two modes: **Flashcards** and **Practice Questions**.Toggle between them using the tabs at the top of the page.

### Run

Open terminal in the project root directory:
```bash
python3 -m http.server 8080
```

Leave that terminal open and go to http://localhost:8080/flashcards/ in your browser.

### Flashcards mode

Drills term: definition pairs from `flashcards.txt`.

- Click the card or use up/down arrows to flip between term and definition.
- Use the Previous / Next buttons or use left/right arrow keys to navigate.
- Click the shuffle icon to randomize the deck.

### Practice Questions mode

Displays 58 exam-style practice problems from
`questions/practice_problems.txt` one at a time.

- A section dropdown appears above the card. Filter to any of the 10
  study-guide sections or view all questions.
- Each card shows the section name and the full question text, including all
  sub-parts, exactly as formatted.
- Cards do not flip (there is no answer to reveal).
- Click the shuffle icon to randomize the question order.
- Use Previous / Next or left/right arrow keys to navigate.

---

## Terminal Flashcards

A command-line alternative to the web app, no browser needed.

```bash
cd flashcards
python3 cli_flashcards.py
```

1. Optionally shuffle the deck.
2. A term appears — try to recall the definition.
3. Press Enter to flip and reveal the answer.
4. Press Enter again to advance, or type q to quit.

---