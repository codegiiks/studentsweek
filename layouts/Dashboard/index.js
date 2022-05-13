import React, { Suspense, useEffect, useState } from 'react';
import { Auth } from './auth';
import supabase from 'lib/supabase';
import Head from 'next/head';
import { message } from 'react-message-popup';

import 'styles/layouts/dashboard.index.module.css';

export default function DashboardLayout({ children }) {
    const [session, setSession] = useState(null);
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            const info_db = await supabase.from('info').select();
            if (info_db) {
                const tinfo = {};
                info_db.body.forEach((v, i) => (tinfo[v?.id] = v?.value));
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
