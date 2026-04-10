/**
 * @module useTestFormatter
 * Provides utility functions to format raw simulator output strings into styled React components.
 */

import React from 'react';

/**
 * Custom hook exposing text parsing utilities.
 * @returns An object containing the `renderWithInputs` function.
 */
export const useTestFormatter = () => {
  
  /**
   * Parses raw MIPS console output and structurally injects the provided inputs
   * in sequence after common prompt characters (e.g., ':' or '?').
   * @param rawText - The unformatted string output from the simulator.
   * @param inputsString - A newline-separated string of user inputs.
   * @returns An array of styled React Nodes for direct rendering.
   */
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