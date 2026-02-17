---
name: Game Design Skill
type: skill
description: Core game design patterns for Pac-Man mechanics
prerequisite: Game Controller Agent
---

# Game Design Skill

## Maze Generation

### Grid Structure
- **Dimensions**: 21x21 grid (cells 0-20)
- **Wall Layout**: Classic Pac-Man symmetric design
- **Safe Spaces**: Home zones for ghosts and Pac-Man start
- **Accessible Areas**: All non-wall cells available for dots and movement

### Dot Distribution
- Place dots in every accessible cell (no walls, no spawn zones)
- Total dots: ~200 (varies by maze design)
- Player wins when all dots are eaten

## Character Design

### Pac-Man
- **Spawn Position**: Center of maze (10, 10)
- **Movement**: 1 cell per game tick (100ms = 10 cells/second)
- **Direction**: Controlled by arrow keys
- **Collision**: Cannot move into walls or ghosts (without power-up)
- **Lives**: Start with 3, lose 1 on ghost collision

### Ghosts (3 instances)
- **Names**: Blinky (red), Pinky (pink), Inky (cyan)
- **Spawn Positions**: Ghost house center, spread vertically
- **AI**: Simple chase algorithm (move toward Pac-Man each tick)
- **Speed**: Slightly slower than Pac-Man (0.8x speed)
- **Behavior**: Chase until power-up activated, then flee

### Power-Up Rose 🌹
- **Spawn**: Random empty cell, appears every 30 seconds
- **Duration Visible**: 10 seconds (then despawns)
- **Effect**: 5-second powered state
- **Points**: 50 points when collected

### Heart Projectile 💕
- **Spawn**: From Pac-Man during powered state
- **Rate**: Every 200ms (5 hearts/second)
- **Direction**: Pac-Man's current facing direction
- **Speed**: 2 cells per tick
- **Range**: Travels entire maze width/height before despawning
- **Damage**: Removes 1 ghost on collision

## Collision Detection

### Boundary Checking
- All moving entities check adjacent cell before moving
- Walls block all movement
- Ghost-only zones don't block Pac-Man

### Collision Types
1. **Entity-Wall**: Halt movement, prevent position update
2. **Entity-Dot**: Remove dot, increment score, check win
3. **Pac-Man-Ghost**: Lose 1 life (unless powered)
4. **Pac-Man-Rose**: Activate power-up, increment score
5. **Heart-Ghost**: Remove ghost, increment score, refill if respawn

## Pathfinding (Ghost AI)

### Simple Chase Algorithm
```
For each ghost:
  1. Calculate Manhattan distance to Pac-Man
  2. If distance > 0:
     a. Determine which direction (up/down/left/right) 
        reduces distance most
     b. Move in that direction
  3. If blocked by wall, choose random valid direction
```

### Ghost Respawn
- Ghost removed by heart regenerates after 3 seconds
- Respawns at original spawn position
- Re-enters chase state

## Scoring System

### Point Values
- Dot: +10 points
- Rose power-up: +50 points
- Ghost eliminated: +200 points each

### Win Conditions
- **Victory**: Eat all dots (show celebration)
- **Game Over**: Lose all 3 lives
- **Restart**: Button resets score, positions, lives

## Animation & Effects

### Power-Up Activation
- Visual flash on Pac-Man (pink/red pulse)
- Text indicator "POWERED UP!" (5 sec countdown)
- Heart animations around screen

### Rose Spawn
- Brief rotation animation
- Glow effect (CSS)

### Heart Projectiles
- Small heart emoji (💕) moving in straight line
- Leave subtle trail effect

### Victory
- Screen fills with falling hearts
- "You Win! 🎉" message
- Score display

## State Machine

```
START → PLAYING ↔ POWERED_UP → CHECK_WIN
           ↓
          LOSE_LIFE → GAME_OVER or RESUME
```

### Powered-Up State
- Duration: 5 seconds
- All ghosts turn pink/retreat
- Pac-Man shoots hearts automatically
- Higher point multiplier
- Indicator shows remaining time
