import React from 'react';

export const useTestFormatter = () => {
  const renderWithInputs = (rawText: string, inputsString: string) => {
    if (!rawText) return null;
    if (!inputsString) return rawText;
    if (rawText === 'El programa no produjo ninguna salida.') return rawText;

    const inputs = inputsString.split('\n').filter(Boolean);
    let inputIndex = 0;

    const parts = rawText.split(/([:?][ \t]*)/g);
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < parts.length; i++) {
      elements.push(parts[i]);
      
      if (/^[:?][ \t]*$/.test(parts[i]) && inputIndex < inputs.length) {
        elements.push(
          <span key={`input-${i}-${inputIndex}`} className="text-green-400 font-bold">
            {inputs[inputIndex]}
          </span>
        );
        
        if (i + 1 < parts.length && !/^[\r\n]/.test(parts[i + 1])) {
          elements.push('\n');
        }
        inputIndex++;
      }
    }

    return elements;
  };

  return { renderWithInputs };
};