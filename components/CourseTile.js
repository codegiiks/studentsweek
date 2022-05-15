import style from 'styles/components/coursetile.module.css';

export function CourseTile(props) {
    const data = props.data;
    const className = props.className;

    return (
        <div {...props} className={[style.wrapper, className].join(' ')}>
            <div className={style.textWrapper}>
                <h2>{data.name}</h2>
                <p>{data.desc || 'Nessuna descrizione'}</p>
                <p className={style.org}>{data.org.name}</p>
            </div>
            <div className={style.emoji}>{data.emoji}</div>
        </div>
    );
}
