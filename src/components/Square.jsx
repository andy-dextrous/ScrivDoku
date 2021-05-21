import React, {useState, useEffect, useContext} from 'react'
import {WIDTH} from '../logic/CreateSodokuBoard'
import {numbers} from '../logic/CreateSodokuBoard'
import {pausedContext, boardContext, takeNotesTurnedOnContext, isCorrectContext} from '../App'
import Notes from './Notes'

const Square = (props) => {
const {number, 
      index, 
      hidden,  
      setSelectedSquare, 
      selectedSquare} = props
const [isHovered, setIsHovered] = useState(false)
const [chosenNumber, setChosenNumber] = useState(null)
const isPaused = useContext(pausedContext)
const boardConfig = useContext(boardContext)
const [style, setStyle] = useState({color:"green"})
const {takeNotesTurnedOn} = useContext(takeNotesTurnedOnContext) 
const {isCorrectTurnedOn} = useContext(isCorrectContext) 
const [notes, setNotes] = useState([])

  function determineBorders(index){
    let classes = []

    if (index % 3 === 0) {
      classes.push('sqr-bdr-left')  
    }
    if ((index + 1) % WIDTH === 0) {
      classes.push('sqr-bdr-right')
    }
    if (index < WIDTH) {
      classes.push('sqr-bdr-top')
    }
    if (index >= (WIDTH * WIDTH - WIDTH) ||
      (index > (WIDTH * 2) - 1 && index < (WIDTH * 3)) ||
      (index > (WIDTH * 5) - 1 && index < (WIDTH * 6))) {
        classes.push('sqr-bdr-bottom')
    }
    if (selectedSquare === index && hidden) {
      classes.push('clickedNumber')
    }
    return classes.join(' ')
  }

  function handleClick() {
    hidden && setSelectedSquare(index)
  }

  useEffect(()=>{
    function inputValue(e) {
      const value = 
        e.type === 'click' ? 
        e.target.innerHTML : 
        e.key
        if (!hidden) return; 
        if (!numbers.includes(parseInt(value)) && e.key !== 'Backspace') return;
        if(!takeNotesTurnedOn){
          setChosenNumber(value)
          setSelectedSquare(null)
          sessionStorage.setItem(index, value)
          setNotes([])
         }
        if ( e.key === 'Backspace' ) {
          setChosenNumber(null)
          setSelectedSquare(null)
          sessionStorage.removeItem(index)
         }
    }

    if(selectedSquare === index) {
      let numberButtons = document.querySelectorAll('.number-options')
      
      numberButtons.forEach(button=>{
       button.addEventListener('click', inputValue)
      })
      document.addEventListener("keydown", inputValue)
    }

    return () => {
      if(selectedSquare === index){
      let numberButtons = document.querySelectorAll('.number-options')
      numberButtons.forEach(button=>{
       button.removeEventListener('click', inputValue)
      })}
      document.removeEventListener("keydown", inputValue)
    }

  }, [selectedSquare, index, setSelectedSquare, hidden, chosenNumber, takeNotesTurnedOn])

  useEffect(() => {
    if (!isPaused)  {
    const persistedNumber = sessionStorage.getItem(index)
    setChosenNumber(persistedNumber)}

    // const persistedNotes = sessionStorage.getItem(`${index}-Notes`)
    setNotes([])
  }, [isPaused, index, boardConfig])


useEffect(()=>{
  const styleObject = {}
  if (chosenNumber) {
    styleObject.color="#69a7f0"}
  if (isHovered && hidden && selectedSquare !== index) 
    styleObject.backgroundColor = "#f3f6fa"  
  if (chosenNumber && selectedSquare !== index) 
    styleObject.backgroundColor = '#f3f6fa'
  if (chosenNumber && chosenNumber !== number && isCorrectTurnedOn) 
    styleObject.color = "red"
  if (chosenNumber && parseInt(chosenNumber) === number && isCorrectTurnedOn) 
    styleObject.color = "green"
    
    setStyle(styleObject)

}, [isHovered, chosenNumber, hidden, index, selectedSquare, number, isCorrectTurnedOn])

useEffect(()=>{
  if(!takeNotesTurnedOn) return;
  if(selectedSquare !== index) return;  
  function handleNote(e) {
      const value = 
        e.type === 'click' ? e.target.innerHTML : e.key
        if (!hidden) return; 
        if (numbers.includes(parseInt(value))){
          const newNotes = [...notes,parseInt(value)]
          setNotes(newNotes)
          sessionStorage.setItem(`${index}-Notes`, newNotes)
         }
    }  

  let numberButtons = document.querySelectorAll('.number-options')
  numberButtons.forEach(button=>{
   button.addEventListener('click', handleNote)
  })
  document.addEventListener("keydown", handleNote)

return function cleanup(){
  let numberButtons = document.querySelectorAll('.number-options')
  numberButtons.forEach(button=>{
    button.removeEventListener('click', handleNote)
  })
  document.removeEventListener("keydown", handleNote)
}

}, [takeNotesTurnedOn, selectedSquare, index, hidden, setSelectedSquare, notes])

  return (
    <div 
      className={"square " + determineBorders(index)} 
      onClick={handleClick}
      onMouseOver={()=> {setIsHovered(true)}}
      onMouseLeave={()=> {setIsHovered(false)}}
      style={style}
      >
      {!hidden && number}
      {hidden && chosenNumber}
        <Notes notes={notes}/>
    </div>
  )
}

export default Square

