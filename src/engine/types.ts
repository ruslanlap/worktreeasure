/** Virtual file system node */
export interface FSNode {
  name: string;
  type: 'file' | 'directory';
  children?: FSNode[];
  /** Marks a file as having uncommitted changes */
  dirty?: boolean;
}

/** A git worktree entry */
export interface Worktree {
  /** Absolute path in the virtual FS, e.g. "~/urgent-fix" */
  path: string;
  /** Branch name this worktree is on */
  branch: string;
  /** The folder name for display */
  folderName: string;
  /** Files in this worktree */
  files: FSNode[];
  /** Whether this worktree has uncommitted changes */
  dirty: boolean;
  /** Whether this is the main worktree (bare repo) */
  isMain: boolean;
}

/** A single line of terminal output */
export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'info';
  text: string;
}

/** Level definition for the game */
export interface Level {
  id: number;
  title: string;
  lore: string;
  task: string;
  hint: string;
  /** Commands that trigger level completion validation */
  validationCommand: string;
  /** Function that checks if the level is complete given current state */
  validate: (state: GameState) => boolean;
}

/** Full game state */
export interface GameState {
  /** Current working directory path */
  cwd: string;
  /** All worktrees */
  worktrees: Worktree[];
  /** Terminal output history */
  terminalHistory: TerminalLine[];
  /** Current level index */
  currentLevel: number;
  /** Whether the current level is completed */
  levelComplete: boolean;
  /** Whether the entire game is completed */
  gameComplete: boolean;
  /** Branches that are "checked out" in worktrees (locked) */
  lockedBranches: string[];
  /** Last command that was run */
  lastCommand: string;
}
