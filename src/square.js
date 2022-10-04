function Square(props) {
    return(
      <button className={'square' + (props.isWin ? ' square-winning': '')} onClick={props.onClick}>
          {props.value}
      </button>
    )
  }

export default Square;