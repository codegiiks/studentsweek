import { Loader } from 'components';
import style from 'styles/components/hourselector.module.css';
import { getByHoursDiff } from 'lib/utils';

const N_OF_HOURS = process.env.NEXT_PUBLIC_N_OF_HOURS;

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

export function HourSelector({ select, rules, className }) {
    const hourBoxes = [];
    console.log(rules);

    let currentRule = rules;

    for (let i = N_OF_HOURS - 1; i >= 0; i--) {
        let disabled = true;
        if (currentRule - Math.pow(2, i) >= 0) {
            currentRule = currentRule - Math.pow(2, i);
            disabled = false;
        }

        hourBoxes.unshift(
            <div
                key={i}
                className={[style.hour, disabled ? style.disabled : null].join(
                    ' '
                )}
                onClick={disabled ? null : () => select(i)}
            >
                <p>{CONVERT[i]}</p>
                <span>
                    {getByHoursDiff(i)}-{getByHoursDiff(i + 1)}
                </span>
            </div>
        );
    }

    return rules ? (
        <div className={[style.wrapper, className].join(' ')}>{hourBoxes}</div>
    ) : (
        <Loader space />
    );
}
