import React, { Component } from 'react';
import '../style/Node.css'


export default class Node extends Component {
     render() {
          const {
               column,
               isFinish,
               isStart,
               row,
               isWall,
               onMouseDown,
               onMouseEnter,
               onMouseUp
          } = this.props;
          const extraClassName = isFinish
               ? 'node-finish'
               : isStart
                    ? 'node-start'
                    : isWall
                         ? 'node-wall'
                         : '';

          return (
               <div
                    id={`node-${row}-${column}`}
                    className={`node ${extraClassName}`}
                    onMouseDown={() => onMouseDown(row, column)}
                    onMouseEnter={() => onMouseEnter(row, column)}
                    onMouseUp={() => onMouseUp()}
               ></div>
          );
     }
}

