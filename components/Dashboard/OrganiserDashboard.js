import { CourseTile } from 'components/CourseTile';
import { Loader } from 'components/Loader';
import supabase from 'lib/supabase';
import { useState, useEffect, useRef } from 'react';
import { message } from 'react-message-popup';
import style from 'styles/components/organiserdash.module.css';

export function OrganiserDashboard({ user, info, className, ...props }) {
    const [course, setCourse] = useState(null);
    const [day, setDay] = useState(null);
    const [hour, setHour] = useState(null);
    const [subs, setSubs] = useState(null);
    const allSubs = useRef(null);
    const chartEl = useRef(null);

    const parseDataSubs = () => {
        if (!allSubs.current) return [];

        const todaySubs = allSubs.current.filter((v) => v.day == day);
        const hourPresence = Array.from({ length: info.N_OF_HOURS }).fill(0);
        const hourAbsence = Array.from({ length: info.N_OF_HOURS }).fill(0);

        todaySubs.forEach((v) =>
            v.presence ? hourPresence[v.hour]++ : hourAbsence[v.hour]++
        );

        return [
            {
                name: 'Presenti',
                type: 'bar',
                values: hourPresence,
            },
            {
                name: 'Assenti',
                type: 'bar',
                values: hourAbsence,
            },
        ];
    };

    useEffect(() => {
        const fetchSubs = async () => {
            const { data, error } = await supabase.rpc('get_course_subs', {
                input_course_id: course.id,
            });
            if (error) return message.error(error.message);

            allSubs.current = data;
            setSubs(data.filter((v) => v.hour === hour && v.day === day));
        };

        if (course && day !== null && hour !== null && subs === null)
            fetchSubs();
        else if (subs !== null)
            setSubs(
                allSubs.current.filter((v) => v.hour === hour && v.day === day)
            );
    }, [day, hour]);

    // useEffect(() => {
    //     let chart;
    //     if (chartEl.current && allSubs.current) {
    //         const data = {
    //             labels: Array.from({ length: info.N_OF_HOURS }).map(
    //                 (_, i) => CONVERT[i]
    //             ),
    //             datasets: parseDataSubs(),
    //         };
    //
    //         chart = new Chart(chartEl.current, {
    //             title: 'Presenze della Giornata',
    //             data: data,
    //             type: 'bar', // or 'bar', 'line', 'scatter', 'pie', 'percentage'
    //             height: 250,
    //             colors: ['#7cd6fd', '#743ee2'],
    //             barOptions: {
    //                 stacked: 1,
    //             },
    //         });
    //     }
    //
    //     return () => chart && chart.destroy();
    // }, [allSubs, chartEl, info]);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .rpc('get_user_course', {
                    useremail: user.email,
                })
                .limit(1)
                .single();
            if (error) return message.error(error.message);

            setCourse(data);

            const today = new Date();
            const start_time = new Date(info.HOUR_OF_START);
            const deltaDay = parseInt(
                (today - start_time) / (60 * 60 * 24 * 1000)
            );
            const deltaHour =
                parseInt((today - start_time) / (60 * 60 * 1000)) -
                24 * deltaDay;
            console.log(deltaDay, deltaHour);

            setDay(deltaDay);
            setHour(deltaHour);
        };

        if (!course) fetchData();
    }, []);

    const changePresence = async (i) => {
        const { data, error } = await supabase
            .from('subs')
            .update({
                presence: !subs[i].presence,
            })
            .match({
                user: subs[i].email,
                day: subs[i].day,
                hour: subs[i].hour,
            });
        if (error) return message.error(error.message);

        const newSub = {
            ...subs[i],
            presence: !subs[i].presence,
        };
        subs[i] = newSub;

        setSubs([...subs]);
    };

    const prevHour = () => {
        if (hour - 1 < 0) {
            setDay(day - 1 < 0 ? 0 : day - 1);
            setHour(parseInt(info.N_OF_HOURS - 1));
        } else {
            setHour(hour - 1);
        }
    };

    const nextHour = () => {
        if (hour + 1 >= info.N_OF_HOURS) {
            setHour(0);
            setDay((day + 1) % info.N_OF_DAYS);
        } else {
            setHour(hour + 1);
        }
    };

    return course ? (
        <div className={style.wrapper}>
            <h3>Gestisci il tuo corso</h3>
            <CourseTile data={course} />
            {day < 0 ? (
                <div className={style.notStarted}>
                    <h4>La settimana dello studente non è ancora iniziata</h4>
                </div>
            ) : (
                <div className={style.presences}>
                    <h3>Elenco Presenze</h3>
                    <div className={style.topButtons}>
                        <p className={style.desc}>
                            {subs?.length} persone iscritte
                        </p>
                        <button
                            className="classic-rounded"
                            onClick={() => prevHour()}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                        </button>
                        <div className="classic-rounded">
                            Giorno {day + 1} - Ora {hour + 1}
                        </div>
                        <button
                            className="classic-rounded"
                            onClick={() => nextHour()}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </button>
                    </div>
                    {subs?.map((v, i) => (
                        <div className={style.row} key={i}>
                            <p>{v.name}</p>
                            <span className={style.class}>{v.class}</span>
                            <button
                                className={[
                                    v.presence ? style.present : style.absent,
                                    style.button,
                                ].join(' ')}
                                onClick={() => changePresence(i)}
                            >
                                {v.presence == true ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    ) : (
        <Loader />
    );
}
