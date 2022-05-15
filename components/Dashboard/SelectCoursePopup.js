import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { message } from 'react-message-popup';
import style from 'styles/components/selectcoursepopup.module.css';
import { CourseTile } from '../CourseTile';

export function CoursesTable({ data }) {
    return data
        ? data.map((v, i) => (
              <CourseTile className={style.courseTile} key={i} data={v} />
          ))
        : null;
}

export function SelectCoursePopup({ data, visible, close }) {
    const [selectedCourses, setSelectedCourses] = useState(null);
    const [query, setQuery] = useState(null);
    const courses = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const cc = Array.from({ length: 10 }).map((v, i) => ({
                name: 'Ciao',
                emoji: '✌🏻',
                org: {
                    name: 'Cocco',
                },
                desc: 'Ciaooooooo',
            }));
            setSelectedCourses(cc);
            courses.current = cc;
            return;

            const fetchedData = await axios
                .get('/api/courses', {
                    params: data,
                })
                .then((r) => r.data)
                .catch((e) => message.error(e?.response?.data));

            courses.current = fetchedData;
            setSelectedCourses(fetchedData);
        };

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

    return visible ? (
        <div className={style.wrapper}>
            <div className={style.closer} onClick={close} />
            <div className={style.popup}>
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
                    <CoursesTable data={selectedCourses} />
                </div>
            </div>
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
