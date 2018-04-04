# Interactive Life-Like Cellular Automata Simulation
TypeScript node.js app created as a dev exercise for AkitaBox. 
This application provides an interactive interface capable of simulating any 
desired life-like cellular automata.

## Installation
To install, clone the repository and
```bash
npm install
```

## Testing
To run mocha unit tests and generate an html istanbul coverage report in `coverage/` use
```bash
npm test
```

## Running the Game
To launch the game, run
```bash
npm start
```

## Generating TypeDocs
To generate html TypeDocs in `doc/` use
```bash
typedoc --out ./doc
```
## Project Structure
- Source code is located in `src/`.
- Transpiled TypeScript is generated in `dist/` after a build.
- HTML TypeDocs are located in `doc/`.
- HTML Istanbul coverage reports are generated in `coverage/` 
