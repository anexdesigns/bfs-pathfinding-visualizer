
export function breadthFirstSearch(startNode, finishNode, grid) {

     let row = startNode.row
     let column = startNode.column

     // Each "location" will store its coordinates and the shortest path required to arrive there
     let location = {
          row: row,
          column: column,
          path: [],
          status: 'Start'
     };

     // Initialize the queue with the start location already inside
     const queue = [location]

     // Loop through the grid searching for the goal
     while (queue.length > 0) {

          let currentLocation = queue.shift();

          const possibleNodes = []

          let currentRow = currentLocation.row
          let currentColumn = currentLocation.column

          const north = [currentRow - 1, currentColumn]
          const south = [currentRow + 1, currentColumn]
          const west = [currentRow, currentColumn - 1]
          const east = [currentRow, currentColumn + 1]

          possibleNodes.push(north, east, south, west)

          // console.log(possibleNodes)

          // For each valid Node, it checks north, south, east and west
          for (let i = 0; i < possibleNodes.length; i++) {

               let newPath = currentLocation.path.slice();
               newPath.push(possibleNodes[i])

               let newLocation = {
                    row: possibleNodes[i][0],
                    column: possibleNodes[i][1],
                    path: newPath,
                    status: 'Unkown'
               }

               // Checks whether the node is Invalid, Blocked, Valid, or the Goal
               newLocation.status = locationStatus(newLocation, grid, startNode, finishNode);

               // If this new location is valid, mark it as 'Visited' and continue searching
               if (newLocation.status === 'Valid') {
                    visitedNodesArray.push(newLocation)
                    grid[newLocation.row][newLocation.column].isVisited = true
                    queue.push(newLocation)
               }

               if (newLocation.status === 'Goal') {
                    shortestPath = newLocation.path
                    return
               }
          }

     }
     // No valid path found
     return false;
}

export const visitedNodesArray = []
// console.log(visitedNodesArray)
export let shortestPath;

let locationStatus = (location, grid, startNode, finishNode) => {
     const gridHeight = grid.length;
     const gridWidth = grid[0].length
     let row = location.row;
     let column = location.column;

     if (location.column < 0 || location.column >= gridWidth || location.row < 0 || location.row >= gridHeight) {
          return 'Invalid';
     } else if (grid[row][column] === finishNode) {
          return 'Goal';
     } else if (grid[row][column].isWall === true || grid[row][column].isVisited === true || grid[row][column] === startNode) {
          return 'Blocked'
     } else {
          return 'Valid'
     }
}
