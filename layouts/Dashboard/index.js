import React, { Suspense, useEffect, useState } from 'react';
import { Auth } from '../auth';
import supabase from 'lib/supabase';
import Head from 'next/head';
import { message } from 'react-message-popup';
import { ErrorPage, IntroPopup, Loader } from 'components';

import 'styles/layouts/dashboard.index.module.css';

export default function DashboardLayout({ children }) {
    const [session, setSession] = useState('init');
    const [info, setInfo] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            const { data } = await supabase.from('info').select();
            if (data) {
                const tinfo = {};
                data.forEach((v, i) => (tinfo[v?.id] = v?.value));
                setInfo(tinfo);
            }
        };

        const session = supabase.auth.session();
        if (session) setSession(session);
        else setSession(null);

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

        if (data?.length == 1) setUserInfo(data[0]);
        else setUserInfo('notGiven');
    };

    useEffect(() => {
        if (session != 'init' && session != 'notAllowed' && session)
            fetchUserInfo();
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

    if (session == 'init') return <Loader />;
    else if (session == 'notAllowed')
        return <ErrorPage error={{ message: 'Non sei autorizzato' }} />;
    else if (info && session)
        return (
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
        );
    else if (!info && session) return <Loader />;
    else return <Auth setError={setError} />;
}
