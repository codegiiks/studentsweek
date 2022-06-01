import React, { Suspense, useEffect, useState } from 'react';
import { Auth } from '../auth';
import supabase from 'lib/supabase';
import Head from 'next/head';
import { message } from 'react-message-popup';
import { ErrorPage, Loader } from 'components';

import 'styles/layouts/dashboard.index.module.css';
import { getEmail } from 'lib/utils';

export default function DashboardLayout({ children }) {
    const [session, setSession] = useState('init');
    const [info, setInfo] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    const checkSession = (s) => {
        if (!s) return setSession(null);
        const email = getEmail(s);

        if (/^(.*)@liceoischia.edu.it$/gi.exec(email)) setSession(s);
        else setSession('notAllowed');
    };

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
        checkSession(session);

        fetchInfo();

        supabase.auth.onAuthStateChange((event, session) => {
            if (event == 'SIGNED_IN') checkSession(session);
            else if (event == 'SIGNED_OUT') setSession(false);
        });
    }, []);

    useEffect(() => {
        if (error) message.error(error?.message || 'Some error occurred');
        console.log(error);
    }, [error]);

    const fetchUserInfo = async () => {
        const { data } = await supabase
            .rpc('get_user_info', {
                useremail: session?.user?.email,
            })
            .limit(1)
            .single();

        console.log('userInfo', data);
        if (data) setUserInfo(data);
        else setUserInfo('notGiven');
    };

    useEffect(() => {
        if (session != 'init' && session != 'notAllowed' && session)
            fetchUserInfo();
    }, [session]);

    const logout = () => {
        setUserInfo(null);
        supabase.auth.signOut();
    };

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                session,
                info,
                logout,
                userInfo,
                fetchUserInfo,
            });
        }
        return child;
    });

    if (session == 'init') return <Loader />;
    else if (userInfo == 'notGiven')
        return (
            <ErrorPage
                error={{
                    code: 400,
                    message:
                        'Sembra che tu non possa accedere alla settimana dello studente. Se credi ci sia un errore, contatta il tuo rappresentante',
                }}
                logout={logout}
            />
        );
    else if (session == 'notAllowed')
        return (
            <ErrorPage
                error={{
                    code: 400,
                    message:
                        "Sembra che tu non possa accedere a questo sito. Sei sicuro di aver fatto l'accesso con l' account istituzionale?",
                }}
                logout={logout}
            />
        );
    else if (info && session)
        return (
            <>
                <Head>
                    <title>StudentsWeek - Dashboard</title>
                </Head>
                <Suspense fallback={() => <h2>Waiting</h2>}>
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
