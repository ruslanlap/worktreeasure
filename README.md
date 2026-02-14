# Git Worktree: The Multiverse

An interactive, browser-based learning game that teaches the `git worktree` concept through a sci-fi "Multiverse Agency" theme.

## What is this?

Beginners often struggle with `git worktree` because:
- The concept of multiple working directories from one repo is unintuitive
- There's no visual feedback when using the CLI
- Fear of breaking real repositories prevents experimentation

This app provides a **zero-setup sandbox** with a split-screen UI: a simulated terminal on the left and a real-time file system visualizer on the right. When you type `git worktree add`, you literally *see* a new folder animate into existence.

## Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **Framer Motion** for smooth folder creation/removal animations
- **Zustand** for the mock Git engine state machine
- **Vite** for builds

## Architecture

No real Git runs in the browser. The app uses a **Mock Git & File System State Machine** (`src/engine/useGitEngine.ts`) that:
- Parses a subset of shell/git commands (`cd`, `ls`, `pwd`, `git status`, `git checkout`, `git worktree add/list/remove`)
- Maintains a virtual file system with worktree state
- Validates commands against level-specific objectives
- Drives both the terminal output and the visual file explorer

## Game Levels

1. **The Trap** - Experience the frustration of `git checkout` being blocked by dirty files
2. **Opening the Portal** - Use `git worktree add` to create a parallel working directory
3. **Dimension Hop** - Navigate into the new worktree and verify the branch
4. **Closing the Portal** - Clean up with `git worktree remove`

## Getting Started

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

## Project Structure

```
src/
  engine/
    types.ts           # TypeScript interfaces for the game state
    useGitEngine.ts    # Zustand store: mock file system + command parser
  data/
    levels.ts          # Level definitions (lore, tasks, validation)
  components/
    Terminal.tsx        # Simulated CLI with command history
    Visualizer.tsx     # Animated file system / worktree visualizer
    NarrativeBox.tsx   # Level narrative, objectives, and progression
  App.tsx              # Split-screen layout orchestrator
```

## License

MIT
