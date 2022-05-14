import style from 'styles/components/errorpage.module.css';

export function ErrorPage({ error }) {
    return (
        <div className={style.wrapper}>
            <div className={style.error}>
                <h2>{error?.message || 'Some error occurred'}</h2>
                <p>{error?.desc || 'No description provided'}</p>
            </div>
        </div>
    );
}
