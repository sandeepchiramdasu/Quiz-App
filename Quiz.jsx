import React, { useRef, useState, useEffect } from 'react';
import './Quiz.css';
import { data } from '../Assests/data';

const Quiz = () => {
    let [index, setIndex] = useState(0);
    let [question, setQuestion] = useState(data[index]);
    let [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    let [result, setResult] = useState(false);
    let [timeLeft, setTimeLeft] = useState(150); // Timer in seconds (e.g., 5 minutes = 300 seconds)

    let option1 = useRef(null);
    let option2 = useRef(null);
    let option3 = useRef(null);
    let option4 = useRef(null);

    let option_array = [option1, option2, option3, option4];

    // Calculate minutes and seconds from the total time left
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    useEffect(() => {
        if (timeLeft > 0 && !result) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !result) {
            submitQuiz(); // Automatically submit the quiz when time ends
        }
    }, [timeLeft, result]);

    const checkAns = (e, ans) => {
        if (lock === false) {
            if (question.ans === ans) {
                e.target.classList.add("correct");
                setLock(true);
                setScore(prev => prev + 1);
            } else {
                e.target.classList.add("wrong");
                setLock(true);
                option_array[question.ans - 1].current.classList.add("correct");
            }
        }
    };

    const next = () => {
        if (lock === true) {
            setIndex(++index);
            setQuestion(data[index]);
            setLock(false);
            option_array.map((option) => {
                option.current.classList.remove("wrong");
                option.current.classList.remove("correct");
                return null;
            });
        }
    };

    const submitQuiz = () => {
        setResult(true); // End quiz and display result
    };

    const reset = () => {
        setIndex(0);
        setQuestion(data[0]);
        setScore(0);
        setLock(false);
        setResult(false);
        setTimeLeft(150); // Reset timer to 5 minutes (300 seconds)
    };

    return (
        <div className="container">
            <h1>Quiz App</h1>
            <div className="timer">
                Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}s
            </div> {/* Timer in minutes and seconds */}
            <hr />
            {!result ? (
                <>
                    <h2>{index + 1}.{question.question}</h2>
                    <ul>
                        <li ref={option1} onClick={(e) => { checkAns(e, 1) }}>{question.option1}</li>
                        <li ref={option2} onClick={(e) => { checkAns(e, 2) }}>{question.option2}</li>
                        <li ref={option3} onClick={(e) => { checkAns(e, 3) }}>{question.option3}</li>
                        <li ref={option4} onClick={(e) => { checkAns(e, 4) }}>{question.option4}</li>
                    </ul>

                    {index < data.length - 1 ? (
                        <button onClick={next}>Next</button>
                    ) : (
                        <button onClick={submitQuiz}>Submit</button>
                    )}
                    <div className="index">{index + 1} of {data.length} questions</div>
                </>
            ) : (
                <>
                    <h2>Your score is {score} out of {data.length}</h2>
                    <button onClick={reset}>Restart</button>
                </>
            )}
        </div>
    );
};

export default Quiz;
