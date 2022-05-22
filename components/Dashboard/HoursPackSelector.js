import style from 'styles/components/hourspackselector.module.css';
import supabase from 'lib/supabase';
import { hoursPacksAtom } from 'lib/atoms';
import { checkHourByRule, getByHoursDiff, getDayName } from 'lib/utils';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Loader } from 'components/Loader';

export function HoursPackSelector({ select, course, userRules, info }) {
    const [hoursPacks, setHoursPacks] = useAtom(hoursPacksAtom);
    const [courseHoursPacks, setCoursesHoursPacks] = useState(null);

    const fetchHoursPack = async (id) => {
        const { data, error } = await supabase
            .from('hours_packs')
            .select('id, name, value')
            .eq('id', id)
            .limit(1)
            .single();
        if (!error) return data;
        else message.error(error.message);
    };

    const solveHoursPack = async (id) => {
        let hoursPack;
        if ((hoursPack = hoursPacks[id])) return hoursPack;
        else {
            hoursPack = await fetchHoursPack(id);
            setHoursPacks({
                ...hoursPacks,
                [id]: hoursPack,
            });
            return hoursPack;
        }
    };

    useEffect(() => {
        const solveCourseHoursPacks = async () => {
            setCoursesHoursPacks(
                await Promise.all(
                    course.hours_packs.map(async (v) => await solveHoursPack(v))
                )
            );
        };

        if (course) solveCourseHoursPacks();
    }, [course]);

    useEffect(() => {
        console.log(courseHoursPacks);
    }, [courseHoursPacks]);

    return (
        <div className={style.wrapper}>
            <p className={style.desc}>Pacchetti Ore</p>
            <div className={style.cardsWrapper}>
                {courseHoursPacks ? (
                    Object.values(courseHoursPacks).map(
                        ({ id, name, value }) => {
                            const disabled = !value.every(([d, h]) =>
                                checkHourByRule(
                                    userRules[d] & course.rules[d],
                                    h
                                )
                            );
                            return (
                                <div
                                    className={[
                                        style.card,
                                        disabled ? style.disabled : null,
                                    ].join(' ')}
                                    key={id}
                                    onClick={() =>
                                        disabled ? null : select(course.id, id)
                                    }
                                >
                                    <p className={style.name}>{name}</p>
                                    <div className={style.specs}>
                                        {value.map(([d, h], i) => (
                                            <p key={i}>
                                                {getDayName(
                                                    d + 1,
                                                    info.HOUR_OF_START
                                                )}{' '}
                                                -{' '}
                                                {getByHoursDiff(
                                                    h,
                                                    new Date(info.HOUR_OF_START)
                                                )}
                                                /
                                                {getByHoursDiff(
                                                    h + 1,
                                                    new Date(info.HOUR_OF_START)
                                                )}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            );
                        }
                    )
                ) : (
                    <Loader space />
                )}
            </div>
        </div>
    );
}
