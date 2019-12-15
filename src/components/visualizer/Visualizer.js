import React from 'react';
import '../style/Visualizer.css'
import { breadthFirstSearch, visitedNodesArray, shortestPath } from '../algorithm/Algorithm.js';
import Node from './Node'

/* 
     High Level View:
     1.) On componentDidMount, the grid (which is a 2D array) gets created by calling getInitialGrid()
     2.) When "Go!" is clicked, it sends off the current state of the grid, the starting node, and the finish node to breadthFirstSearch() in Algorithm.js
     3.) Returns false if no path is found. If path is found, it populates shortestPath and visitedNodesArray. shortestPath is an array of coordinates and visitedNodesArray is an array of nodes that were visited in order.
     4.) Takes the result and then calls animateBFS()
*/


let START_NODE_ROW;
let START_NODE_COL;
let FINISH_NODE_ROW
let FINISH_NODE_COL;


export default class PathfindingVisualizer extends React.Component {
     constructor() {
          super();
          this.state = {
               grid: [],
               mouseIsPressed: false,
               createStartNode: false,
               createFinishNode: false
          };
     }

     // Create the blank grid and change the current state to that grid
     componentDidMount() {
          const grid = getInitialGrid();
          this.setState({ grid: grid });
     }

     clearGrid() {
          window.location.reload(false)
     }

     createStartNode() {
          this.setState({ createStartNode: true, createFinishNode: false })
     }

     createFinishNode() {
          this.setState({ createFinishNode: true, createStartNode: false })
     }

     // When the mouse is pushed down on the grid, create either a wall, start, or finish
     handleMouseDown(row, column) {
          if (this.state.createStartNode) {
               const newGrid = getNewGridWithStartToggled(this.state.grid, row, column)
               this.setState({ grid: newGrid, createStartNode: false });
          } else if (this.state.createFinishNode) {
               const newGrid = getNewGridWithFinishToggled(this.state.grid, row, column)
               this.setState({ grid: newGrid, createFinishNode: false });
          } else {
               const newGrid = getNewGridWithWallToggled(this.state.grid, row, column);
               this.setState({ grid: newGrid, mouseIsPressed: true });
          }

     }

     // Enables the user to click and drag to create walls
     handleMouseEnter(row, column) {
          if (!this.state.mouseIsPressed) return;
          const newGrid = getNewGridWithWallToggled(this.state.grid, row, column);
          this.setState({ grid: newGrid });
     }

     handleMouseUp() {
          this.setState({ mouseIsPressed: false });
     }

     // First animates the visited nodes, then the shortest path.
     animateBFS(visitedNodesInOrder, shortestPathNodes) {
          for (let i = 0; i < visitedNodesInOrder.length; i++) {
               // If animation is done, call the worker function that animates shortest path
               if (i === visitedNodesInOrder.length - 1) { // MAYBE DONT NEED THIS
                    setTimeout(() => {
                         this.animateShortestPath(shortestPathNodes);
                    }, 45 * i);
                    return;
               }
               // Animates visited nodes
               setTimeout(() => {
                    const node = visitedNodesInOrder[i];
                    document.getElementById(`node-${node.row}-${node.column}`).className =
                         'node node-visited';
               }, 45 * i);
          }
     }

     animateShortestPath(shortestPathNodes) {
          for (let i = 0; i < shortestPathNodes.length - 1; i++) {
               setTimeout(() => {
                    const node = shortestPathNodes[i];
                    document.getElementById(`node-${node[0]}-${node[1]}`).className =
                         'node node-shortest-path';
               }, 130 * i);
          }
     }

     visualizeBFS() {
          const { grid } = this.state;

          const startNode = grid[START_NODE_ROW][START_NODE_COL]
          const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL]

          // Main algorithm that finds shortest path and the nodes that were visited in order
          breadthFirstSearch(startNode, finishNode, grid)

          this.animateBFS(visitedNodesArray, shortestPath)
     }

     render() {
          const { grid, mouseIsPressed } = this.state;
          return (
               <div className="main-container">
                    <div className="header">
                         <h1 className="title">Breadth First Search Algorithm - Pathfinding Visualizer</h1>
                         <div className="button-container">
                              <button onClick={() => this.clearGrid()} className="clear-button">Clear</button>
                              <button onClick={() => this.visualizeBFS()} className="visualize-button">Go!</button>
                              <button onClick={() => this.createStartNode()} className="startNode-button">Choose Start Node</button>
                              <button onClick={() => this.createFinishNode()} className="finishNode-button">Choose End Node</button>
                         </div>
                    </div>
                    <div className="grid-container">
                         <div className="grid">
                              {grid.map((row, rowIdx) => {
                                   return (
                                        <div key={rowIdx}>
                                             {row.map((node, nodeIdx) => {
                                                  const { row, column, isFinish, isStart, isWall } = node;
                                                  return (
                                                       <Node
                                                            key={nodeIdx}
                                                            column={column}
                                                            isFinish={isFinish}
                                                            isStart={isStart}
                                                            row={row}
                                                            isWall={isWall}
                                                            mouseIsPressed={mouseIsPressed}
                                                            onMouseDown={(row, column) => this.handleMouseDown(row, column)}
                                                            onMouseEnter={(row, column) => this.handleMouseEnter(row, column)}
                                                            onMouseUp={() => this.handleMouseUp()}
                                                       ></Node>
                                                  );
                                             })}
                                        </div>
                                   );
                              })}
                         </div>
                    </div>
               </div>
          )
     }
}

// Creates a plain grid that is represented by a 2D array
const getInitialGrid = () => {
     const gridwidth = 45;
     const gridHeight = 18;
     const grid = [];
     for (let row = 0; row < gridHeight; row++) {
          const currentRow = [];
          for (let column = 0; column < gridwidth; column++) {
               currentRow.push(createNode(column, row));
          }
          grid.push(currentRow);
     }
     return grid;
};

// Information that each node will have
const createNode = (column, row) => {
     return {
          column,
          row,
          isStart: false,
          isFinish: row === FINISH_NODE_ROW && column === FINISH_NODE_COL,
          isVisited: false,
          isWall: false
     }
}

// Create a new grid that has walls
const getNewGridWithWallToggled = (grid, row, column) => {
     const newGrid = grid.slice();
     const node = newGrid[row][column];
     const newNode = {
          ...node,
          isWall: !node.isWall,
     };
     newGrid[row][column] = newNode;
     return newGrid;
};

// Create a new grid that has a start
const getNewGridWithStartToggled = (grid, row, column) => {
     const newGrid = grid.slice();
     const node = newGrid[row][column];
     const newNode = {
          ...node,
          isStart: !node.isStart
     }
     newGrid[row][column] = newNode;
     START_NODE_ROW = row;
     START_NODE_COL = column;
     return newGrid;
}

// Create a new grid that has a finish
const getNewGridWithFinishToggled = (grid, row, column) => {
     const newGrid = grid.slice();
     const node = newGrid[row][column];
     const newNode = {
          ...node,
          isFinish: !node.isFinish
     }
     newGrid[row][column] = newNode;
     FINISH_NODE_ROW = row;
     FINISH_NODE_COL = column;
     return newGrid;
}

