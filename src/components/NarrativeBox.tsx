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
          MISSION COMPLETE
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed mb-3">
          Outstanding work, Agent 42. You've mastered the Portal Gun
          (<code className="text-portal-purple">git worktree</code>).
          You can now exist in multiple dimensions simultaneously --
          no more stashing, no more context-switching headaches.
        </p>
        <div className="text-xs text-gray-500 space-y-1 mb-4">
          <p>Key takeaways:</p>
          <p>
            &bull; <code>git worktree add &lt;path&gt; &lt;branch&gt;</code>{' '}
            -- creates a new working directory on a different branch
          </p>
          <p>
            &bull; <code>git worktree list</code>{' '}
            -- shows all active worktrees
          </p>
          <p>
            &bull; <code>git worktree remove &lt;path&gt;</code>{' '}
            -- cleans up a linked worktree
          </p>
        </div>
        <button
          onClick={resetGame}
          className="px-4 py-2 text-xs font-mono rounded-md border border-portal-purple/40 bg-portal-purple/10 text-portal-purple hover:bg-portal-purple/20 transition-colors cursor-pointer"
        >
          Restart Mission
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
              Mission Objective
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
                      Objective Complete!
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Portal stabilized. Proceed to next dimension.
                    </p>
                  </div>
                  <button
                    onClick={advanceLevel}
                    className="px-4 py-2 text-xs font-mono rounded-md bg-portal-green/20 border border-portal-green/40 text-portal-green hover:bg-portal-green/30 transition-colors cursor-pointer"
                  >
                    Next Level
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
