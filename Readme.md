# Modern Calculator
Unlike a basic calculator that only appends characters, this project supports cursor-aware editing, allowing expressions to be modified at any position using both the mouse and keyboard.

A modern calculator built using **HTML, CSS, and Vanilla JavaScript**.

This project is being developed incrementally to strengthen my understanding of DOM manipulation, event handling, state management, and modern JavaScript.



---

## Current Features

- ✅ Modern responsive UI
- ✅ Number input
- ✅ Basic operator support (+, -, ×, ÷)
- ✅ Parentheses support
- ✅ AC (All Clear)
- ✅ DEL (Delete Last Character)
- ✅ Expression evaluation (`=`)
- ✅ Smart operator replacement
- ✅ Decimal validation
- ✅ Leading zero handling
- ✅ Parentheses validation
- ✅ Continue calculations using previous result
- ✅ Error handling for invalid expressions
- ✅ Event Delegation
- ✅ Keyboard support
- ✅ Shared input handling for mouse and keyboard
- ✅ Modular JavaScript architecture
- ✅ Helper and Handler function separation
- ✅ Cursor editing support
- ✅ Cursor-aware expression editing
- ✅ Arrow key navigation
- ✅ Home / End key support
- ✅ Forward Delete support 
- ✅ Calculation history
- ✅ Persistent history using Local Storage
- ✅ Click history items to reload expressions
- ✅ Clear history
- ✅ Automatic history limit (50 calculations)
- ✅ Light / Dark Theme
- ✅ Theme persistence using Local Storage
- ✅ Custom expression parser (without eval())
- ✅ Expression preprocessing
- ✅ Infix to Postfix conversion (Shunting Yard Algorithm)
- ✅ Custom Postfix Evaluation Engine
- ✅ Unary minus support
- ✅ Implicit multiplication support
- ✅ Parentheses support


---

## Planned Features

- 📱 Better mobile experience
- 🧮 Scientific calculator mode

---

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Browser Local Storage

---

## Project Structure

```
Calculator/
Calculator/
│── index.html
│── style.css
│── script.js
│── history.js
│── theme.js
│── README.md
└── TIL.md
```


## ⚙️ Expression Evaluation Pipeline

Instead of relying on JavaScript's `eval()`, the calculator evaluates expressions using a custom parser.

Expression
        ↓
Preprocessor
        ↓
Tokenizer
        ↓
Shunting Yard Algorithm
        ↓
Postfix Expression
        ↓
Stack Based Evaluator
        ↓
Final Result
---

## 🧠 Algorithms Used

- Shunting Yard Algorithm
- Stack-based Postfix Evaluation
- Expression Tokenization
- Expression Preprocessing
- Parentheses Matching


## Learning Goals

This project is helping me practice:

- DOM Manipulation
- Event Delegation
- JavaScript Events
- Expression Handling
- State Management
- Error Handling
- Code Refactoring
- Writing Reusable Helper Functions
- Modular JavaScript Architecture
- Responsive UI Design
- Keyboard Event Handling
- Event Translation (Keyboard → Calculator Actions)
- Modular Code Organization
- Cursor Management
- Caret Position Tracking
- Keyboard Navigation
- Expression Editing
- Local Storage
- Data Persistence
- Event Delegation
- State Synchronization
- CSS Variables
- Theme Management
- Local Storage
- UI State Persistence
- Decimal Validation
- Unary Minus Support
- Implicit Multiplication
- Percentage Support
- Automatic Leading Zero
- Error Handling
- Parentheses Validation
- Custom Expression Parser
- No use of eval()

---

## Development Progress

| Phase | Status |
|--------|--------|
| UI Design | ✅ Completed |
| Calculator Foundation | ✅ Completed |
| Expression Evaluation | ✅ Completed |
| Smart Input Validation | ✅ Completed |
| Code Refactoring | ✅ Completed |
| Keyboard Support | ✅ Completed |
| Cursor Editing  | ✅ Completed |
| Calculation History | ✅ Completed |
| Theme Support | ✅ Completed |
| Custom Expression Parser |⏳ Next |

---

## Future Improvements

## 🚀 Planned Features

## 🚀 Planned Features

- 🔄 Replace `eval()` with a custom expression parser
- 📱 Improve mobile responsiveness
- ⌨️ More keyboard shortcuts and accessibility improvements
- ✨ Additional UI/UX polish


---

## Documentation

This repository also includes a **TIL.md (Today I Learned)** file where I document the concepts, JavaScript techniques, and lessons I learn while building this project.

## Author

**Shubham Kulkarni**