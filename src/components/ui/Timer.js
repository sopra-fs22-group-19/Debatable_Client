import {useState, useEffect} from 'react';
import "styles/ui/TImer.css";

const Timer = (props) => {
    const {initialMinute = 0, initialSeconds = 0, triggerMsgSend} = props;
    const [minutes, setMinutes] = useState(initialMinute);
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    triggerMsgSend();
                    clearInterval(myInterval)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    }, );

    const displaySeconds = () => {
        if (seconds < 10) {
            // Pad the number so that it displays 09 instead of 9
            return `0${seconds}`;
        } else{
            return String(seconds);
        }
    }

    return (
        <div className="icon-time">
            {minutes === 0 && seconds === 0
                ? null
                : <h1> {minutes}:{displaySeconds()}</h1>
            }
        </div>
    )
}

export default Timer;

