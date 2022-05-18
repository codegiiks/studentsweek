import axios from 'axios';
import { Loader, HourSelector, CourseTile } from 'components';
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

export function SelectCoursePopup({ data, visible, close }) {
    const [selectedCourses, setSelectedCourses] = useState(null);
    const [selected, setSelected] = useState(null);
    const [userAvail, setUserAvail] = useState(null);
    const [query, setQuery] = useState(null);
    const courses = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await axios
                .get('/api/courses', {
                    params: data,
                })
                .then((r) => r.data)
                .catch((e) => message.error(e?.response?.data));

            courses.current = fetchedData.courses;
            console.log(fetchedData);
            setSelectedCourses(fetchedData.courses);
            setUserAvail(fetchedData.userRule);
        };

        setSelectedCourses(null);
        if (visible) fetchData();
    }, [data]);

    useEffect(() => {
        const search = async (q) => {
            const Fuse = (await import('fuse.js')).default;
            const fuse = new Fuse(courses.current, {
                keys: ['name', 'emoji', 'desc'],
                findAllMatches: true,
            });
            setSelectedCourses(fuse.search(q).map((v) => v.item));
        };

        if (query == '' || !query) return setSelectedCourses(courses.current);
        if (!courses.current) return;

        search(query);
    }, [query]);

    const subToCourse = async (hour) => {
        try {
            const fetchedData = await axios
                .post('/api/sub', {
                    ...data,
                    hour,
                    course: selected.id,
                })
                .then((r) => r.data);

            if (!fetchedData) return;

            message.success(fetchedData);
        } catch (e) {
            message.error(e.response.data);
        }

        setSelected(null);
        setSelectedCourses(null);
        close();
    };

    const getPopupContent = () => {
        if (selected)
            return (
                <>
                    <h4>{selected.name}</h4>
                    <p className={style.desc}>
                        {selected.desc +
                            ". Scegli l'ora in cui vuoi praticare il corso"}
                    </p>
                    <HourSelector
                        select={subToCourse}
                        rules={selected.rules[data.day] & userAvail}
                        className={style.hourSelector}
                    />
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
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
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
                        <CoursesTable
                            data={selectedCourses}
                            select={setSelected}
                        />
                    </div>
                </>
            );
    };

    return visible ? (
        <div className={style.wrapper}>
            <div
                className={style.closer}
                onClick={() => {
                    close();
                    setSelectedCourses(null);
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
