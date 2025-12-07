# JS Code Playground (Next.js)

A lightweight, interactive JavaScript code editor built with Next.js. This application allows users to write code, execute it instantly in the browser, automatically fix common syntax errors, and get help from an AI assistant.

**Built for the Coding Jr Coding Challenge.**

## 🚀 Features

- **Live Code Execution**: Runs JavaScript code directly in the browser and captures console output in a terminal-style window.
- **Auto-Fixer**: Automatically corrects common syntax mistakes (semicolons, indentation, unclosed brackets).
- **AI Help Assistant**: A centered, animated pop-up chat interface that answers coding questions.
- **Modern UI**: Dark mode interface inspired by VS Code, built with Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Editor**: React Simple Code Editor & PrismJS

## 🏃‍♂️ How to Run Locally

1. **Clone the repository**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/js-code-playground.git](https://github.com/YOUR_USERNAME/js-code-playground.git)
   cd js-code-playground
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   
3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser Visit http://localhost:3000**

## 🧪 How to Test Features

### 1. Auto-Fix Logic
The auto-fixer handles the following rules:
- **Missing Semicolons**: Adds `;` to the end of statements.
- **Bracket Balancing**: Closes unclosed `{` curly braces.
- **Indentation**: Fixes basic spacing.

**Try pasting this broken code and clicking "Auto-Fix":**
```javascript
const x = 10
if(x > 5) {
console.log("Hello")
```

### 2. AI Help Assistant
Click the **AI Help** button and try asking these keywords:
- "How do I write a **loop**?"
- "What is a **variable**?"
- "How to create a **function**?"
