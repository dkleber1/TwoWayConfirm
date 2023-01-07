import axios from 'axios';
import React from 'react';
import {useState,useEffect} from "react"
import { useParams } from 'react-router-dom';

function Message(){
    // const {id} = useParams();
    // const userId = useParams()['id'];
    let [loading,setLoading] = useState(true)
    let [statusCode, setStatusCode] = useState(200) // default to 200 by default (no error)
    let [hint,setHint] = useState()
    let [outcome, setOutcome] = useState()
    let [userInput, setUserInput] = useState()
    const arr = useParams();
    const id = arr['id'];

    useEffect(()=>{
        axios.get('http://localhost:4000/get_message?id=' + id).then((response)=>{
            if(response.status == 204){
                // we want to show an error page
                setStatusCode(204)
            }else{
                setHint(response['data']) // or response.data
            }
        }).catch((error)=>{
            setStatusCode(404)
        }).finally(()=>{
            setLoading(false)
        })
    },[])

    function buttonClick(){
        let userData = {guess: userInput}
        let headers = {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',}}

        axios.post('http://localhost:4000/guess_message?id=' + id, userData, headers).then((response)=>{
            if (response.status == 204)
            {
                setOutcome("No more guesses left")
            }
            else if (response.data == "False")
            {
                setOutcome("The guess was Incorrect, try again")
            }
            else if (response.data == "True")
            {
                setOutcome("The guess was Correct")
            }
        })
    }
    if(loading){
        <></>
    }else if(statusCode == 200){
        return(
            <div className='guess-page'>
                <h3>hint: {hint}</h3>
                <p>Guess the message in the box below</p>
                <input onChange={(event)=>{
                    // onChange is when smth like the textbox input is changed
                    //  textbox input saved in userInput everytime textbox updates
                    setUserInput(event.target.value)
                }}/>
                <br></br>
                <button onClick={buttonClick}>Submit</button>
                <p>{outcome}</p>
            </div> 
        )
    }else if(statusCode == 204){
        return(
            <div className='guess-page'>
                <h2>ran out of guesses.</h2>
            </div>
        )
    }else{
        return(
            <div className='guess-page'>
                <h2>Invalid message</h2>
            </div>
        )
    }
}

export default Message;