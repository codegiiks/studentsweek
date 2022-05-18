import Robot from 'assets/Robot';

import style from 'styles/components/errorpage.module.css';

export function ErrorPage({ error, logout }) {
    return (
        <div className={style.wrapper}>
            <Robot className={style.artwork} />
            <div className={style.error}>
                <h2>Errore {error?.code}</h2>
                <p>{error?.message || 'No description provided'}</p>
                {logout && <button onClick={logout}>Logout</button>}
            </div>
        </div>
    );
}
