import supabase from 'lib/supabase';
import { Fragment, useEffect, useState } from 'react';
import { getAccessToken, getEmail, getFullName, getPropic } from 'lib/utils';
import DashboardLayout from 'layouts/Dashboard';

import style from 'styles/pages/dash.module.css';
import { CourseTile, NoCard, SelectCoursePopup } from 'components';

const DAY_NAMES = [
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
    'Domenica',
];

export function CoursesList({ openSelector, data, info }) {
    return (
        <>
            {data &&
                data.map((v, i) => (
                    <CourseTile data={v} key={i} className={style.courseTile} />
                ))}
            {data?.length != info.N_OF_HOURS && (
                <NoCard onClick={openSelector} />
            )}
        </>
    );
}

export default function Dashboard({ session, info, logout }) {
    const [selectorData, setSelectorData] = useState(null);
    const [subs, setSubs] = useState({});
    const getDayName = (i) =>
        DAY_NAMES[(new Date(info.DAY_OF_START).getDay() + i - 1) % 7];

    const openSelector = (i) =>
        setSelectorData({
            day: i,
            user: getAccessToken(session),
        });

    const closeSelector = () => {
        setSelectorData(null);
        fetchSubs();
    };

    const fetchSubs = async () => {
        const { data, error } = await supabase
            .rpc('get_user_subs', {
                inputemail: getEmail(session),
            })
            .order('hour');
        if (error) return message.error(error.message);
        console.log(data);

        let parsed = {};

        data.forEach((v) =>
            parsed[v.day] ? parsed[v.day].push(v) : (parsed[v.day] = [v])
        );

        setSubs(parsed);
    };

    useEffect(() => {
        if (session) fetchSubs();
    }, []);

    return info && session ? (
        <>
            <SelectCoursePopup
                visible={selectorData != null}
                data={selectorData}
                close={closeSelector}
            />
            <main className={style.spacer}>
                <div className={style.wrapper}>
                    <h2>
                        <img
                            className={style.propic}
                            src={getPropic(session)}
                        />
                        Hey {getFullName(session)}{' '}
                        <button onClick={logout} className={style.logoutButton}>
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
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                        </button>
                    </h2>
                    <p className={style.intro}>{info.INTRO_DESC}</p>
                    {Array.from({ length: info.N_OF_DAYS }).map((v, i) => (
                        <Fragment key={i}>
                            {console.log(i, subs[i])}
                            <h3>{getDayName(i)}</h3>
                            <CoursesList
                                openSelector={() => openSelector(i)}
                                data={subs[i]}
                                info={info}
                            />
                        </Fragment>
                    ))}
                </div>
            </main>
        </>
    ) : undefined;
}

Dashboard.getLayout = (page) => {
    return <DashboardLayout>{page}</DashboardLayout>;
};
