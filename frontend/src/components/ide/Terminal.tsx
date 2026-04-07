import React, { useEffect, useRef } from 'react';
import { Terminal as XTerminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { socket } from '../../services/socket';

interface TerminalProps {
  inputEvent?: string;
  outputEvent?: string;
  finishEvent?: string;
  readOnly?: boolean;
  onInput?: (data: string) => void;
  onOutput?: (data: string) => void;
  onFinish?: () => void;
}

const Terminal: React.FC<TerminalProps> = ({
  inputEvent = 'input',
  outputEvent = 'output',
  finishEvent = 'execution_finished',
  readOnly = false,
  onInput,
  onOutput,
  onFinish
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerminal | null>(null);
  const onInputRef = useRef(onInput);
  const onOutputRef = useRef(onOutput);
  const onFinishRef = useRef(onFinish);
  
  // NUEVO: Buffer para agrupar las pulsaciones y permitir borrar antes de enviar
  const inputBuffer = useRef('');

  useEffect(() => {
    onInputRef.current = onInput;
    onOutputRef.current = onOutput;
    onFinishRef.current = onFinish;
  }, [onInput, onOutput, onFinish]);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerminal({
      cursorBlink: !readOnly,
      theme: { 
        background: readOnly ? '#0a0a14' : '#000000', 
        foreground: readOnly ? '#8b8b99' : '#ffffff',
        cursor: readOnly ? '#00000000' : '#ffffff'
      },
      fontFamily: 'monospace',
      fontSize: 15,
      lineHeight: 1.2,
      convertEol: true,
      disableStdin: readOnly
    });
    
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    
    setTimeout(() => {
      fitAddon.fit();
    }, 100);
    
    xtermRef.current = term;

    const handleOutput = (data: string) => {
      const fixedData = data.replace(/\r?\n/g, '\r\n');
      term.write(fixedData);
      if (onOutputRef.current) onOutputRef.current(fixedData);
    };

    const handleFinish = () => {
      term.write('\r\n\x1b[33m--- Ejecucion terminada ---\x1b[0m\r\n');
      if (onFinishRef.current) onFinishRef.current();
    };

    socket.on(outputEvent, handleOutput);
    socket.on(finishEvent, handleFinish);

    if (!readOnly) {
      term.onData((data) => {
        // 1. Manejo de Backspace (Borrar)
        if (data === '\x7f') {
          if (inputBuffer.current.length > 0) {
            inputBuffer.current = inputBuffer.current.slice(0, -1);
            term.write('\b \b'); // Retrocede, pinta un espacio en blanco y vuelve a retroceder
          }
          return;
        }
        
        // 2. Manejo de Intro (Enter) o pegado de múltiples líneas
        if (data.includes('\r') || data.includes('\n')) {
          const cleanData = data.replace(/\r/g, '\n');
          const toSend = inputBuffer.current + cleanData;
          
          socket.emit(inputEvent, toSend);
          
          // Pintamos el salto de línea visualmente
          term.write(cleanData.replace(/\n/g, '\r\n'));
          
          if (onInputRef.current) onInputRef.current(toSend);
          inputBuffer.current = ''; // Vaciamos el buffer
        } 
        // 3. Letras y números normales
        else {
          inputBuffer.current += data;
          // Pintamos el carácter en verde brillante
          term.write(`\x1b[32m${data}\x1b[0m`);
        }
      });
    }

    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      socket.off(outputEvent, handleOutput);
      socket.off(finishEvent, handleFinish);
      term.dispose();
    };
  }, [inputEvent, outputEvent, finishEvent, readOnly]);

  return (
    <div 
      ref={terminalRef} 
      className={`h-full w-full rounded-md border p-4 pb-6 ${
        readOnly ? 'border-purple-900/50 opacity-90' : 'border-gray-800'
      }`} 
      style={{ backgroundColor: readOnly ? '#0a0a14' : '#000000' }} 
    />
  );
};

export default Terminal;