import React, { useRef, useState } from 'react'
import "../CSS/chat-page.css"
import axios from "axios";
import logo from "../images/logo.png"
import userlogo from "../images/user.png"
import back from "../images/back.png"
import { NavBar } from '../navbar/NavBar';
import { Link, useNavigate } from 'react-router-dom';

const Chat = () => {

    const navigator = useNavigate();

    const clickBack = () =>{
        navigator("/");
    }
    const prompt = useRef('');
    const [answer, setAnswer] = useState('');
    const [loading, iLoading] = useState(false);
    const sendPrompt = () => {
        const question = prompt.current.value;

        const container = document.getElementById('conversation-sect');
        const row = document.createElement('div');
        row.classList.add('row');
        const left = document.createElement('div');
        left.classList.add('col-sm-6');
        const right = document.createElement('div');
        right.classList.add('col-sm-6');
        row.classList.add('user-question-row')
        const div = document.createElement('div');
        div.classList.add('user-question-div')
        const text = document.createTextNode(question);
        const logo_div = document.createElement('img');
        logo_div.classList.add('user-logo-div');
        logo_div.src = userlogo;
        div.appendChild(text);
        right.appendChild(logo_div);
        right.appendChild(div);
        row.appendChild(left);
        row.appendChild(right);
        container.appendChild(row);
        const chatSection = document.querySelector('.chat-section');
        chatSection.scrollTop = chatSection.scrollHeight;
        chatSection.scrollTo()

        prompt.current.value = "";

        axios.get(`http://localhost:8000/chat/${question}`)
            .then(res => {
                const container = document.getElementById('conversation-sect');
                const row = document.createElement('div');
                row.classList.add('row');
                const left = document.createElement('div');
                left.classList.add('col-sm-10');
                const right = document.createElement('div');
                right.classList.add('col-sm-2');
                row.classList.add('user-question-row');
                const div = document.createElement('div');
                div.classList.add('answer-div')
                const logo_div = document.createElement('img');
                logo_div.classList.add('logo-div');
                logo_div.src = logo;
                const anstext = res.data.Answer;
                const answer = anstext.replace(/\*\*/g, '<br/>');
                const answernew = anstext.replace(/\*/g, '<br/>');
                div.innerHTML = answernew;
                left.appendChild(logo_div);
                left.appendChild(div);
                row.appendChild(left);
                row.appendChild(right);
                container.appendChild(row);

                const chatSection = document.querySelector('.chat-section');
                chatSection.scrollTop = chatSection.scrollHeight;

            }).catch(err => {
                alert(err);
            })
    }
    return (
        <div className='chat-page'>
            <div className="container-fluide title-container">
                <div className="row">
                    <div className="col-sm-2">
                        <img src={back} alt="" className='back-button' onClick={()=>{clickBack()}}/>
                    </div>
                    <div className="col-sm-8">
                        <h1 className='chatbot-title-text'>Welcome to the Legal Eagle Chat Bot </h1>
                    </div>
                    <div className="col-sm-2">
                        <img src={logo} className='logo-img' alt="" />
                    </div>
                </div>
            </div>
            <div className="container chat-section">
                <div className="row">
                    <div className="container chat-area">
                        <div className="row">
                            <div className="conversation-section text-center" id='conversation-sect'>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="container-fluide prompt-area justify-content-around">
                <div className="container prompt-section">
                    <div className="row">
                        <div className="col-sm-10">
                            <input type="text" className="user-prompt" ref={prompt} placeholder='Message Here' />
                        </div>
                        <div className="col-sm-2">
                            <button className="submit-prompt" onClick={() => sendPrompt()}>Send</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Chat