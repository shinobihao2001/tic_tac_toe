import Square from "./square";

function Board(props) {
    const renderSquare= (i) => {
      return(
        <Square
          isWin={props.winningSquares.includes(i)}
          value={props.squares[i]}
          onClick={()=> props.onClick(i)}
        />
      )
    }
  
    const renderBroadRow= (i) =>{
      const row=[];
      for (let j=0;j<10;j++)
        row.push(renderSquare(i*10+j));
        return(
            <div className='board-row'>
                {row}
            </div>
        );
    }
  
    const col=[];
    for (let i=0;i<10;i++)
        col.push(renderBroadRow(i));
    
    return (
        <div>
            {col}
        </div>
      );

  }
    
export default Board;