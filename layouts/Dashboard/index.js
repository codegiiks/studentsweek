import React, { Suspense, useEffect, useState } from 'react';
import { Auth } from './auth';
import supabase from 'lib/supabase';
import Head from 'next/head';
import { message } from 'react-message-popup';
import { IntroPopup } from 'components';

import 'styles/layouts/dashboard.index.module.css';

export default function DashboardLayout({ children }) {
    const [session, setSession] = useState(null);
    const [info, setInfo] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            const { data } = await supabase.from('info').select();
            if (data) {
                const tinfo = {};
                console.log(data);
                data.forEach((v, i) => (tinfo[v?.id] = v?.value));
                setInfo(tinfo);
            }
        };

        const session = supabase.auth.session();
        if (session) setSession(session);

        fetchInfo();

        supabase.auth.onAuthStateChange((event, session) => {
            if (event == 'SIGNED_IN') setSession(session);
            else if (event == 'SIGNED_OUT') setSession(false);
        });
    }, []);

    useEffect(() => {
        if (error) message.error(error?.message || 'Some error occurred');
        console.log(error);
    }, [error]);

    const fetchUserInfo = async () => {
        const { data } = await supabase
            .from('users')
            .select()
            .eq('email', session?.user?.email);

        console.log(data);
        if (data?.length == 1) setUserInfo(data[0]);
        else setUserInfo('notGiven');
    };

    useEffect(() => {
        if (session) fetchUserInfo();
    }, [session]);

    const logout = () => {
        supabase.auth.signOut();
    };

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { session, info, logout });
        }
        return child;
    });

    return session ? (
        <>
            <Head>
                <title>StudentsWeek - Dashboard</title>
            </Head>
            <Suspense fallback={() => <h2>Waiting</h2>}>
                <IntroPopup
                    visible={userInfo == 'notGiven'}
                    close={(data) => setUserInfo(data)}
                    classes={info?.CLASSES}
                    session={session}
                />
                {childrenWithProps}
            </Suspense>
            <style jsx global>{`
                html {
                    scroll-padding-top: 20px;
                }
            `}</style>
        </>
    ) : (
        <Auth setError={setError} />
    );
}
