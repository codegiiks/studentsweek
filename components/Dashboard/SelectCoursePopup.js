import axios from 'axios';
import { useEffect, useState } from 'react';
import { message } from 'react-message-popup';
import style from 'styles/components/selectcoursepopup.module.css';

export function CoursesTable({ data }) {
    return (
        <table className={style.coursesTable}>
            <thead>
                <th>Nome</th>
                <th>Organizzatore</th>
                <th>Aula</th>
                <th></th>
            </thead>
            {data &&
                data.map((v, i) => (
                    <tr key={i}>
                        <td>{v.name}</td>
                        <td>{v.name}</td>
                    </tr>
                ))}
        </table>
    );
}

export function SelectCoursePopup({ data, visible, close }) {
    const [avaliableCourses, setAvaliableCourses] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedData = await axios
                .get('/api/courses', {
                    params: data,
                })
                .then((r) => r.data)
                .catch((e) => message.error(e?.response?.data));

            setAvaliableCourses(fetchedData);
            console.log(fetchedData);
        };

        if (visible) fetchData();
    }, [data]);

    return visible ? (
        <div className={style.wrapper}>
            <div className={style.closer} onClick={close} />
            <div className={style.popup}>
                <h4>Corsi Disponibili</h4>
                <CoursesTable data={avaliableCourses} />
            </div>
        </div>
    ) : null;
}
