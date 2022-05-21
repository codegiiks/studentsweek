import style from 'styles/components/hourselector.module.css';
import { checkHourByRule, getByHoursDiff, getDayName } from 'lib/utils';
import { Fragment } from 'react';

export const CONVERT = [
    'Prima',
    'Seconda',
    'Terza',
    'Quarta',
    'Quinta',
    'Sesta',
    'Settima',
    'Ottava',
];

export function HourSelector({
    select,
    userRules,
    course: { id, unit, rules },
    info,
    className,
    ...props
}) {
    const selectHour = (d, h) => select(id, [[d, h]]);

    const renderHours = (i) =>
        Array.from({ length: info.N_OF_HOURS }).map((h, j) => {
            const hourClassName = [style.hour];

            if (
                j % unit == 0 &&
                j + 1 <= parseInt(info.N_OF_HOURS / unit) * unit
            ) {
                const disabled = !checkHourByRule(
                    rules[i] & userRules[i],
                    j,
                    unit
                );
                hourClassName.push(disabled ? style.disabled : null);
                return (
                    <div
                        className={hourClassName.join(' ')}
                        key={j}
                        onClick={() => !disabled && selectHour(i, j)}
                    >
                        <p>{CONVERT[j]}</p>
                        <span>
                            {getByHoursDiff(j)}/{getByHoursDiff(j + unit)}
                        </span>
                    </div>
                );
            } else if (j + 1 > parseInt(info.N_OF_HOURS / unit) * unit) {
                const disabled = !checkHourByRule(
                    rules[i] & userRules[i],
                    j,
                    1
                );
                hourClassName.push(disabled ? style.disabled : null);
                return (
                    <div
                        className={hourClassName.join(' ')}
                        key={j}
                        onClick={() => !disabled && selectHour(i, j)}
                    >
                        <p>{CONVERT[j]}</p>
                        <span>
                            {getByHoursDiff(j)}/{getByHoursDiff(j + 1)}
                        </span>
                    </div>
                );
            }
        });

    return (
        <div className={[style.wrapper, className].join(' ')} {...props}>
            {Array.from({ length: info.N_OF_DAYS }).map((v, i) =>
                (userRules[i] & rules[i]) != 0 ? (
                    <Fragment key={i}>
                        <p className={style.dayName}>
                            {getDayName(i, info.DAY_OF_START)}
                        </p>
                        <div className={style.hoursWrapper}>
                            {renderHours(i)}
                        </div>
                    </Fragment>
                ) : null
            )}
        </div>
    );
}
