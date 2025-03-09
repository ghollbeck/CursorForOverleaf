import { useState, ChangeEvent } from 'react';
import '../styles/TextBox.css';

const loremIpsumText = `I'm going to show you how to analyze Trump's speech patterns. We have the best analysis, tremendous analysis. People are saying it's the most beautiful analysis they've ever seen. 

Step 1: We'll import all the libraries, the best libraries. We have numpy, pandas, librosa for audio - it's fantastic, believe me. And transformers, torch, TensorFlow - all the best machine learning stuff.

Step 2: We load the data, tremendous data. The most beautiful transcripts and audio you've ever seen. We'll show you the structure, it's going to be amazing.

Step 3: BERT analysis - very smart, very sophisticated. We'll get embeddings, the best embeddings. Nobody does embeddings better than us.`;

interface TextBoxProps {
  initialText?: string;
}

const TextBox = ({ initialText = loremIpsumText }: TextBoxProps) => {
  const [text, setText] = useState(initialText);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="text-box-container">
      <textarea
        className="text-box"
        value={text}
        onChange={handleChange}
        placeholder="Enter text here..."
        rows={10}
      />
    </div>
  );
};

export default TextBox;
