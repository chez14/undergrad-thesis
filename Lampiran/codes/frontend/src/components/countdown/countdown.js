import React, { useState, useEffect } from 'react'

function CountDown({ secondsLeft, onEnded = () => { } }) {

    const [internalTimer, setInternalTimer] = useState(secondsLeft)
    useEffect(() => {
        setInternalTimer(secondsLeft);
        return () => { };
    }, [secondsLeft])


    useEffect(() => {
        let timer = null;
        let actualTime = internalTimer;

        timer = setInterval(() => {
            setInternalTimer(Math.max(actualTime - 1, 0));
            actualTime = Math.max(actualTime - 1, 0);
            if (actualTime === 0) {
                onEnded();
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };
        // eslint-disable-next-line
    }, [])

    let formatters = [
        Math.floor(internalTimer / 3600),
        Math.floor((internalTimer % 3600) / 60),
        (internalTimer % 60),
    ]

    return (
        <span>
            {formatters.map(e => String(e).padStart(2, 0)).join(":")}
        </span>
    )
}

export default CountDown
