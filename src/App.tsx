import { Terminal } from './components/Terminal';
import { Visualizer } from './components/Visualizer';
import { NarrativeBox } from './components/NarrativeBox';

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100 overflow-hidden">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-gray-800/60 bg-gray-950">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-portal-purple/20 border border-portal-purple/40 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-portal-purple"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-portal-green animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">
              <span className="text-portal-purple">Git Worktree</span>{' '}
              <span className="text-gray-300">Playground</span>
            </h1>
            <p className="text-[10px] text-gray-600 font-mono">
              Learn by doing // Interactive sandbox
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-gray-600 font-mono hidden sm:block">
            [Type "help" for commands]
          </span>
          <a
            href="https://git-scm.com/docs/git-worktree"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-gray-600 hover:text-portal-blue transition-colors font-mono"
          >
            git-worktree docs
          </a>
        </div>
      </header>

      {/* Main split-screen layout */}
      <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden min-h-0">
        {/* Left Panel: Narrative + Terminal */}
        <div className="flex flex-col lg:w-1/2 min-h-0 border-r border-gray-800/40">
          {/* Narrative */}
          <div className="shrink-0 p-4 overflow-y-auto max-h-[40vh] lg:max-h-[45vh]">
            <NarrativeBox />
          </div>

          {/* Terminal */}
          <div className="flex-1 p-4 pt-0 min-h-0">
            <Terminal />
          </div>
        </div>

        {/* Right Panel: Visualizer */}
        <div className="lg:w-1/2 p-4 min-h-0 overflow-hidden flex flex-col">
          <Visualizer />
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 flex items-center justify-center px-6 py-2 border-t border-gray-800/40 bg-gray-950">
        <span className="text-[10px] text-gray-700 font-mono">
          Safe sandbox — no real git repo is affected // Open Source
        </span>
      </footer>
    </div>
  );
}

export default App;
