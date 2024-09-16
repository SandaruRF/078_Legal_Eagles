import React, { useRef, useState } from 'react'
import "../CSS/chat-page.css"
import axios from "axios";

const Chat = () => {
    function throttle(func, limit) {
        let last = 0;
        return function (...args) {
            const now = Date.now();
            if (now - last >= limit) {
                last = now;
                return func.apply(this, args);
            }
        };
    }
    const prompt = useRef('');
    const [answer, setAnswer] = useState('');
    const [loading,iLoading] = useState(false);
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
        div.appendChild(text);
        right.appendChild(div);
        row.appendChild(left);
        row.appendChild(right);
        container.appendChild(row);
        const chatSection = document.querySelector('.chat-section');
        chatSection.scrollTop = chatSection.scrollHeight;

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
                const anstext = res.data.Answer;
                const answer = anstext.replace(/\*\*/g, '<br/>');
                const answernew = anstext.replace(/\*/g, '<br/>');
                div.innerHTML = answernew;
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
            <div className="container chat-section">
                <div className="row">
                    <div className="container chat-area">
                        <div className="row">
                            <div className="conversation-section text-center" id='conversation-sect'>
                                <h1>Welcome to the AI Based Election Bot </h1>
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