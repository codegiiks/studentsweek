import { useState } from 'react';
import style from 'styles/pages/index.module.css';

const GREETING_MESSAGES = ['Ciao', 'Hello', 'Hola', 'Salut', 'Hallo', 'Olà'];

export default function Home() {
    const [selectedGreeting, setSelectedGreeting] = useState(0);

    const changeGreeting = () => {
        setSelectedGreeting((selectedGreeting + 1) % GREETING_MESSAGES.length);
        console.log((selectedGreeting + 1) % GREETING_MESSAGES.length);
    };

    return (
        <div className={style.main}>
            <h2 className={style.title} data-test="greeting">
                {GREETING_MESSAGES[selectedGreeting]}
            </h2>
            <button
                className={style.button}
                onClick={changeGreeting}
                data-test="change-greeting-button"
            >
                Click me!
            </button>
        </div>
    );
}
