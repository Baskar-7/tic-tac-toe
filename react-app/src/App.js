import { useEffect, useState } from 'react';
import './App.css';
import Swal from 'sweetalert2';



export default function Game() {

  let [results,setResults] = useState({x:0,O:0,draws:0});
  let [square,setSquare] =  useState(Array(9).fill(null));
  let [isXnext,setNext] = useState(true);
  let [controls,setControls] =  useState({"mode" : false,"difficulty" : false,muted: false});
  var clicked = new Audio('assets/click.mp3'),
  draw = new Audio('assets/draw.mp3'),
  lose = new Audio('assets/laugh.mp3'),
  // error = new Audio('assets/error.mp3'),
  won = new Audio('assets/victory.mp3');
  let hardmode =[
    [0, 2, 1],
    [3, 5, 4],
    [6, 8, 7],
    [0, 6, 3],
    [1, 7, 4],
    [2, 8, 5],
    [0, 8, 4],
    [2, 6, 4]
  ]
  let easymode = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

    useEffect(() => {
      if(!isXnext && controls.mode)
        playComputer();
    }, [square, controls.mode]);
 

    useEffect(() => {
      const winner = calculateWinner(square);
      if (winner) {
        setResults(results => ({...results,[winner] : results[winner]+1}));
        if(!controls.muted)
        {
          if(isXnext && controls.mode)
          {
            lose.play();
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Computer Wins!',
              timer: 10000,
            });
          }
          else
          {
            won.play();
            Swal.fire({
              icon: 'success',
              title: '',
              text: isXnext ? 'O Wins!' : 'X Wins!',
              timer: 10000,
            });
          }
        }
      } 
      else if (!square.includes(null)) 
      {
        setResults(results => ({...results, "draws" : results.draws+1}));
        if(!controls.muted) draw.play();
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: 'Match Draws!',
          timer: 1800,
        });
      } 
    }, [square]);


    function handleClick(i)
    { 
      if (square[i] || calculateWinner(square)) {
        return;
      }
       var nextSquares = square.slice();
       isXnext ? nextSquares[i]='x' : nextSquares[i]='O';
       setSquare(nextSquares);
       setNext(!isXnext);
       if((isXnext || !controls.mode) && !controls.muted ) clicked.play();
    }

    function playComputer() {
      const patterns = controls.difficulty ? hardmode : easymode;
      const nextMove = findBestMove(square, patterns);
      if (nextMove !== null) handleClick(nextMove);
    }
  
    function findBestMove(squares, patterns) {
      return canWin(squares, 'O') || canWin(squares, 'x') || getWinningMove(squares, patterns) || getFirstEmptySquare(squares);
    }

    function canWin(squares,element)
    {
      for(var i=0;i<easymode.length;i++)
      {
        var [a,b,c]=easymode[i];
        var nextSquare= (squares[a] === element && squares[b] === element ) ? c : ((squares[b] === element && squares[c] === element ) ?  a : ((squares[c] === element && squares[a] === element ) ? b : null))
        if(nextSquare && squares[nextSquare] !== (element === "O" ? "x" : "O"))
        {
          return nextSquare;
        }
      }
      return null;
    }
      
    function getWinningMove(squares,winMatrix)
    {
      if(!squares[4] && controls.difficulty)
      {
        return 4;
      }
      for(var i=0;i<winMatrix.length;i++)
      {
        var [a,b,c]=winMatrix[i];
        if(squares[a]!=='x' && squares[b]!=='x' && squares[c]!=='x')
        {
          return squares[a] === null ? a : (squares[b] === null ? b : c)
        }
      }
      return null;
    }

    function getFirstEmptySquare()
    {
      for (var i = 0; i < square.length; i++) {
        if (square[i] === null) return i;
      }
      return null;
    }

    function calculateWinner(squares)
    {
      for(var i=0;i<easymode.length;i++)
      {
        var [a,b,c]=easymode[i];
        if((squares[a] && squares[a] === squares[b]) && (squares[b] === squares[c]))
        {
          return squares[a];
        }
      }
    }

    function restart()
    {
      setSquare(Array(9).fill(null));
      setNext(true);
    }

    function Square({value,handleAction,styles})
    {
      return <button className={`square ${value}`} onClick={handleAction} style={styles}>{value}</button>
    }

    function toggleDropdown()
    {
      document.getElementById('drp-menu').classList.toggle('show');
    }

    function toggleVolume(id)
    {
      document.getElementById(id).classList.toggle('show-icon');
      setControls(prevControls => ({...controls,muted: !prevControls.muted}));
    }

    function selectDropdown(choice,event)
    {
      if(event.target.innerHTML!=="")
      {
        var ele = document.querySelector('.dropdown .select > span');
        ele.innerHTML=event.target.innerHTML;
        var settings=controls;
        settings.mode=choice;
        setControls(settings);
        restart();
        toggleDropdown();
        var element= document.getElementById('switch');
        choice ===true ?  element.removeAttribute("disabled"): element.setAttribute("disabled","true");
      }
    }

    function handleToggleAction(event)
    {
      var settings = { ...controls, difficulty: event.target.checked };
      setControls(settings);
      restart();
    }

  return (
    <>
    <div className='tic-tac-game'>

      <div className='volume'>
          <span className='icon show-icon' id='volume-up' onClick={()=>toggleVolume("volume-up")}><i className="fa-solid fa-volume-high"></i></span>
          <span className='icon' id='volume-down' onClick={()=>toggleVolume("volume-up")}><i className="fa-solid fa-volume-xmark"></i></span>
      </div>

        <div className="container">
            <div className='game-mode' >
              <h3>Game Mode </h3>
              <div className="dropdown">
                <div className="select" onClick={toggleDropdown}>
                  <span><i className="fa-solid fa-user"></i>  vs <i className="fa-solid fa-user"></i></span>
                  <i className="fa-solid fa-caret-down"></i>
                </div>
                <ul className="dropdown-menu" id='drp-menu'>
                  <li onClick={(event) => selectDropdown(true,event)}><i className="fa-solid fa-user"></i>  vs <i className="fa-solid fa-desktop"></i></li>
                  <li onClick={(event) => selectDropdown(false,event)}><i className="fa-solid fa-user"></i>  vs <i className="fa-solid fa-user"></i> </li>
                </ul>
              </div>
            </div>
            <div className='game-difficulty'>
                <h3>Difficulty <span style={{fontSize:"12px"}} className='info-icon'><i className="fa-solid fa-circle-info"></i></span><span className='info-box'>Only can toggle (vs Computer)</span></h3>
                <div className='toggle-btn'>
                  <input type="checkbox" id="switch" disabled onChange={(event) => handleToggleAction(event)}/>
                  <label htmlFor='switch' className='switch-label'>
                    <span>Easy</span>
                    <span>Hard</span>
                  </label>
                </div>
            </div>
        </div>

        <div className='game-board'> 
          <div className='board-row'>
            <Square value={square[0]} handleAction={() => handleClick(0)} styles={{borderRight: "2.5px solid blue", borderBottom: "2.5px solid blue", borderImage: "linear-gradient(321deg, rgb(14 7 243), #171cd63b 50%) 1"}}/>
            <Square value={square[1]} handleAction={() => handleClick(1)} styles={{borderBottom: "2.5px solid blue"}}/>
            <Square value={square[2]} handleAction={() => handleClick(2)} styles={{borderBottom: "2.5px solid blue",borderLeft: "2.5px solid blue",borderImage: "linear-gradient(37deg, rgb(14, 7, 243), rgba(23, 28, 214, 0.23) 50%) 1 / 1 / 0 stretch"}} />
          </div>
          <div className='board-row'>
            <Square value={square[3]} handleAction={() => handleClick(3)} styles={{borderRight: "2.5px solid blue", borderBottom: "2.5px solid blue",borderImage: "linear-gradient(281deg, rgb(14, 7, 243), rgba(23, 28, 214, 0.23) 80%) 1 / 1 / 0 stretch"}}/>
            <Square value={square[4]} handleAction={() => handleClick(4)} styles={{borderBottom: "2.5px solid blue"}}/>
            <Square value={square[5]} handleAction={() => handleClick(5)} styles={{borderBottom: "2.5px solid blue",borderLeft: "2.5px solid blue",borderImage: "linear-gradient(105deg, rgb(14, 7, 243), rgba(23, 28, 214, 0.23) 80%) 1 / 1 / 0 stretch"}}/>
          </div>
          <div className='board-row'>
          <Square value={square[6]} handleAction={() => handleClick(6)} styles={{borderRight: "2.5px solid blue", borderImage: "linear-gradient(237deg, rgb(14 7 243), #171cd63b 30%) 1"}}/>
            <Square value={square[7]} handleAction={() => handleClick(7)}/>
            <Square value={square[8]} handleAction={() => handleClick(8)} styles={{borderLeft: "2.5px solid blue",borderImage: "linear-gradient(175deg, rgb(14, 7, 243), rgba(23, 28, 214, 0.23) 80%) 1 / 1 / 0 stretch"}} />
          </div>
        </div>

        <div className='restart'>
           <button onClick={restart}> <i className="fa-solid fa-rotate-right"></i><span>Restart</span></button> 
        </div>

        <table className='game-results'>
          <thead className='player-info'>
            <tr>
              <td>
                <div className='info-block'>
                  <p className='icon x'>X</p>
                  <p><input type='text' className='info-input' name='player-1' defaultValue="Player-1"></input></p>
                </div>
              </td>
              <td>
                <h1 style={{color: "#20cede"}}>Vs</h1>
              </td>
              <td>
                <div className='info-block'>
                  <p className='icon o'>O</p>
                  <p><input type="text" className='info-input' name='player-2' defaultValue="Player-2"></input></p>
              </div>
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{results.x}</td>
              <td>Wins</td>
              <td>{results.O}</td>
            </tr>
            <tr>
              <td>{results.draws}</td>
              <td>Draws</td>
              <td>{results.draws}</td>
            </tr>
          </tbody>
        </table>

      </div>
    </>
  )
}

