# Today I Learned (TIL)

## Day 1
- DOM Manipulation using `querySelector()` and `getElementById()`
- Event Delegation for handling button clicks
- Maintaining application state using JavaScript variables
- Updating the calculator display dynamically

## Day 2
- Expression building using strings
- Using `eval()` to evaluate mathematical expressions
- Error handling with `try...catch`
- Working with helper functions to avoid repeated code

## Day 3
- Input validation for numbers, operators, decimals, and parentheses
- Managing bracket balance using a counter
- Handling edge cases like leading zeros and multiple decimal points
- Breaking large problems into smaller functions

## Day 4
- Refactoring code into reusable Helper and Handler functions
- Separating application logic from event listeners
- Implementing keyboard support using `keydown` events
- Mapping keyboard keys to calculator actions
- Designing cleaner and more maintainable JavaScript code

## Day 5

- Implemented cursor-based editing instead of only appending characters
- Learned how to track the caret position using `selectionStart`
- Used `slice()` to insert and delete characters at arbitrary cursor positions
- Implemented Backspace and Forward Delete behavior
- Added keyboard navigation using Arrow Left, Arrow Right, Home, and End keys
- Refactored helper functions to make them cursor-aware
- Learned why separating helper functions from handler functions improves maintainability
- Improved input validation while editing expressions in the middle of the string

## Day 6

- Learned how to use `localStorage` to persist data between browser sessions
- Used `JSON.stringify()` to convert JavaScript arrays into strings before storing them
- Used `JSON.parse()` to restore stored data back into JavaScript objects
- Implemented a reusable rendering function that rebuilds the UI from application state
- Learned why rendering should depend on data rather than manually updating the DOM in multiple places
- Used event delegation with `closest()` to handle clicks on dynamically created history items
- Learned how `data-*` attributes (`dataset`) can associate DOM elements with JavaScript data
- Added initialization logic (`loadHistory()`) to restore application state when the page loads
- Implemented a maximum history size to prevent unlimited growth of stored data
- Improved separation of responsibilities by keeping calculator logic and history management in separate files