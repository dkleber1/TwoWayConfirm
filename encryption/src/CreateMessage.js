import axios from 'axios';
import React from 'react';
import {useState,useEffect} from "react"
import { useParams } from 'react-router-dom';
import Slider from '@mui/material/Slider'

function CreateMessage(){
    // const {id} = useParams();
    // const userId = useParams()['id'];
    let [hint,setHint] = useState('')
    let [outcome, setOutcome] = useState()
    let [threshold, setThreshold] = useState(100)
    let [userInput, setUserInput] = useState()
    let [userGuesses, setUserGuesses] = useState(-1)
    
    const arr = useParams();

    function buttonClick(){
        let userData = {text: userInput, hint:hint, guesses:userGuesses, threshold:threshold}
        let headers = {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',}}

        // call variables with {} wrapped around
        // to get data from backend use the 'reponse' argument, to get data from url use useParams
        axios.post('http://localhost:4000/new_message/', userData, headers).then((response)=>{
            let url = "http://localhost:3000/message/" + response.data
            setOutcome(<a href={url}>{url}</a>)
        })
    }
    

    return(
        <div className='new-message'>
            <p>Enter your message in the box below</p>
            <input onChange={(event)=>{
                // onChange is when smth like the textbox input is changed
                //  textbox input saved in userInput everytime textbox updates
                setUserInput(event.target.value)
            }}/>
            <br></br>
            <p>Enter your hint (Optional)</p>
            <input onChange={(event)=>{
                // onChange is when smth like the textbox input is changed
                //  textbox input saved in userInput everytime textbox updates
                // event.target.value gets value that user inputs in textbox
                setHint(event.target.value)
            }}/>
            <p>Select how many guesses the user is allowed</p>
            <select value={userGuesses} onChange={(event)=>{
                    setUserGuesses(event.target.value)
            }}>
                {(()=>{
                    let list = []
                    for(let i=1;i<=10;i++){
                        list.push(<option key={i} value={i}>{i}</option>)
                    }
                    list.push(<option key={-1} defaultValue={-1} value={-1}>Unlimited</option>)
                    return list
                })()}
            </select>
            <br></br>
            <br></br>
            <p>Pick a similarity threshold to assess the accuracy of the guess </p>
            <Slider style={{width:"40%"}}
                    onChange={(event)=>{
                        setThreshold(event.target.value)
                    }}
                    defaultValue={100}
                    aria-label="Small"
                    valueLabelFormat={(value)=>{
                        return value + "%"
                    }}
                    valueLabelDisplay="auto"
            />
            <br></br>
            <button onClick={buttonClick}>Submit</button>
            <p>{outcome}</p>
        </div> 
    )
}

export default CreateMessage;