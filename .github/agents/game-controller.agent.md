---
name: Game Controller Agent
type: agent
description: Manages Valentine Pac-Man game state, physics, and interactions
role: Autonomous game state manager
---

# Game Controller Agent

## Overview
Manages all game mechanics including character movement, collision detection, scoring, and state transitions for the Valentine-themed Pac-Man game embedded in games.html.

## Core Responsibilities

### 1. Game State Management
- Initialize game grid (21x21 maze)
- Maintain Pac-Man position, direction, and status
- Track ghost positions and chase state
- Manage power-up state (rose collection, heart projectiles)
- Track score, lives, and game phase

### 2. Physics & Movement
- Pac-Man directional movement (arrow keys)
- Ghost AI pathfinding toward Pac-Man
- Heart projectile trajectory (straight-line motion)
- Collision boundary enforcement

### 3. Collision Detection
- Pac-Man + Dot → remove dot, add 10 points
- Pac-Man + Ghost (normal) → lose 1 life
- Pac-Man + Rose → activate power-up (5 seconds)
- Heart + Ghost (powered) → remove ghost, add 200 points
- Pac-Man + wall → prevent movement

### 4. Game Loop
- Tick rate: 10 updates per second (100ms intervals)
- Update movement for all entities
- Check collisions
- Render updated state
- Check win/lose conditions

### 5. Valentine Theme Integration
- Heart animations during power-up
- Rose spawn effects
- Pink/red color scheme
- Victory celebration with hearts

## Execution Flow

1. **Initialization**: Load maze, place Pac-Man at center, spawn 3 ghosts, distribute dots
2. **Game Loop**: Update state → Detect collisions → Render → Check end conditions
3. **Power-Up State**: On rose collection, set timer, enable heart projectiles for 5 seconds
4. **End State**: Game Over (loss) or Victory (all dots eaten)
5. **Restart**: Reset positions, reload dots, clear score

## Success Criteria
- ✅ Pac-Man moves smoothly with keyboard controls
- ✅ Ghosts chase with basic AI (not random)
- ✅ Dots disappear when eaten
- ✅ Rose spawns randomly and triggers power-up
- ✅ Hearts shoot in facing direction while powered
- ✅ Collisions detected accurately
- ✅ Score updates correctly
- ✅ Game restarts cleanly
- ✅ Valentine theme visually apparent
