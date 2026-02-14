import { motion, AnimatePresence } from 'framer-motion';
import { useGitEngine } from '../engine/useGitEngine';
import type { FSNode, Worktree } from '../engine/types';

/** Icon components */
function FolderIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`w-5 h-5 ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  );
}

function FileIcon({ dirty }: { dirty?: boolean }) {
  return (
    <svg
      className={`w-4 h-4 ${dirty ? 'text-terminal-warning' : 'text-gray-500'}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      className="w-4 h-4 text-terminal-warning"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PortalIcon() {
  return (
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
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}

/** Render a single file node */
function FileNode({ node, depth = 0 }: { node: FSNode; depth?: number }) {
  const indent = depth * 16;

  if (node.type === 'directory') {
    return (
      <div>
        <div
          className="flex items-center gap-1.5 py-0.5 text-xs text-gray-400 hover:text-gray-300"
          style={{ paddingLeft: `${indent}px` }}
        >
          <FolderIcon className="text-portal-amber" />
          <span>{node.name}/</span>
        </div>
        {node.children?.map((child) => (
          <FileNode key={child.name} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1.5 py-0.5 text-xs"
      style={{ paddingLeft: `${indent}px` }}
    >
      <FileIcon dirty={node.dirty} />
      <span className={node.dirty ? 'text-terminal-warning' : 'text-gray-500'}>
        {node.name}
      </span>
      {node.dirty && (
        <span className="text-[10px] text-terminal-warning/70 ml-1">
          modified
        </span>
      )}
    </div>
  );
}

/** Render a worktree folder card */
function WorktreeCard({
  worktree,
  isActive,
}: {
  worktree: Worktree;
  isActive: boolean;
}) {
  const branchColor = worktree.branch === 'main'
    ? 'text-portal-green'
    : 'text-portal-blue';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.6, y: -20, filter: 'blur(8px)' }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.8,
      }}
      className={`
        relative rounded-xl border p-4
        ${isActive
          ? 'border-portal-purple/60 bg-portal-purple/5 shadow-lg shadow-portal-purple/10'
          : 'border-gray-700/50 bg-gray-900/50'}
        transition-colors duration-300
      `}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute -left-px top-3 bottom-3 w-1 rounded-full bg-portal-purple"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderIcon
            className={
              worktree.isMain ? 'text-portal-blue' : 'text-portal-purple'
            }
          />
          <span className="font-mono text-sm font-semibold text-gray-200">
            {worktree.folderName}/
          </span>
          {!worktree.isMain && <PortalIcon />}
        </div>
        {worktree.dirty && (
          <div className="flex items-center gap-1">
            <WarningIcon />
            <span className="text-[10px] text-terminal-warning">DIRTY</span>
          </div>
        )}
      </div>

      {/* Branch badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] uppercase tracking-wider text-gray-600">
          Branch:
        </span>
        <span
          className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full border ${branchColor} ${
            worktree.branch === 'main'
              ? 'border-portal-green/30 bg-portal-green/10'
              : 'border-portal-blue/30 bg-portal-blue/10'
          }`}
        >
          {worktree.branch}
        </span>
        {worktree.isMain && (
          <span className="text-[10px] text-gray-600 px-1.5 py-0.5 rounded border border-gray-700 bg-gray-800">
            MAIN WORKTREE
          </span>
        )}
        {!worktree.isMain && (
          <span className="text-[10px] text-portal-purple/80 px-1.5 py-0.5 rounded border border-portal-purple/30 bg-portal-purple/10">
            LINKED
          </span>
        )}
      </div>

      {/* File tree */}
      <div className="border-t border-gray-800 pt-2 space-y-0">
        {worktree.files.map((f) => (
          <FileNode key={f.name} node={f} />
        ))}
      </div>
    </motion.div>
  );
}

/** Main Visualizer component */
export function Visualizer() {
  const worktrees = useGitEngine((s) => s.worktrees);
  const cwd = useGitEngine((s) => s.cwd);

  return (
    <div className="flex flex-col h-full rounded-lg border border-gray-800 bg-gray-900/30 overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 border-b border-gray-800">
        <div className="w-2 h-2 rounded-full bg-portal-purple animate-pulse" />
        <span className="text-xs text-gray-500">
          Multiverse Visualizer
        </span>
        <span className="ml-auto text-[10px] text-gray-600 font-mono">
          ~/  (Home Directory)
        </span>
      </div>

      {/* Worktree grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {worktrees.map((wt) => (
              <WorktreeCard
                key={wt.folderName}
                worktree={wt}
                isActive={wt.path === cwd}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Connection line between worktrees */}
        {worktrees.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center mt-4 gap-2"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-portal-purple/40 to-transparent" />
            <span className="text-[10px] text-portal-purple/60 font-mono px-2">
              LINKED via .git/worktrees
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-portal-purple/40 to-transparent" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
