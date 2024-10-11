import React, { useRef, useState, useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import "../CSS/chat-page.css";
import axios from "axios";
import lightLogo from "../images/chatLogo.png";
import userlogo from "../images/userLogo.png";
import backLight from "../images/backLight.png";
import backDark from "../images/backDark.png";
import { useNavigate } from "react-router-dom";

const Chat = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigator = useNavigate();

    const clickBack = () => {
        navigator("/");
    };
    const prompt = useRef("");
    const sendPrompt = () => {
        const question = prompt.current.value;
        const container = document.getElementById("conversation-sect");
        const row = document.createElement("div");
        row.classList.add("row");
        const left = document.createElement("div");
        left.classList.add("col-sm-6");
        const right = document.createElement("div");
        right.classList.add("col-sm-6");
        row.classList.add("user-question-row");
        const div = document.createElement("div");
        div.classList.add("user-question-div");
        const text = document.createTextNode(question);
        const logo_div = document.createElement("img");
        logo_div.classList.add("user-logo-div");
        logo_div.src = userlogo;
        div.appendChild(text);
        right.appendChild(logo_div);
        right.appendChild(div);
        row.appendChild(left);
        row.appendChild(right);
        container.appendChild(row);
        const chatSection = document.querySelector(".chat-section");
        chatSection.scrollTop = chatSection.scrollHeight;
        chatSection.scrollTo();

        prompt.current.value = "";

        axios
            .get(`http://localhost:8000/chat/${question}`)
            .then((res) => {
                const container = document.getElementById("conversation-sect");
                const row = document.createElement("div");
                row.classList.add("row");
                const left = document.createElement("div");
                left.classList.add("col-sm-10");
                const right = document.createElement("div");
                right.classList.add("col-sm-2");
                row.classList.add("user-question-row");
                const div = document.createElement("div");
                div.classList.add("answer-div");
                const logo_div = document.createElement("img");
                logo_div.classList.add("logo-div");
                logo_div.src = lightLogo;
                const anstext = res.data.Answer;
                const answer = anstext.replace(/\*\*/g, "<br/>");
                const answernew = anstext.replace(/\*/g, "<br/>");
                div.innerHTML = answernew;
                left.appendChild(logo_div);
                left.appendChild(div);
                row.appendChild(left);
                row.appendChild(right);
                container.appendChild(row);

                const chatSection = document.querySelector(".chat-section");
                chatSection.scrollTop = chatSection.scrollHeight;
            })
            .catch((err) => {
                alert(err);
            });
    };
    return (
        <div
            className={
                theme === "dark"
                    ? "watermark-container-dark"
                    : "watermark-container-light"
            }
        >
            <div
                className={`"content" ${
                    theme === "dark" ? "chat-page-dark" : "chat-page-light"
                }`}
            >
                <div
                    className={`container-fluide ${
                        theme === "light"
                            ? "title-container-light"
                            : "title-container-dark"
                    }`}
                >
                    <div className="row title-row">
                        <div className="col-sm-2">
                            <img
                                src={theme === "dark" ? backDark : backLight}
                                alt=""
                                className="back-button"
                                onClick={() => {
                                    clickBack();
                                }}
                            />
                        </div>
                        <div className="col-sm-8">
                            <h1 className="chatbot-title-text">
                                <span
                                    className="welcome-text"
                                    style={{
                                        color:
                                            theme === "light"
                                                ? "black"
                                                : "white",
                                    }}
                                >
                                    Welcome to the Legal Eagles
                                </span>{" "}
                                <span
                                    className="chatbot-text"
                                    style={{
                                        color:
                                            theme === "light"
                                                ? "black"
                                                : "white",
                                    }}
                                >
                                    Chat Bot
                                </span>
                            </h1>
                        </div>
                        <div className="col-sm-2">
                            <div className="theme-switch" onClick={toggleTheme}>
                                <div
                                    className={`switch ${
                                        theme === "dark" ? "dark" : "light"
                                    }`}
                                >
                                    <div className="switch-circle"></div>
                                </div>
                                <span
                                    className="theme-label"
                                    style={{
                                        color:
                                            theme === "light"
                                                ? "black"
                                                : "white",
                                    }}
                                >
                                    {theme === "light" ? "Light" : "Dark"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container chat-section">
                    <div className="row">
                        <div className="container chat-area">
                            <div className="row">
                                <div
                                    className="conversation-section text-center"
                                    id="conversation-sect"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluide prompt-area justify-content-around">
                    <div className="container prompt-section">
                        <div className="row">
                            <div className="col-sm-10">
                                <input
                                    style={{
                                        color:
                                            theme === "light"
                                                ? "black"
                                                : "white",
                                        backgroundColor:
                                            theme === "light"
                                                ? "white"
                                                : "#727272",
                                    }}
                                    type="text"
                                    className="user-prompt"
                                    ref={prompt}
                                    placeholder="Message Here"
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            prompt.current.value.trim() !== ""
                                        ) {
                                            sendPrompt();
                                        }
                                    }}
                                />
                            </div>
                            <div className="col-sm-2">
                                <button
                                    className="submit-prompt"
                                    onClick={() => {
                                        if (
                                            prompt.current.value.trim() !== ""
                                        ) {
                                            sendPrompt();
                                        }
                                    }}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <br></br>
                <p
                    className="footer-text-bot"
                    style={{
                        backgroundColor:
                            theme === "light" ? "white" : "#303030",
                        fontSize:"1rem",
                    }}
                >
                    {" "}
                    Legal Eagles chatbot can make mistakes. Check important
                    info.
                </p>
            </div>
        </div>
    );
};

export default Chat;
