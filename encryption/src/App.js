import logo from './logo.svg';
import './App.css';
import {useState,useEffect} from "react"
import {BrowserRouter, Routes, Route, Link} from "react-router-dom"
import "axios"
import axios from 'axios';
import Message from './Message';
import CreateMessage from './CreateMessage';
function App() {
  let [result,setResult] = useState("hint") // variable


  return (
    <BrowserRouter>
        <div className='menu'>
          <Link className='link' to="/">
            <div className='link-content'>
              Home
            </div>
          </Link>
          <Link className='link' to="/create_message">
            <div className='link-content'>
              Create a Message
            </div>
          </Link>
        </div>
        <hr/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/create_message" element={<CreateMessage/>}/>
        <Route path="/message/:id" element={<Message/>}/>
      </Routes>
    </BrowserRouter>
    // <div className="App">
    //   <h1>{result}</h1>
    // </div>
  );
}

function Home() {
  return (
    <div className = 'guess-page'>
      <h2>Home</h2>
    </div>
  );
}
export default App;
