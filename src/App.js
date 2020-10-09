import React from 'react'
import logo from './logo.svg'
import './App.css'
import './2048.css'
// 导入旋转数组的方法 180° 270° 90°
import { rotateHalf, rightNinety, leftNinety } from './rotateArray'

// 每个格子子组件
function Square(props) {
  return (
    <span className="every-square">
        {props.theBoard}
    </span>
  )
}

// 4×4方格子组件
class Board extends React.Component {
  createSquare(i) {
    return <Square key={i} theBoard={this.props.theBoard[i]} />
  }
  render() {
    // 渲染出1个4×4的格子
    let squreGather = []
    for (let i = 0; i < 16; i++) {
      squreGather.push(
        this.createSquare(i)
      )
    }

    return (
      <div className="four-and-four-box">
        {squreGather}
      </div>
    )
  }
}

// Game组件
class Game extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      // 4×4格子
      theBoard: new Array(16).fill(null),
      // 当前最高分
      highestScore: 0,
      // 将空余的格子存放在value中
      emptySquare: Array.from({ length: 16 }, (v, i) => i),
      // 节流阀
      flag:true
    }
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  // 初始化游戏
  componentDidMount() {
    this.randomCreateTwo()
    // mount中调用两次需要加setTimeout
    setTimeout(() => {
      this.randomCreateTwo()
    }, 0)
    document.addEventListener("keydown", this.onKeyDown)
  }
  // Unmount生命周期取消按键监听事件
  componentWillUnmount(){
    document.removeEventListener("keydown", this.onKeyDown)
  }

  // 随机生成一个数字2，且判断是否游戏结束
  randomCreateTwo() {
    let theBoard = this.state.theBoard.slice()
    let theEmpty = this.state.emptySquare.slice()
    let randomNum = getRandomIntInclusive(0, theEmpty.length - 1)
    theBoard[theEmpty[randomNum]] = 2
    theEmpty.splice(randomNum, 1)
    this.setState({
      theBoard: theBoard,
      emptySquare: theEmpty,
      highestScore: Math.max(...theBoard)
    })
    if (!theEmpty.length && this.isGameOver()) {
      alert('游戏结束')
    }
  }

  // 判断是否游戏结束 即该数组和旋转90°后的数组是否有相邻相同元素
  isGameOver() {
    let theBoard1 = this.state.theBoard.slice()
    let theBoard2 = leftNinety(theBoard1)
    let w = 4
    let h = 4
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w - 1; j++) {
        if (theBoard1[i * w + j] === theBoard1[i * w + j + 1] || theBoard2[i * w + j] === theBoard2[i * w + j + 1]) {
          return false
        }
      }
    }
    return true
  }

  // 按下方向键事件函数
  onKeyDown(e) {
    let flag = this.state.flag
    // 左为37 上为38 右为39 下为40
    if (flag) {
      switch (e.keyCode) {
        case (37): this.leftChange()
          break
        case (38): this.upChange()
          break
        case (39): this.rightChange()
          break
        case (40): this.downChange()
          break
        default: break
      }
      this.setState({
        flag: false
      })
      // 节流阀
      setTimeout(() => {
        this.setState({
          flag:true
        })
      }, 200)
    }
  }

  // 设置此时的emptySquare属性
  setEmpty(resultBoard) {
    let empty = []
    for (let i = 0; i < resultBoard.length; i++) {
      if (resultBoard[i] === null) {
        empty.push(i)
      }
    }
    this.setState({
      emptySquare: empty
    })
  }

  // 向左移动
  leftChange() {
    let theBoard = this.state.theBoard.slice()
    let resultBoard = left(theBoard)
    // 如果没有变化则不进行下去
    if(theBoard.toString() === resultBoard.toString()) return
    // 得到empty的情况
    this.setEmpty(resultBoard)
    this.setState({
      theBoard: resultBoard
    })
    this.randomCreateTwo()
  }

  // 向上移动
  upChange() {
    let theBoard = leftNinety(this.state.theBoard.slice())
    let tempBoard = left(theBoard)
    let resultBoard = rightNinety(tempBoard)
    if(this.state.theBoard.slice().toString() === resultBoard.toString()) return
    // 得到empty的情况
    this.setEmpty(resultBoard)
    this.setState({
      theBoard: resultBoard
    })
    this.randomCreateTwo()
  }

  // 向右移动
  rightChange() {
    let theBoard = rotateHalf(this.state.theBoard.slice())
    let tempBoard = left(theBoard)
    let resultBoard = rotateHalf(tempBoard)
    if(this.state.theBoard.slice().toString() === resultBoard.toString()) return
    // 得到empty的情况
    this.setEmpty(resultBoard)
    this.setState({
      theBoard: resultBoard
    })
    this.randomCreateTwo()
  }

  // 向下移动
  downChange() {
    let theBoard = rightNinety(this.state.theBoard.slice())
    let tempBoard = left(theBoard)
    let resultBoard = leftNinety(tempBoard)
    if(this.state.theBoard.slice().toString() === resultBoard.toString()) return
    // 得到empty的情况
    this.setEmpty(resultBoard)
    this.setState({
      theBoard: resultBoard
    })
    this.randomCreateTwo()
  }

  render() {
    return (
      <div>
        <div className="highest-score">当前最高分</div>
        <div className="score-show">{this.state.highestScore}</div>
        <Board theBoard={this.state.theBoard} />
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Game />
      </header>
    </div>
  )
}

// MDN上的获得随机数方法
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
}

// 将数组中的非零元素全部移动至左侧
function initArray(array) {
  let result = new Array(16).fill(null)
  let w = 4
  let h = 4
  for (let i = 0; i < h; i++) {
    let k = w * i
    for (let j = 0; j < w; j++) {
      let current = array[i * w + j]
      if (current) {
        result[k] = current
        k++
      }
    }
  }
  return result
}

// 在左侧全部是菲灵数的情况下，向左移动数组
function left(theBoard) {
    // 将所有数据移动至左侧
    let tempBoard = initArray(theBoard)
    // 逐个遍历数组
    let w = 4
    let h = 4
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w - 1; j++) {
        if (!tempBoard[i * w + j]) break
        if (tempBoard[i * w + j] === tempBoard[i * w + j + 1]) {
          tempBoard[i * w + j] *= 2
          tempBoard[i * w + j + 1] = null
          j++
        }
      }
    }
    // 再次将数据移动至左侧
  let resultBoard = initArray(tempBoard)
  return resultBoard
}

export default App;
