import React, { useEffect, useState } from 'react';
import './TypingAnimation.css';

const words = ['Artificial Intelligence', 'Visualization', 'Transparency', 'Trust'];

const TypingAnimation = () => {
  const [index, setIndex] = useState(0); // Index of the current word
  const [subIndex, setSubIndex] = useState(0); // Index of the next character to type/erase
  const [reverse, setReverse] = useState(false); // Direction of typing
  const [text, setText] = useState(''); // Current text to display
  const typingSpeed = 120; // Speed of typing and erasing
  const pauseDuration = 1500; // Duration of pause before erasing

  useEffect(() => {
    if (!reverse) {
      // Typing forward
      if (subIndex < words[index].length) {
        const timeout = setTimeout(() => {
          setText(text + words[index][subIndex]);
          setSubIndex(subIndex + 1);
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        // Pause after typing the complete word before starting to erase
        const timeout = setTimeout(() => {
          setReverse(true);
        }, pauseDuration);
        return () => clearTimeout(timeout);
      }
    } else {
      // Erasing
      if (subIndex > 0) {
        const timeout = setTimeout(() => {
          setText(text.slice(0, -1));
          setSubIndex(subIndex - 1);
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        // Switch to the next word after erasing is complete
        setReverse(false);
        setIndex((prevIndex) => (prevIndex + 1) % words.length);
      }
    }
  }, [subIndex, index, reverse, text]);

  return (
    <div className="typing-animation-container">
        <span className="typed-text">{text}</span>  
      <div className="circle"></div>
    </div>
  );
};

export default TypingAnimation;