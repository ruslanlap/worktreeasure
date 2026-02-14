import type { Level, GameState } from '../engine/types';

export const levels: Level[] = [
  {
    id: 1,
    title: 'Level 1: The Trap',
    lore: `You're Agent 42, deep inside the "feature-hoverboard" dimension, writing critical hover-propulsion code. Your files are modified but NOT committed yet.

Suddenly, an alert from HQ: "CRITICAL BUG on main! The gravity inverter is malfunctioning. Citizens are floating away. Fix it NOW."

Your instinct? Switch to main. But wait...`,
    task: 'Try switching to the main branch. Type: `git checkout main`',
    hint: 'Just type the command exactly as shown. See what happens when you have uncommitted changes!',
    validationCommand: 'git checkout main',
    validate: (state: GameState) =>
      state.lastCommand === 'git checkout main',
  },
  {
    id: 2,
    title: 'Level 2: Opening the Portal',
    lore: `The checkout was BLOCKED! Your uncommitted hoverboard code would be destroyed.

In the old days, you'd have to stash, commit, or lose your work. But you're a Multiverse Agent. You have a portal gun: \`git worktree\`.

A worktree creates a SECOND physical folder linked to the same repo, checked out on a different branch. Two dimensions. One reality.`,
    task: 'Open a portal! Type: `git worktree add ../urgent-fix main`',
    hint: 'This creates a new folder called "urgent-fix" alongside your repo, checked out on the "main" branch.',
    validationCommand: 'git worktree add ../urgent-fix main',
    validate: (state: GameState) =>
      state.worktrees.some((w) => w.folderName === 'urgent-fix'),
  },
  {
    id: 3,
    title: 'Level 3: Dimension Hop',
    lore: `BOOM! Look at the Multiverse Visualizer on the right. A new folder "urgent-fix" just materialized! It's on the "main" branch, completely clean, while your "core-repo" still has your dirty hoverboard files safe and sound.

Now hop through the portal into the new dimension.`,
    task: 'Navigate into the new worktree. Type: `cd ../urgent-fix`\nThen verify you\'re on main: `git status`',
    hint: 'Use "cd ../urgent-fix" to enter the portal, then "git status" to confirm you\'re on main.',
    validationCommand: 'git status',
    validate: (state: GameState) =>
      state.cwd === '~/urgent-fix' &&
      state.lastCommand === 'git status',
  },
  {
    id: 4,
    title: 'Level 4: Closing the Portal',
    lore: `You're in! "git status" confirms: branch main, clean working tree. You can fix the gravity inverter here without disturbing your hoverboard code AT ALL.

Imagine you just fixed the bug, committed, and pushed. Mission complete. Now it's time to clean up -- close the portal and remove the worktree.

First, hop back to your original dimension.`,
    task: 'Return home: `cd ../core-repo`\nThen close the portal: `git worktree remove ../urgent-fix`',
    hint: 'First cd back to core-repo, then use "git worktree remove ../urgent-fix" to clean up.',
    validationCommand: 'git worktree remove ../urgent-fix',
    validate: (state: GameState) =>
      state.worktrees.length === 1 &&
      state.cwd === '~/core-repo',
  },
];
