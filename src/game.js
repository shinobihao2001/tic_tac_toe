import Board from "./board";
import { useState } from "react";

const checkLimit=(x,y,nRow)=>{
    if (0<= x && x<nRow && 0<=y && y<nRow)
      return true;
    return false;
  }
  
  
const caculateWinner=(squares)=>{
let n=10;
let x,y;
let player;
let lineWin=[];
console.log("Still fine");
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


function Game()  {
    const [history,setHistory]=useState([{
        squares: Array(100).fill(null),
        squareID:-1,
    }])
    const [stepNumber,setStepNumber]=useState(0);
    const [xIsNext,setXIsNext]=useState(true);
    const [isACS,setISACS]=useState(true);

    const handleClick=(i) =>{
        const tempHistory = history.slice(0,stepNumber+1);
        const current = tempHistory[tempHistory.length - 1];
        const squares = current.squares.slice();
        if (caculateWinner(squares) || squares[i]){
        return;
        }

    let iHistory=[{squares: squares, squareID: i,}]
    
    let newHistory;
        newHistory=tempHistory.concat(iHistory);
   

    squares[i]=xIsNext ? "X" : "O";
    setHistory(newHistory);
    setStepNumber(tempHistory.length); //TODO if set tempHistory= history will let to the history be undefined ?
    setXIsNext(!xIsNext)
    }

const sortClick=()=>{
    //let isACS=!isACS;
    setISACS(!isACS);
}

const jumpTo=(step)=>{
    setStepNumber(step);
    setXIsNext((step % 2)===0)
}


    //const history=this.state.history;
    const current =history[stepNumber];
    const winner= caculateWinner(current.squares);

    let moves=history.map((step,move)=>{
    let x,y;
    if (step.squareID!=-1){
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
            className={stepNumber===move ? 'selected':''}
            onClick={()=> 
            jumpTo(move) 
            }>
            {desc}
        </button>
        </li>
    );
    });
    if(!isACS)
    moves=moves.reverse();

    let status;
    if (winner){
    status='Winner: ' + winner.playerWin;
    console.log(winner.lineWin);
    }
    else {
    if (stepNumber<100)
        status = 'Next player: ' + (xIsNext ? "X": "O")
    else  status = "Draw game";
    }

    let messACS=isACS ? 'ACS' : "DES";

    return (
    <div className="game">
        <div className="game-board">
        <Board
        winningSquares={winner ? winner.lineWin :[]}
        squares={current.squares}
        onClick={(i)=> handleClick(i)} 
        />
        </div>
        <div className="game-info">
        <button onClick={()=> sortClick()}> {messACS}</button>
        <div>{ status }</div>
        <ol>{moves}</ol>
        </div>
    </div>
    );
}

export default Game;