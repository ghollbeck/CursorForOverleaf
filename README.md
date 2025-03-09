# 29_LaTex_Assistant
# LaTeX Assistant

A modern web application that provides an interactive LaTeX editing environment with real-time compilation, PDF preview, and AI-powered assistance.

## Features

- **Interactive LaTeX Editor**: Write and edit LaTeX documents with syntax highlighting
- **Real-time PDF Preview**: Compile your LaTeX code and see the results instantly
- **AI Chat Assistant**: Get help with LaTeX commands, troubleshooting, and document structure
- **Resizable Interface**: Customize your workspace with a draggable divider between editor and preview
- **Error Handling**: Detailed error messages and logs to help debug LaTeX compilation issues
- **Responsive Design**: Works well on various screen sizes

## Project Structure

```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── TopBar/
│   │   └── LatexAssistant.tsx
│   ├── lib/
│   │   └── latexContent.js
│   ├── styles/
│   │   └── LatexAssistant.css
│   └── App.tsx
├── public/
└── package.json

backend/
├── server.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/latex-assistant.git
   cd latex-assistant
   ```

2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```
   cd ../backend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. The interface is divided into three main sections:
   - Left: AI chat assistant
   - Middle: LaTeX code editor
   - Right: PDF preview

2. Write or paste your LaTeX code in the editor.

3. Click the "Compile" button in the top bar to generate the PDF preview.

4. Use the chat assistant to ask questions about LaTeX syntax, troubleshoot errors, or get suggestions for your document.

5. Adjust the width of the editor and preview panels by dragging the divider between them.

## Technologies Used

- **Frontend**: React, TypeScript, CSS
- **Backend**: Node.js, Express
- **LaTeX Compilation**: Server-side LaTeX processing
- **AI Assistant**: Natural language processing for LaTeX assistance

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- LaTeX Project for the document preparation system
- React team for the frontend framework
- All contributors who have helped improve this project
