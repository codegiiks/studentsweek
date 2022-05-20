import style from 'styles/components/hourselector.module.css';
import { checkHourByRule, getByHoursDiff, getDayName } from 'lib/utils';
import { Fragment } from 'react';

const CONVERT = [
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
    const getCodeString = (d, h) => `${d}-${h}`;

    const selectHour = (d, h) => select(id, [[d, h]]);

    const renderHours = (i) =>
        Array.from({ length: info.N_OF_HOURS }).map((h, j) => {
            const disabled = !checkHourByRule(rules[i] & userRules[i], j, unit);
            const hourClassName = [
                style.hour,
                disabled ? style.disabled : null,
            ].join(' ');

            if (
                j % unit == 0 &&
                j + 1 <= parseInt(info.N_OF_HOURS / unit) * unit
            )
                return (
                    <div
                        className={hourClassName}
                        key={j}
                        onClick={() => !disabled && selectHour(i, j)}
                    >
                        <p>{CONVERT[j]}</p>
                        <span>
                            {getByHoursDiff(j)}/{getByHoursDiff(j + unit)}
                        </span>
                    </div>
                );
            else if (j + 1 > parseInt(info.N_OF_HOURS / unit) * unit)
                return (
                    <div
                        className={hourClassName}
                        key={j}
                        onClick={() => !disabled && selectHour(i, j)}
                    >
                        <p>{CONVERT[j]}</p>
                        <span>
                            {getByHoursDiff(j)}/{getByHoursDiff(j + 1)}
                        </span>
                    </div>
                );
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
