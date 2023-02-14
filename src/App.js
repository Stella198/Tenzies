import React from 'react';
import './App.css';
import Die from './Die';
import{nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App(){
 const[dice, setDice]=React.useState(allNewDiece())
 const[tenzies, setTenzies]=React.useState(false)
 const [numOfRolls, setNumOfRolls] = React.useState(0);
 const [time, setTime] = React.useState(0);
 const [running, setRunning] = React.useState(false);
 const [bestTime, setBestTime] = React.useState(23450);

 React.useEffect(()=>{
  const allHeld = dice.every((die) => die.isHeld);
  const someHeld = dice.some((die) => die.isHeld);
  const firstValue = dice[0].value;
  const allSameValue = dice.every((die) => die.value === firstValue);
  if (someHeld) {
      setRunning(true);
  }
  if (allHeld && allSameValue) {
      setRunning(false);
      let currentTime = time;
      if (currentTime < bestTime) {
          setBestTime(currentTime);
          localStorage.setItem("bestTime", JSON.stringify(currentTime));
      }
      setTenzies(true);
  }
}, [dice, time, bestTime]);
 React.useEffect(() => {
  const bestTime = JSON.parse(localStorage.getItem("bestTime"));
  if (bestTime) {
      setBestTime(bestTime);
  }
}, []);

React.useEffect(() => {
  let interval;
  if (running) {
      interval = setInterval(() => {
          setTime((prevTime) => prevTime + 10);
      }, 10);
  } else if (!running) {
      clearInterval(interval);
  }
  return () => clearInterval(interval);
}, [running]);

 function generateNewDie(){
        return {
        value:Math.ceil(Math.random()* 6),
        isHeld:false,
        id:nanoid()
      }}

 function allNewDiece(){
    const newDiece=[]
    for (let i = 0; i < 10; i++) {
       newDiece.push(generateNewDie())
    }
    return newDiece
 }

 
 function rollDice(){
  if(!tenzies){
    setNumOfRolls((prevState)=>prevState+1)
    setDice(oldDice=>oldDice.map(die=>{
    return die.isHeld?
     die:
     generateNewDie()
    }))
  }else{
    setTenzies(false)
    setDice(allNewDiece())
    setNumOfRolls(0);
    setTime(0);
  }
  
 }

 function holdDice(id){
  setDice(oldDice=>oldDice.map(die=>{
    return die.id===id?
    {...die,isHeld:!die.isHeld}:
    die
  }))
 }

 const diceElements=dice.map(die=>(
 <Die 
 key={die.id} 
 value={die.value} 
 isHeld={die.isHeld}
 holdDice={()=>holdDice(die.id)}
 />))
  return(
    <main>
      {tenzies && <Confetti/>}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <h2 className="track-rolls">Number of Rolls: {numOfRolls}</h2>
                <div className="timer">
                    <div className="current-time">
                        <h3 className="current">Current</h3>
                        <div>
                            <span>
                                {("0" + Math.floor((time / 60000) % 60)).slice(
                                    -2
                                )}
                                :
                            </span>
                            <span>
                                {("0" + Math.floor((time / 1000) % 60)).slice(
                                    -2
                                )}
                                :
                            </span>
                            <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
                        </div>
                    </div>
                    <div className="best-time">
                        <h3 className="best">Best</h3>
                        <div>
                            <span>
                                {(
                                    "0" + Math.floor((bestTime / 60000) % 60)
                                ).slice(-2)}
                                :
                            </span>
                            <span>
                                {(
                                    "0" + Math.floor((bestTime / 1000) % 60)
                                ).slice(-2)}
                                :
                            </span>
                            <span>
                                {("0" + ((bestTime / 10) % 100)).slice(-2)}
                            </span>
                        </div>
                    </div>
                </div>
      <div className='dice-container'>
       {diceElements}
      </div>
      <button 
      className='roll-dice' 
      onClick={rollDice}>
        {tenzies? "New Game":"Roll"}
        </button>
    </main>
  )
}