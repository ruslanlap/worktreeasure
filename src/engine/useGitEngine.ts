import { create } from 'zustand';
import type { GameState, TerminalLine, Worktree } from './types';
import { levels } from '../data/levels';

let lineId = 0;
const mkLine = (
  type: TerminalLine['type'],
  text: string,
): TerminalLine => ({
  id: String(++lineId),
  type,
  text,
});

/** Initial files in the project worktree (feature/auth branch) */
const projectFiles = [
  { name: 'login.ts', type: 'file' as const, dirty: true },
  { name: 'api.ts', type: 'file' as const, dirty: true },
  { name: 'package.json', type: 'file' as const },
  { name: 'README.md', type: 'file' as const },
  {
    name: 'src',
    type: 'directory' as const,
    children: [
      { name: 'app.ts', type: 'file' as const },
      { name: 'auth.ts', type: 'file' as const },
      { name: 'payments.ts', type: 'file' as const },
    ],
  },
];

/** Files that appear in the main branch worktree */
const mainBranchFiles = [
  { name: 'package.json', type: 'file' as const },
  { name: 'README.md', type: 'file' as const },
  {
    name: 'src',
    type: 'directory' as const,
    children: [
      { name: 'app.ts', type: 'file' as const },
      { name: 'payments.ts', type: 'file' as const },
    ],
  },
];

const initialWorktrees: Worktree[] = [
  {
    path: '~/my-project',
    branch: 'feature/auth',
    folderName: 'my-project',
    files: projectFiles,
    dirty: true,
    isMain: true,
  },
];

interface GitEngineStore extends GameState {
  executeCommand: (raw: string) => void;
  advanceLevel: () => void;
  resetGame: () => void;
}

export const useGitEngine = create<GitEngineStore>((set, get) => ({
  cwd: '~/my-project',
  worktrees: initialWorktrees,
  terminalHistory: [
    mkLine(
      'info',
      '~ Git Worktree Playground ~',
    ),
    mkLine('info', 'Type "help" for commands. Follow the scenarios on the left.'),
    mkLine('info', ''),
  ],
  currentLevel: 0,
  levelComplete: false,
  gameComplete: false,
  lockedBranches: ['feature/auth'],
  lastCommand: '',

  resetGame: () => {
    lineId = 0;
    set({
      cwd: '~/my-project',
      worktrees: [
        {
          path: '~/my-project',
          branch: 'feature/auth',
          folderName: 'my-project',
          files: projectFiles,
          dirty: true,
          isMain: true,
        },
      ],
      terminalHistory: [
        mkLine('info', '~ Git Worktree Playground ~'),
        mkLine('info', 'Type "help" for commands. Follow the scenarios on the left.'),
        mkLine('info', ''),
      ],
      currentLevel: 0,
      levelComplete: false,
      gameComplete: false,
      lockedBranches: ['feature/auth'],
      lastCommand: '',
    });
  },

  advanceLevel: () => {
    const { currentLevel } = get();
    const nextLevel = currentLevel + 1;
    if (nextLevel >= levels.length) {
      set({ gameComplete: true, levelComplete: false });
    } else {
      set({ currentLevel: nextLevel, levelComplete: false });
    }
  },

  executeCommand: (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const state = get();
    const { cwd, worktrees, terminalHistory } = state;

    // Build prompt string
    const prompt = `user@dev:${cwd}$ ${trimmed}`;
    const newHistory = [...terminalHistory, mkLine('input', prompt)];

    const addOutput = (type: TerminalLine['type'], text: string) => {
      newHistory.push(mkLine(type, text));
    };

    const tokens = trimmed.split(/\s+/);
    const cmd = tokens[0];

    // ---- COMMAND DISPATCH ----

    if (cmd === 'help') {
      addOutput('info', 'Available commands:');
      addOutput('info', '  ls            - List files in current directory');
      addOutput('info', '  cd <path>     - Change directory');
      addOutput('info', '  pwd           - Print working directory');
      addOutput('info', '  git status    - Show branch and working tree status');
      addOutput('info', '  git checkout  - Switch branches');
      addOutput('info', '  git worktree  - Manage linked worktrees');
      addOutput('info', '  git worktree add <path> <branch>');
      addOutput('info', '  git worktree list');
      addOutput('info', '  git worktree remove <path>');
      addOutput('info', '  clear         - Clear terminal');
      addOutput('info', '  help          - Show this help');
    } else if (cmd === 'clear') {
      set({
        terminalHistory: [],
        lastCommand: trimmed,
      });
      return;
    } else if (cmd === 'pwd') {
      addOutput('output', cwd);
    } else if (cmd === 'ls') {
      const currentWorktree = worktrees.find((w) => w.path === cwd);
      if (currentWorktree) {
        const listing = currentWorktree.files
          .map((f) => {
            const dirMarker = f.type === 'directory' ? '/' : '';
            const dirtyMarker = f.dirty ? ' [modified]' : '';
            return `  ${f.name}${dirMarker}${dirtyMarker}`;
          })
          .join('\n');
        addOutput('output', listing);
      } else {
        addOutput('output', '  core-repo/');
        const extraWorktrees = worktrees.filter((w) => !w.isMain);
        for (const wt of extraWorktrees) {
          addOutput('output', `  ${wt.folderName}/`);
        }
      }
    } else if (cmd === 'cd') {
      handleCd(tokens, state, addOutput, set, newHistory, trimmed);
      return;
    } else if (cmd === 'git') {
      handleGit(tokens, state, addOutput, set, newHistory, trimmed);
      return;
    } else {
      addOutput(
        'error',
        `command not found: ${cmd}. Type "help" for available commands.`,
      );
    }

    // Check level completion
    const newState: Partial<GitEngineStore> = {
      terminalHistory: newHistory,
      lastCommand: trimmed,
    };
    set(newState);

    // Validate after state update
    setTimeout(() => {
      const fresh = get();
      const level = levels[fresh.currentLevel];
      if (level && !fresh.levelComplete && level.validate(fresh)) {
        set({ levelComplete: true });
      }
    }, 50);
  },
}));

// ---- CD HANDLER ----

function handleCd(
  tokens: string[],
  state: GameState,
  addOutput: (type: TerminalLine['type'], text: string) => void,
  set: (partial: Partial<GitEngineStore>) => void,
  newHistory: TerminalLine[],
  trimmed: string,
) {
  const target = tokens[1];
  if (!target) {
    addOutput('error', 'cd: missing operand');
    set({ terminalHistory: newHistory, lastCommand: trimmed });
    return;
  }

  const { cwd, worktrees } = state;
  let newCwd = cwd;

  if (target === '..') {
    // Go up to parent (~)
    newCwd = '~';
  } else if (target.startsWith('../')) {
    // Navigate to sibling directory
    const folder = target.replace('../', '');
    const targetWorktree = worktrees.find((w) => w.folderName === folder);
    if (targetWorktree) {
      newCwd = targetWorktree.path;
    } else {
      addOutput('error', `cd: no such directory: ${target}`);
      set({ terminalHistory: newHistory, lastCommand: trimmed });
      return;
    }
  } else if (target === '~' || target === '/') {
    newCwd = '~';
  } else {
    // Try to enter a folder from ~ or from a worktree
    const wt = worktrees.find((w) => w.folderName === target);
    if (wt && (cwd === '~' || cwd === '~/')) {
      newCwd = wt.path;
    } else {
      addOutput('error', `cd: no such directory: ${target}`);
      set({ terminalHistory: newHistory, lastCommand: trimmed });
      return;
    }
  }

  set({ cwd: newCwd, terminalHistory: newHistory, lastCommand: trimmed });

  // Check level completion after cd
  setTimeout(() => {
    const fresh = useGitEngine.getState();
    const level = levels[fresh.currentLevel];
    if (level && !fresh.levelComplete && level.validate(fresh)) {
      set({ levelComplete: true });
    }
  }, 50);
}

// ---- GIT COMMAND HANDLER ----

function handleGit(
  tokens: string[],
  state: GameState,
  addOutput: (type: TerminalLine['type'], text: string) => void,
  set: (partial: Partial<GitEngineStore>) => void,
  newHistory: TerminalLine[],
  trimmed: string,
) {
  const sub = tokens[1];
  const { cwd, worktrees, lockedBranches } = state;

  const currentWorktree = worktrees.find((w) => w.path === cwd);

  if (!currentWorktree && sub !== 'worktree') {
    addOutput(
      'error',
      'fatal: not a git repository (or any parent up to mount point /)',
    );
    set({ terminalHistory: newHistory, lastCommand: trimmed });
    return;
  }

  if (sub === 'status') {
    if (currentWorktree) {
      addOutput('output', `On branch ${currentWorktree.branch}`);
      if (currentWorktree.dirty) {
        addOutput('output', 'Changes not staged for commit:');
        addOutput('output', '  (use "git add <file>..." to update what will be committed)');
        const dirtyFiles = currentWorktree.files.filter((f) => f.dirty);
        for (const f of dirtyFiles) {
          addOutput('error', `\tmodified:   ${f.name}`);
        }
        addOutput('output', '');
        addOutput('output', 'no changes added to commit');
      } else {
        addOutput('success', 'nothing to commit, working tree clean');
      }
    }
  } else if (sub === 'checkout') {
    const targetBranch = tokens[2];
    if (!targetBranch) {
      addOutput('error', 'error: branch name required');
      set({ terminalHistory: newHistory, lastCommand: trimmed });
      return;
    }

    // If current worktree is dirty, block checkout
    if (currentWorktree?.dirty) {
      addOutput(
        'error',
        'error: Your local changes to the following files would be overwritten by checkout:',
      );
      const dirtyFiles = currentWorktree.files.filter((f) => f.dirty);
      for (const f of dirtyFiles) {
        addOutput('error', `\t${f.name}`);
      }
      addOutput(
        'error',
        'Please commit your changes or stash them before you switch branches.',
      );
      addOutput('error', 'Aborting');
    } else if (lockedBranches.includes(targetBranch) && currentWorktree?.branch !== targetBranch) {
      addOutput(
        'error',
        `fatal: '${targetBranch}' is already checked out at '${worktrees.find((w) => w.branch === targetBranch)?.path}'`,
      );
    } else {
      addOutput('success', `Switched to branch '${targetBranch}'`);
    }
  } else if (sub === 'worktree') {
    handleWorktree(tokens, state, addOutput, set, newHistory, trimmed);
    return;
  } else if (sub === 'branch') {
    addOutput('output', '  main');
    addOutput('success', '* feature/auth');
    if (worktrees.some((w) => w.branch === 'main')) {
      addOutput('output', '  + main (checked out in a linked worktree)');
    }
  } else {
    addOutput(
      'error',
      `git: '${sub}' is not a git command. See 'help'.`,
    );
  }

  set({ terminalHistory: newHistory, lastCommand: trimmed });

  // Check level completion
  setTimeout(() => {
    const fresh = useGitEngine.getState();
    const level = levels[fresh.currentLevel];
    if (level && !fresh.levelComplete && level.validate(fresh)) {
      set({ levelComplete: true });
    }
  }, 50);
}

// ---- WORKTREE SUBCOMMAND ----

function handleWorktree(
  tokens: string[],
  state: GameState,
  addOutput: (type: TerminalLine['type'], text: string) => void,
  set: (partial: Partial<GitEngineStore>) => void,
  newHistory: TerminalLine[],
  trimmed: string,
) {
  const action = tokens[2]; // add | list | remove
  const { worktrees, lockedBranches, cwd } = state;

  if (action === 'add') {
    const pathArg = tokens[3]; // e.g. ../urgent-fix
    const branchArg = tokens[4]; // e.g. main

    if (!pathArg || !branchArg) {
      addOutput('error', 'usage: git worktree add <path> <branch>');
      set({ terminalHistory: newHistory, lastCommand: trimmed });
      return;
    }

    // Check if branch is already checked out
    if (lockedBranches.includes(branchArg)) {
      addOutput(
        'error',
        `fatal: '${branchArg}' is already checked out at '${worktrees.find((w) => w.branch === branchArg)?.path}'`,
      );
      set({ terminalHistory: newHistory, lastCommand: trimmed });
      return;
    }

    // Extract folder name from path
    const folderName = pathArg.replace(/^\.\.\//, '').replace(/^~\//, '');

    // Check if folder already exists
    if (worktrees.some((w) => w.folderName === folderName)) {
      addOutput('error', `fatal: '${pathArg}' already exists`);
      set({ terminalHistory: newHistory, lastCommand: trimmed });
      return;
    }

    const newWorktree: Worktree = {
      path: `~/${folderName}`,
      branch: branchArg,
      folderName,
      files:
        branchArg === 'main'
          ? mainBranchFiles
          : [
              { name: 'README.md', type: 'file' },
              {
                name: 'src',
                type: 'directory',
                children: [{ name: 'index.ts', type: 'file' }],
              },
            ],
      dirty: false,
      isMain: false,
    };

    addOutput('success', `Preparing worktree (checking out '${branchArg}')`);
    addOutput('success', `HEAD is now at a1b2c3d Latest commit on ${branchArg}`);

    set({
      worktrees: [...worktrees, newWorktree],
      lockedBranches: [...lockedBranches, branchArg],
      terminalHistory: newHistory,
      lastCommand: trimmed,
    });

    // Check level completion
    setTimeout(() => {
      const fresh = useGitEngine.getState();
      const level = levels[fresh.currentLevel];
      if (level && !fresh.levelComplete && level.validate(fresh)) {
        set({ levelComplete: true });
      }
    }, 50);
    return;
  }

  if (action === 'list') {
    for (const wt of worktrees) {
      const marker = wt.path === cwd ? ' *' : '';
      addOutput(
        'output',
        `${wt.path.padEnd(25)} ${wt.branch.padEnd(25)} [${wt.isMain ? 'main' : 'linked'}]${marker}`,
      );
    }
    set({ terminalHistory: newHistory, lastCommand: trimmed });
    return;
  }

  if (action === 'remove') {
    const pathArg = tokens[3];
    if (!pathArg) {
      addOutput('error', 'usage: git worktree remove <path>');
      set({ terminalHistory: newHistory, lastCommand: trimmed });
      return;
    }

    const folderName = pathArg.replace(/^\.\.\//, '').replace(/^~\//, '');
    const target = worktrees.find((w) => w.folderName === folderName);

    if (!target) {
      addOutput('error', `fatal: '${pathArg}' is not a registered worktree`);
      set({ terminalHistory: newHistory, lastCommand: trimmed });
      return;
    }

    if (target.isMain) {
      addOutput('error', "fatal: cannot remove the main worktree");
      set({ terminalHistory: newHistory, lastCommand: trimmed });
      return;
    }

    // Can't remove worktree you're currently in
    if (cwd === target.path) {
      addOutput(
        'error',
        `fatal: cannot remove the worktree you are currently in`,
      );
      set({ terminalHistory: newHistory, lastCommand: trimmed });
      return;
    }

    if (target.dirty) {
      addOutput(
        'error',
        `fatal: '${pathArg}' contains modified or untracked files, use --force to delete`,
      );
      set({ terminalHistory: newHistory, lastCommand: trimmed });
      return;
    }

    addOutput('success', `Removing worktree '${pathArg}'...`);

    set({
      worktrees: worktrees.filter((w) => w.folderName !== folderName),
      lockedBranches: lockedBranches.filter((b) => b !== target.branch),
      terminalHistory: newHistory,
      lastCommand: trimmed,
    });

    // Check level completion
    setTimeout(() => {
      const fresh = useGitEngine.getState();
      const level = levels[fresh.currentLevel];
      if (level && !fresh.levelComplete && level.validate(fresh)) {
        set({ levelComplete: true });
      }
    }, 50);
    return;
  }

  // Unknown worktree subcommand
  addOutput('error', 'usage: git worktree add|list|remove');
  set({ terminalHistory: newHistory, lastCommand: trimmed });
}
