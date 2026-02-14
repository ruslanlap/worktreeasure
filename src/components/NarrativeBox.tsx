import { motion, AnimatePresence } from 'framer-motion';
import { useGitEngine } from '../engine/useGitEngine';
import { levels } from '../data/levels';

export function NarrativeBox() {
  const currentLevel = useGitEngine((s) => s.currentLevel);
  const levelComplete = useGitEngine((s) => s.levelComplete);
  const gameComplete = useGitEngine((s) => s.gameComplete);
  const advanceLevel = useGitEngine((s) => s.advanceLevel);
  const resetGame = useGitEngine((s) => s.resetGame);

  if (gameComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-portal-green/40 bg-portal-green/5 p-5"
      >
        <h2 className="text-lg font-bold text-portal-green mb-2">
          You've got it!
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed mb-3">
          Now you know <code className="text-portal-purple">git worktree</code> — no more stashing, no more WIP commits, no more cloning the repo again.
        </p>
        <div className="text-xs text-gray-500 space-y-1 mb-4">
          <p className="font-semibold text-gray-400">Cheat sheet:</p>
          <p>
            &bull; <code>git worktree add ../folder branch</code>{' '}
            — open a second folder on another branch
          </p>
          <p>
            &bull; <code>git worktree list</code>{' '}
            — see all active worktrees
          </p>
          <p>
            &bull; <code>git worktree remove ../folder</code>{' '}
            — delete the folder (commits stay safe)
          </p>
          <p className="mt-2 font-semibold text-gray-400">When to use it:</p>
          <p>&bull; Urgent hotfix while mid-feature</p>
          <p>&bull; PR review without losing your context</p>
          <p>&bull; AI agent working in parallel (e.g. Claude Code in a worktree)</p>
          <p>&bull; Running tests on one branch while coding on another</p>
          <p className="mt-2 font-semibold text-gray-400">Key fact:</p>
          <p>&bull; All worktrees share the same .git — commits made anywhere are visible everywhere</p>
        </div>
        <button
          onClick={resetGame}
          className="px-4 py-2 text-xs font-mono rounded-md border border-portal-purple/40 bg-portal-purple/10 text-portal-purple hover:bg-portal-purple/20 transition-colors cursor-pointer"
        >
          Start Over
        </button>
      </motion.div>
    );
  }

  const level = levels[currentLevel];
  if (!level) return null;

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 overflow-hidden">
      {/* Level header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/80 border-b border-gray-800">
        <span className="text-xs font-mono text-portal-purple font-semibold">
          {level.title}
        </span>
        <div className="flex items-center gap-2">
          {levels.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < currentLevel
                  ? 'bg-portal-green'
                  : i === currentLevel
                    ? 'bg-portal-purple animate-pulse'
                    : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Narrative content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={level.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="p-4 space-y-3"
        >
          {/* Lore */}
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
            {level.lore}
          </p>

          {/* Task box */}
          <div className="rounded-md border border-portal-blue/30 bg-portal-blue/5 p-3">
            <p className="text-[10px] uppercase tracking-wider text-portal-blue/70 mb-1">
              Your turn
            </p>
            <p className="text-sm text-portal-blue font-mono whitespace-pre-line">
              {level.task}
            </p>
          </div>

          {/* Hint */}
          <details className="group">
            <summary className="text-[10px] uppercase tracking-wider text-gray-600 cursor-pointer hover:text-gray-400 transition-colors">
              Need a hint?
            </summary>
            <p className="text-xs text-gray-500 mt-1 pl-2 border-l border-gray-800">
              {level.hint}
            </p>
          </details>

          {/* Level complete banner */}
          <AnimatePresence>
            {levelComplete && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-md border border-portal-green/40 bg-portal-green/10 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-portal-green">
                      Got it!
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Nice work. Ready for the next scenario?
                    </p>
                  </div>
                  <button
                    onClick={advanceLevel}
                    className="px-4 py-2 text-xs font-mono rounded-md bg-portal-green/20 border border-portal-green/40 text-portal-green hover:bg-portal-green/30 transition-colors cursor-pointer"
                  >
                    Next Scenario
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
