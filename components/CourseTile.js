import { getByHoursDiff } from 'lib/utils';
import style from 'styles/components/coursetile.module.css';
import { Loader } from './Loader';

export function CourseTile({ data, className, ...props }) {
    return data ? (
        <>
            <div {...props} className={[style.wrapper, className].join(' ')}>
                <div className={style.textWrapper}>
                    <h2 className={style.name}>{data.name}</h2>
                    <p className={style.desc}>
                        {data.desc || data.description || 'Nessuna descrizione'}
                    </p>
                    <p className={style.org}>
                        {data?.org?.name || data?.user_name}
                    </p>
                </div>
                <div className={style.emoji}>{data.emoji}</div>
            </div>
            {data.hour != undefined ? (
                <div className={style.otherInfo}>
                    {getByHoursDiff(data.hour)} -{' '}
                    {getByHoursDiff(data.hour + 1)}
                    {' | '}
                    Aula {data.room}
                </div>
            ) : null}
        </>
    ) : (
        <Loader space />
    );
}
