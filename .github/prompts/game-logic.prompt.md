---
prompt-version: 1.0
title: Valentine Pac-Man Game Logic
description: Complete game implementation specifications for games.html
tags: [game-development, pacman, valentines-day, canvas]
---

# Valentine Pac-Man Game Logic Specification

You are implementing a fully functional, browser-based Valentine-themed Pac-Man game. The game must be playable immediately in games.html with no external dependencies. Use HTML5 Canvas or DOM-based rendering.

## Game Overview

A classic Pac-Man game with Valentine theme elements:
- **Pac-Man** navigates a 21x21 maze eating dots
- **3 Ghosts** chase Pac-Man using simple AI (not random)
- **Power-Up**: Rose 🌹 appears randomly → enables 5-second powered state
- **Powered State**: Pac-Man shoots hearts 💕 that eliminate ghosts
- **Win Condition**: Eat all dots (celebrate with falling hearts)
- **Lose Condition**: Lose all 3 lives (show Game Over screen)

## Technical Architecture

### Rendering Approach
- **Recommended**: DOM-based grid (21x21 divs)
- **Alternative**: HTML5 Canvas (if performance needed)
- **No external libraries**: Pure HTML/CSS/JavaScript

### Game Loop
```javascript
- Initialize game state
- setInterval(gameLoop, 100) // 10 updates/second
- In gameLoop:
  1. Update movement (Pac-Man, ghosts, hearts)
  2. Check collisions (dots, ghosts, power-ups)
  3. Update score/lives
  4. Render all entities
  5. Check win/lose conditions
```

## Data Structure

### Game State Object
```javascript
{
  gridSize: 21,
  pacman: {
    x: 10, y: 10,
    direction: 'right', // 'up', 'down', 'left', 'right'
    nextDirection: 'right', // queued input
    powered: false,
    poweredTimer: 0
  },
  ghosts: [
    { x: 9, y: 8, name: 'Blinky', color: '#FF0000', speed: 0.8 },
    { x: 10, y: 8, name: 'Pinky', color: '#FFB8D1', speed: 0.8 },
    { x: 11, y: 8, name: 'Inky', color: '#00FFFF', speed: 0.8 }
  ],
  hearts: [], // [{ x, y, direction }]
  dots: new Set(['0,0', '1,0', ...]), // Set of 'x,y' strings
  rose: { x: null, y: null, timer: 0 }, // null when not active
  score: 0,
  lives: 3,
  gameState: 'playing', // 'playing', 'gameOver', 'won'
  tick: 0
}
```

### Maze Definition
```javascript
// Define walls as a 21x21 grid
// 0 = accessible, 1 = wall
const maze = [
  // Top border
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // Symmetric pattern with internal walls
  // Use classic Pac-Man maze layout
  ...
];
```

## Movement Logic

### Pac-Man Movement
```
- Player presses arrow key → set pacman.nextDirection
- Each game tick:
  1. Try moving in nextDirection (preferred input)
  2. If blocked, try moving in current direction
  3. If moving, update position
  4. Update animation frame (chomping mouth)
```

### Ghost Movement
```
For each ghost:
  1. Every tick, recalculate direction toward Pac-Man
  2. Manhattan distance to Pac-Man determines priority
  3. Try moving in optimal direction
  4. If blocked, choose random valid direction
  5. If powered-up, ghosts move away from Pac-Man (reverse logic)
```

### Heart Projectiles
```
- During powered-up state, spawn heart every 200ms
- Hearts move 2 cells per tick in Pac-Man's facing direction
- Despawn when hitting wall or edge
- Despawn when hitting ghost (remove ghost instead)
```

## Collision Detection

### Helper Functions
```javascript
canMove(x, y)          // Check if cell is accessible (not wall)
isWall(x, y)           // Return true if wall at (x,y)
getCell(x, y)          // Return entity at (x,y): 'dot'|'ghost'|'rose'|null
inBounds(x, y)         // Validate x,y within 0-20 range
manhattan(p1, p2)      // Distance for ghost AI
```

### Collision Resolution
1. **Pac-Man hits wall** → Prevent movement, stay in place
2. **Pac-Man eats dot** → Remove dot, score += 10, check win
3. **Pac-Man hits ghost** (normal) → Lives -= 1, check lose
4. **Pac-Man hits ghost** (powered) → Ghost disappears (respawn in 3s), score += 200
5. **Pac-Man hits rose** → powered = true, poweredTimer = 300 (5s at 10 ticks/s), score += 50
6. **Heart hits ghost** → Remove ghost, score += 200
7. **Heart hits wall** → Despawn heart

## Game States

### Playing State
- Normal movement for all entities
- Ghosts chase Pac-Man
- Dots are edible
- Rose can appear
- Win/lose on appropriate conditions

### Powered-Up State
- Duration: 300 ticks (5 seconds at 10 ticks/s)
- Visual: Pac-Man has pink/red aura
- Hearts automatically spawn (no button needed)
- Ghosts can be eliminated by hearts
- Show countdown timer
- On expiration, revert to normal (hearts stop spawning)

### Game Over State
- Freeze all movement
- Show "Game Over" screen with final score
- Offer restart button
- Disable input except restart

### Won State
- All dots eaten
- Show "You Win! 🎉" screen
- Final score
- Falling hearts animation
- Restart button

## Valentine Theme Implementation

### Colors & Styling
```css
/* Valentine Palette */
--pacman-yellow: #FFE811
--ghost-red: #FF0000
--ghost-pink: #FFB8D1
--ghost-cyan: #00FFFF
--heart-pink: #FF69B4
--maze-blue: #0066FF
--dot-white: #FFFFFF
--powered-glow: #FF1493

/* Animations */
@keyframes heart-pulse { /* Powered-up indicator */ }
@keyframes rose-spin { /* Rose power-up */ }
@keyframes falling-hearts { /* Victory screen */ }
```

### Visual Elements
1. **Pac-Man**: Yellow circle with animated mouth (opening/closing)
2. **Ghosts**: Colored circles with googly eyes
3. **Dots**: Small white circles
4. **Rose**: 🌹 emoji with spinning animation
5. **Hearts**: 💕 emoji projectiles
6. **Powered Indicator**: "💕 POWERED UP! 5s 💕" text

## Rendering Strategy

### DOM-Based (Recommended)
```html
<div class="game-grid">
  <div class="cell" data-x="0" data-y="0"></div>
  <div class="cell" data-x="0" data-y="1"></div>
  ...
</div>

<div class="entities">
  <div class="pacman">🟡</div>
  <div class="ghost blinky">👻</div>
  <div class="dot"></div>
  <div class="rose">🌹</div>
  <div class="heart">💕</div>
</div>
```

### CSS Positioning
```css
.game-grid {
  display: grid;
  grid-template-columns: repeat(21, 1fr);
  gap: 1px;
}

.pacman, .ghost, .dot, .rose, .heart {
  position: absolute;
  transition: left 0.1s, top 0.1s;
}
```

## User Interface

### Game Container
- Game title: "Valentine Pac-Man 💕"
- Score display: "Score: 0"
- Lives display: "Lives: ❤️ ❤️ ❤️"
- Power-up status: "🌹 POWERED UP! 5s" (during powered state)

### Control Buttons
- **Start Button**: Initialize game, disable during play
- **Restart Button**: Visible only on game over/win
- **Pause Button**: (Optional) Freeze game state

### Keyboard Controls
- Arrow Up/Down/Left/Right: Move Pac-Man
- Space: (Optional) Power-up or restart

## Success Checklist

Before deployment:
- ✅ Pac-Man moves smoothly with arrow keys
- ✅ Cannot move through walls
- ✅ Ghosts chase with deterministic AI (not random)
- ✅ Dots disappear on collision, score increments
- ✅ Rose spawns randomly, triggers power-up correctly
- ✅ Hearts shoot in facing direction during powered state
- ✅ Ghost-heart collision removes ghost
- ✅ Pac-Man-ghost collision loses life
- ✅ All game over/win conditions detected
- ✅ Restart functionality resets state
- ✅ Valentine theme visually prominent
- ✅ Game playable immediately (no build step)
- ✅ Responsive on desktop (tested in browser)

## Debugging Tips

### Common Issues
1. **Ghosts move through walls**: Ensure `canMove()` checks maze correctly
2. **Pac-Man teleports**: Verify tick-based movement (not frame-based)
3. **Hearts don't appear**: Check powered timer logic and spawn rate
4. **Score doesn't update**: Verify collision detection and state mutation
5. **Ghost AI is random**: Implement proper Manhattan distance calculation

### Testing Approach
1. Start with simple 5x5 maze (debug easier)
2. Verify Pac-Man movement + wall collision first
3. Add ghosts and test chase AI
4. Add dots and scoring
5. Add power-up mechanics
6. Expand to full 21x21 maze
7. Polish Valentine theme

## Performance Considerations

- **Tick Rate**: 10 updates/second is safe for DOM rendering
- **Entity Count**: Max ~50 entities (Pac-Man, 3 ghosts, 200 dots, hearts)
- **Optimization**: Use CSS transforms instead of reflows when possible
- **Avoid**: Complex path-finding, recursive functions in game loop
