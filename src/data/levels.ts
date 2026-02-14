import type { Level, GameState } from '../engine/types';

export const levels: Level[] = [
  {
    id: 1,
    title: 'Scenario 1: The Everyday Problem',
    lore: `You're working on a new auth feature (branch "feature/auth"). You've changed login.ts and api.ts but haven't committed yet — you're mid-thought.

Suddenly, your teammate pings you: "Production is broken — the payment form crashes on submit. Can you hotfix it on main RIGHT NOW?"

Your instinct — switch to main. Let's try it.

💡 This happens ALL the time in real development. You're deep in a feature, and something urgent comes up.`,
    task: 'Try switching to main: `git checkout main`',
    hint: 'Just type the command. You\'ll see what happens when you have uncommitted work.',
    validationCommand: 'git checkout main',
    validate: (state: GameState) =>
      state.lastCommand === 'git checkout main',
  },
  {
    id: 2,
    title: 'Scenario 2: Worktree to the Rescue',
    lore: `Blocked! Git won't let you switch — your uncommitted changes would be lost.

The usual options suck:
• git stash — easy to forget, messy with conflicts
• commit WIP code — pollutes history
• clone the repo again — wastes disk space and time

git worktree is the real solution. It creates a SECOND folder on your disk, checked out on a different branch, but linked to the SAME repository. Same commits, same history, same remote.

Think of it this way: right now you have one folder open in VS Code. After worktree add, you'll have TWO folders — each on a different branch. You can open them in separate windows and work in parallel.`,
    task: 'Create a worktree: `git worktree add ../hotfix main`',
    hint: 'This creates a real folder "../hotfix" checked out on main. Your current folder stays untouched on feature/auth.',
    validationCommand: 'git worktree add ../hotfix main',
    validate: (state: GameState) =>
      state.worktrees.some((w) => w.folderName === 'hotfix'),
  },
  {
    id: 3,
    title: 'Scenario 3: Working in Parallel',
    lore: `Done! Now you have two folders:
📁 my-project/ → branch feature/auth (your uncommitted changes are safe)
📁 hotfix/     → branch main (clean, ready to fix the bug)

KEY INSIGHT: Both folders point to the SAME repo. If you commit in hotfix/, the commit exists in the repo — you can see it from my-project/ too. It's not a copy, it's a parallel view.

Real-world use cases:
• Fix production bugs without stashing your feature work
• Run tests on main while developing on a feature branch
• Let an AI agent (Claude Code) work in a worktree while you code in another
• Review a teammate's PR in a separate worktree — no context switching

Now jump into the hotfix folder and verify you're on main.`,
    task: 'Enter the worktree: `cd ../hotfix`\nThen check the branch: `git status`',
    hint: 'cd ../hotfix to enter the folder, then git status to confirm you\'re on main with a clean working tree.',
    validationCommand: 'git status',
    validate: (state: GameState) =>
      state.cwd === '~/hotfix' &&
      state.lastCommand === 'git status',
  },
  {
    id: 4,
    title: 'Scenario 4: Clean Up',
    lore: `You're on main with a clean tree. You'd fix the bug here, commit, push, and deploy — all while your feature/auth work sits untouched in the other folder.

When you're done, just remove the worktree. This ONLY deletes the folder — your commits, branches, and history are all safe in the repo.

FAQ:
Q: Do changes in a worktree affect the main repo?
A: Yes! It's the SAME repo. Commits made in any worktree are shared.

Q: Is it better than git clone?
A: Much better — no duplicate .git, no separate remote config, shared object store.

Q: Can I have multiple worktrees?
A: Yes! One per branch. Great for juggling feature, hotfix, and review work.

Now go back to your project and clean up the worktree.`,
    task: 'Return: `cd ../my-project`\nThen clean up: `git worktree remove ../hotfix`',
    hint: 'First cd ../my-project, then git worktree remove ../hotfix. The folder disappears, but all commits remain.',
    validationCommand: 'git worktree remove ../hotfix',
    validate: (state: GameState) =>
      state.worktrees.length === 1 &&
      state.cwd === '~/my-project',
  },
];
