# Next.js + React + TypeScript + TailwindCSS + Zustand + Vitest/RTL

A Next.js web dashboard using fake data.

Live preview:  
[fakestore.riccardo.lol](https://fakestore.riccardo.lol)

### Requirements

- **Node.js**: >= 20.19.0  
  - If you use `nvm`: `nvm install 22 && nvm use 22`

### Setup
```bash
npm install
# or
pnpm install
```

### Development
```bash
npm run dev
# or 
pnpm run dev
```
Open `http://localhost:3000` in your browser.

### Testing
```bash
# Watch mode
npm test
# or 
pnpm test

# CI mode
npm run test:run
# or 
pnpm run test:run

# Coverage report
npm run test:coverage
# or 
pnpm run test:coverage

# Vitest UI
npm run test:ui
# or 
pnpm run test:ui
```