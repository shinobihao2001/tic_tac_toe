import React from 'react';
import  ReactDOM  from 'react-dom/client';
import './index.css';

function Square(props) {
    return(
      <button className={'square' + (props.isWin ? ' square-winning': '')} onClick={props.onClick}>
          {props.value}
      </button>
    )
  }

function checkLimit(x,y,nRow){
  if (0<= x && x<nRow && 0<=y && y<nRow)
    return true;
  return false;
}


function caculateWinner(squares){
  let n=10;
  let x,y;
  let player;
  let lineWin=[];

  // check all the square in the table
  for (let i=0;i<n;i++){
    for (let j=0;j<n;j++){
      if (squares[i*n+j]==null){
        continue;
      }
      player=squares[i*n+j];
      
      lineWin.push(i*n+j);
      let countWin=5;

      //check the row frist
      lineWin=[i*n+j];
      let count=1;
      for (let k=1;k<countWin;k++){
        x=i;
        y=j+k;
        if (!checkLimit(x,y,n))
          break;
        if (squares[x*n+y]===squares[i*n+j]){
          lineWin.push(x*n+y);
          count++;
        }
          
        else break;
      }
      if (count==countWin){
        return {playerWin: player,lineWin: lineWin}
      }

      //check the col
      lineWin=[i*n+j];
      count=1;
      for (let k=1;k<countWin;k++){
        x=i+k;
        y=j;
        if (!checkLimit(x,y,n))
          break;
        if (squares[x*n+y]===squares[i*n+j]){
          count++;
          lineWin.push(x*n+y);
        }
         
        else break;
      }
      if (count==countWin){
        return {playerWin: player,lineWin: lineWin}
      }

      //check the dia left to right
      lineWin=[i*n+j];
      count=1;
      for (let k=1;k<countWin;k++){
        x=i+k;
        y=j+k;
        if (!checkLimit(x,y,n))
          break;
        if (squares[x*n+y]===squares[i*n+j]){
          count++;
          lineWin.push(x*n+y);
        }
          
        else break;
      }
      if (count===countWin){
        return {playerWin: player,lineWin: lineWin}
      }

      //check the dia right to left
      lineWin=[i*n+j];
      count=1;
      for (let k=1;k<countWin;k++){
        x=i+k;
        y=j-k;
        if (!checkLimit(x,y,n))
          break;
        if (squares[x*n+y]===squares[i*n+j]){
          count++;
          lineWin.push(x*n+y);
        }
         
        else break;
      }
      if (count===countWin){
        return {playerWin: player,lineWin: lineWin}
      }
      
    }
  }

  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    return(
      <Square
        isWin={this.props.winningSquares.includes(i)}
        value={this.props.squares[i]}
        onClick={()=> this.props.onClick(i)}
      />
    );
  }

  renderBroadRow(i){
    const row=[];
    for (let j=0;j<10;j++)
      row.push(this.renderSquare(i*10+j));
      return(
          <div className='board-row'>
              {row}
          </div>
      );
  }
  render() {
    const col=[];
    for (let i=0;i<10;i++)
      col.push(this.renderBroadRow(i));
    return (
      <div>
        {col}
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state={
      history: [{
        squares: Array(9).fill(null),
        squareID:-1,
      }],
      stepNumber:0,
      xIsNext: true,
      isACS: true,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (caculateWinner(squares) || squares[i]){
      return;
    }
  
    let iHistory=[{squares: squares, squareID: i,}]
   
    let newHistory;
    // if (this.state.isACS){
        newHistory=history.concat(iHistory);
    // }
    // else newHistory=iHistory.concat(history);

    squares[i]=this.state.xIsNext ? "X" : "O";
    this.setState({
      history: newHistory,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      });
     // console.log(history);
  }

  sortClick(){
    let isACS=!this.state.isACS;
    // let history=this.state.history;
    // history=history.reverse();
    
    this.setState({
      isACS: isACS,
      //history: history,
    })
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2 )===0,
    })

  }

  render() {
    const history=this.state.history;
    const current =history[this.state.stepNumber];
    const winner= caculateWinner(current.squares);


    let moves=history.map((step,move)=>{
      let x,y;
      if (step.squareID!=-1){
        console.log(step.squareID);
        y=step.squareID % 10;
        x=(step.squareID -   y)/10;
        y++;
        x++;
      }
      const desc = step.squareID!=-1 ?
        'Go to move #' + move +' at row:'+x+' at col :'+y: 
        'Go to game start';
      return (
        <li key={move}>
          <button
            className={this.state.stepNumber===move ? 'selected':''}
            onClick={()=> 
              this.jumpTo(move) 
              }>
            {desc}
          </button>
        </li>
      );
    });
    if(!this.state.isACS)
      moves=moves.reverse();

    let status;
    if (winner){
      status='Winner: ' + winner.playerWin;
      console.log(winner.lineWin);
    }
    else {
      if (this.state.stepNumber<100)
        status = 'Next player: ' + (this.state.xIsNext ? "X": "O")
      else  status = "Draw game";
    }

    let messACS=this.state.isACS ? 'ACS' : "DES";

    return (
      <div className="game">
        <div className="game-board">
          <Board
          winningSquares={winner ? winner.lineWin :[]}
          squares={current.squares}
          onClick={(i)=> this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <button onClick={()=> this.sortClick()}> {messACS}</button>
          <div>{ status }</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
