import supabase from 'lib/supabase';
import { getEmail, getFullName, getPropic } from 'lib/utils';
import style from 'styles/components/intropopup.module.css';

export function IntroPopup({ visible, close, classes, session }) {
    const submitUserInfo = async () => {
        const dataToSend = {
            class: document.querySelector('#class').value,
            email: getEmail(session),
            name: getFullName(session),
            propic: getPropic(session),
        };

        const { data, error } = await supabase
            .from('users')
            .insert([dataToSend]);

        close(data[0]);
    };

    return visible && classes && Array.isArray(classes) ? (
        <div className={style.wrapper}>
            <div className={style.popup}>
                <h2>Benvenuto</h2>
                <p className={style.desc}>
                    Di quale classe fai parte? Seleziona la tua classe
                    dall&apos;elenco.
                </p>
                <select id="class" name="class">
                    {classes.map((v, i) => (
                        <option value={v} key={i}>
                            {v}
                        </option>
                    ))}
                </select>
                <button className={style.submit} onClick={submitUserInfo}>
                    Seleziona
                </button>
            </div>
        </div>
    ) : null;
}
