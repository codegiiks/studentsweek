import axios from 'axios';
import {
    Loader,
    HourSelector,
    HoursPackSelector,
    CourseTile,
} from 'components';
import { useEffect, useState, useRef } from 'react';
import { message } from 'react-message-popup';
import style from 'styles/components/selectcoursepopup.module.css';

export function CoursesTable({ data, select }) {
    return data ? (
        data.map((v, i) => (
            <CourseTile
                className={style.courseTile}
                key={i}
                data={v}
                onClick={() => select(v)}
            />
        ))
    ) : (
        <Loader space />
    );
}

export function SelectCoursePopup({
    user,
    userInfo,
    visible,
    closeCallback,
    info,
}) {
    const [filtered, setFiltered] = useState(null);
    const [selected, setSelected] = useState(null);
    const courses = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await axios.get('/api/courses', {
                params: {
                    user,
                },
            });
            if (error)
                return message.error(
                    error?.response?.data || 'Qualcosa è andato storto'
                );

            courses.current = data;
            setFiltered(data);
        };

        setFiltered(null);
        if (visible) fetchData();
    }, [visible, user]);

    const search = async (q) => {
        if (q == '' || !q) return setFiltered(courses.current);
        if (!courses.current) return;

        const Fuse = (await import('fuse.js')).default;
        const fuse = new Fuse(courses.current, {
            keys: ['name', 'emoji', 'desc'],
            findAllMatches: true,
        });
        setFiltered(fuse.search(q).map((v) => v.item));
    };

    // check later
    const subToCourse = async (course, plan) => {
        message.loading('Caricando...', 10000).then(async ({ destory }) => {
            const res = await axios
                .post('/api/sub', {
                    user,
                    course,
                    plan,
                })
                .then((r) => {
                    destory();
                    message.success(r.data);
                })
                .catch((e) => {
                    destory();
                    message.error(e.response.data);
                });

            setSelected(null);
            setFiltered(null);
            closeCallback();
        });
    };

    const getPopupContent = () => {
        if (selected)
            return (
                <>
                    <h4>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            onClick={() => setSelected(null)}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        {selected.name}
                    </h4>
                    <p className={style.desc}>
                        {selected.desc +
                            ". Scegli l'ora in cui vuoi praticare il corso"}
                    </p>
                    {selected.accepts === 1 ? (
                        <HoursPackSelector
                            select={subToCourse}
                            course={selected}
                            userRules={userInfo.rules}
                            className={style.hoursPackSelector}
                            info={info}
                        />
                    ) : (
                        <HourSelector
                            select={subToCourse}
                            course={selected}
                            userRules={userInfo.rules}
                            className={style.hourSelector}
                            info={info}
                        />
                    )}
                </>
            );
        else
            return (
                <>
                    <h4>Corsi Disponibili</h4>
                    <p className={style.desc}>
                        Iscriviti ad uno dei corsi nella lista qui sotto
                    </p>
                    <div className={style.search}>
                        <input
                            type="string"
                            placeholder="Cerca un corso..."
                            onChange={(e) => search(e.target.value)}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <div className={style.coursesWrapper}>
                        <CoursesTable data={filtered} select={setSelected} />
                    </div>
                </>
            );
    };

    return visible ? (
        <div className={style.wrapper}>
            <div
                className={style.closer}
                onClick={() => {
                    closeCallback();
                    setFiltered(null);
                    setSelected(null);
                }}
            />
            <div className={style.popup}>{getPopupContent()}</div>
            <style jsx global>
                {`
                    body {
                        overflow: hidden;
                    }
                `}
            </style>
        </div>
    ) : null;
}
