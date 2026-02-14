import { useState, useRef, useEffect, useCallback } from 'react';
import { useGitEngine } from '../engine/useGitEngine';

export function Terminal() {
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cwd = useGitEngine((s) => s.cwd);
  const terminalHistory = useGitEngine((s) => s.terminalHistory);
  const executeCommand = useGitEngine((s) => s.executeCommand);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Focus input on mount and on click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const cmd = input.trim();
      if (!cmd) return;

      setCommandHistory((prev) => [...prev, cmd]);
      setHistoryIdx(-1);
      executeCommand(cmd);
      setInput('');
    },
    [input, executeCommand],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHistoryIdx((prev) => {
          const next = prev + 1;
          if (next < commandHistory.length) {
            setInput(commandHistory[commandHistory.length - 1 - next]);
            return next;
          }
          return prev;
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHistoryIdx((prev) => {
          const next = prev - 1;
          if (next < 0) {
            setInput('');
            return -1;
          }
          setInput(commandHistory[commandHistory.length - 1 - next]);
          return next;
        });
      }
    },
    [commandHistory],
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const getLineColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-terminal-error';
      case 'success':
        return 'text-terminal-success';
      case 'info':
        return 'text-portal-purple opacity-80';
      case 'input':
        return 'text-terminal-text';
      default:
        return 'text-terminal-text';
    }
  };

  return (
    <div
      className="flex flex-col h-full bg-terminal-bg rounded-lg border border-gray-800 overflow-hidden font-mono text-sm"
      onClick={focusInput}
    >
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 border-b border-gray-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-gray-500 ml-2">
          Multiverse Agency Terminal
        </span>
      </div>

      {/* Scrollable output area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-0.5"
      >
        {terminalHistory.map((line) => (
          <div
            key={line.id}
            className={`whitespace-pre-wrap break-all leading-relaxed ${getLineColor(line.type)}`}
          >
            {line.text}
          </div>
        ))}
      </div>

      {/* Input line */}
      <form onSubmit={handleSubmit} className="flex items-center px-4 py-3 border-t border-gray-800/50">
        <span className="text-terminal-prompt mr-2 shrink-0 text-xs">
          agent@agency:{cwd}$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-terminal-text caret-portal-green text-sm"
          spellCheck={false}
          autoComplete="off"
          autoFocus
        />
      </form>
    </div>
  );
}
