import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/LatexAssistant.css';
import TopBar from './TopBar/TopBar';

const LatexAssistant = () => {
  const [latexCode, setLatexCode] = useState<string>(`\\documentclass{article}
\\usepackage{geometry}
\\usepackage{amsmath}
\\usepackage{booktabs}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{natbib}

\\title{Analysis of Speech Pattern Recognition Techniques}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
This paper examines various techniques for identifying distinctive speech patterns in political discourse. We analyze audio features including MFCCs, pitch variations, and speech rhythm to create a computational model for speaker identification. Our experiments demonstrate that a combined approach utilizing both textual and audio analysis yields superior results compared to single-modality approaches.
\\end{abstract}

\\section{Introduction}
Speech pattern recognition has become increasingly important in various fields, including political discourse analysis, speaker verification, and media studies. Recent advancements in machine learning have enabled more accurate identification of specific speakers based on their unique vocal characteristics \\citep{smith2022}.

\\section{Methodology}
Our approach combines traditional audio feature extraction with neural network-based classification. We extract Mel-frequency cepstral coefficients (MFCCs), pitch contours, and rhythm metrics to create a comprehensive feature vector for each audio sample.

\\subsection{Feature Extraction}
For each audio sample, we extract the following features:
\\begin{itemize}
    \\item 13 MFCCs and their statistical variations
    \\item Fundamental frequency (F0) characteristics
    \\item Speech rate and rhythm metrics
    \\item Spectral contrast features
    \\item Energy distribution patterns
\\end{itemize}

\\subsection{Model Architecture}
We implement a multi-layer neural network with the following structure:
\\begin{equation}
f(x) = \\sigma(W_3 \\cdot \\sigma(W_2 \\cdot \\sigma(W_1 \\cdot x + b_1) + b_2) + b_3)
\\end{equation}
where $\\sigma$ represents the ReLU activation function, and $W_i$ and $b_i$ are the weights and biases of layer $i$.

\\section{Results}
Our experiments were conducted on a dataset of 120 speech samples from 8 different political speakers. Table \\ref{tab:results} presents the accuracy scores for different feature combinations.

\\begin{table}[h]
\\centering
\\caption{Performance of Different Feature Sets}
\\label{tab:results}
\\begin{tabular}{@{}lccc@{}}
\\toprule
\\textbf{Feature Set} & \\textbf{Precision} & \\textbf{Recall} & \\textbf{F1 Score} \\\\
\\midrule
MFCCs only & 0.78 & 0.75 & 0.76 \\\\
Pitch + Rhythm & 0.65 & 0.62 & 0.63 \\\\
Spectral Features & 0.72 & 0.69 & 0.70 \\\\
All Audio Features & 0.85 & 0.83 & 0.84 \\\\
Text + Audio (Combined) & \\textbf{0.92} & \\textbf{0.91} & \\textbf{0.91} \\\\
\\bottomrule
\\end{tabular}
\\end{table}

As shown in Table \\ref{tab:results}, the combination of textual and audio features yields the highest performance metrics, with an F1 score of 0.91.

\\section{Discussion}
The experimental results demonstrate that while individual feature sets provide reasonable accuracy, the combined approach significantly outperforms single-modality methods. This suggests that speech patterns are manifested through multiple dimensions that should be analyzed together.

\\subsection{Feature Importance}
Further analysis of feature importance revealed that certain MFCCs (particularly MFCC-2 and MFCC-4) and pitch variation metrics were the most discriminative individual features. However, the synergistic effect of combining features from different categories produced the most robust model.

\\section{Conclusion}
This study presents a comprehensive framework for political speech pattern analysis that leverages both audio and textual features. Our results indicate that multi-modal approaches significantly outperform single-modality methods in speaker identification tasks.

\\section{Future Work}
Future research directions include:
\\begin{itemize}
    \\item Incorporating contextual factors into the analysis
    \\item Exploring temporal dependencies through recurrent neural networks
    \\item Developing unsupervised approaches for feature discovery
\\end{itemize}

\\bibliographystyle{plainnat}
\\bibliography{references}

\\appendix
\\section{Implementation Details}
The neural network was implemented using TensorFlow 2.8.0 with the following hyperparameters:
\\begin{itemize}
    \\item Learning rate: 0.001
    \\item Batch size: 32
    \\item Dropout rate: 0.3
    \\item Training epochs: 100 (with early stopping)
\\end{itemize}

\\end{document}`);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compileError, setCompileError] = useState<string>('');
  const [errorLog, setErrorLog] = useState<string>('');
  
  // Add state for chat
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'system', content: 'Welcome to LaTeX Assistant! How can I help you with your document?' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  
  // Define chat window width (fixed, not resizable)
  const chatWidth = 20; // 20% of the total width
  
  // Add state for resizer
  const [editorWidth, setEditorWidth] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  // Handle resizer drag with useCallback
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !contentRef.current) return;
    
    const containerRect = contentRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    // Calculate percentage (constrained between 30% and 70%) - adjusted for chat window
    // The editor and PDF now share (100 - chatWidth)% of the space
    const availableWidth = containerWidth * (1 - chatWidth / 100);
    const availableWidthStart = containerWidth * (chatWidth / 100);
    
    // Calculate the position relative to the available space
    const relativeX = mouseX - availableWidthStart;
    let newEditorWidthPercentage = (relativeX / availableWidth) * 100;
    
    // Constrain between 30% and 70% of the available space
    newEditorWidthPercentage = Math.max(30, Math.min(70, newEditorWidthPercentage));
    
    // Convert to percentage of total width
    const newEditorWidth = newEditorWidthPercentage * (1 - chatWidth / 100);
    
    setEditorWidth(newEditorWidth);
    
    // Update resizer position
    if (resizerRef.current) {
      resizerRef.current.style.left = `${chatWidth + newEditorWidth}%`;
    }
  }, [isDragging, chatWidth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle chat submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMessage = { role: 'user', content: chatInput };
    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');
    
    // Here you would typically send the message to an API and get a response
    // For now, we'll just simulate a response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'system', 
        content: 'I received your message. This is a placeholder response.' 
      }]);
    }, 1000);
  };

  const compileLatex = async () => {
    try {
      setIsCompiling(true);
      setCompileError('');
      setErrorLog('');
      
      // Use our proxy server to avoid CORS issues
      const response = await fetch('http://localhost:3001/compile-latex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latexCode })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorLog(errorData.log || '');
        throw new Error(errorData.message || 'Compilation failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      
    } catch (error) {
      console.error('Error handling LaTeX:', error);
      setCompileError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsCompiling(false);
    }
  };

  // Function to handle error display with more details
  const renderErrorMessage = () => {
    if (!compileError) return null;
    
    return (
      <div className="compile-error">
        <h3>Compilation Error</h3>
        <p>{compileError}</p>
        
        {errorLog && (
          <div className="error-log">
            <h4>Compilation Log</h4>
            <pre>{errorLog}</pre>
          </div>
        )}
        
        <div className="error-help">
          <p>Common LaTeX errors:</p>
          <ul>
            <li>Missing packages - Make sure all required packages are included</li>
            <li>Syntax errors - Check for missing braces or commands</li>
            <li>Undefined control sequences - Check for typos in LaTeX commands</li>
            <li>File not found - Check that all referenced files exist</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="latex-assistant">
      <TopBar 
        projectName="main.tex" 
        onCompile={compileLatex}
        isCompiling={isCompiling}
        simplified={true}
      />
      
      <div className="latex-content" ref={contentRef}>
        {/* Chat Window */}
        <div className="chat-window" style={{ width: `${chatWidth}%` }}>
          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="chat-input-form">
            <input
              type="text"
              className="chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about LaTeX..."
            />
            <button type="submit" className="chat-submit">Send</button>
          </form>
        </div>
        
        <div 
          className="editor-container" 
          style={{ width: `${editorWidth}%` }}
        >
          <textarea
            className="editor-window"
            value={latexCode}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLatexCode(e.target.value)}
          />
        </div>
        
        {/* Resizer handle */}
        <div 
          className={`resizer ${isDragging ? 'active' : ''}`}
          ref={resizerRef}
          style={{ left: `${chatWidth + editorWidth}%` }}
          onMouseDown={handleMouseDown}
        />
        
        <div 
          className="pdf_Window"
          style={{ width: `${100 - chatWidth - editorWidth}%` }}
        >
          {compileError ? (
            renderErrorMessage()
          ) : (
            pdfUrl ? (
              <iframe
                className="pdf-viewer simplified"
                src={pdfUrl}
                title="LaTeX Preview"
              />
            ) : (
              <div className="pdf-placeholder">
                {isCompiling ? 'Processing your LaTeX code...' : 'Preview will appear here'}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default LatexAssistant;
