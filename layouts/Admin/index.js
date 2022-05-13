import React, { useEffect, useState } from 'react';
import { Auth } from './auth';
import supabase from 'lib/supabase';
import Head from 'next/head';
import { message } from 'react-message-popup';

export function AdminLayout({ children }) {
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const session = supabase.auth.session();
        if (session) setSession(session);

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
            return React.cloneElement(child, { session });
        }
        return child;
    });

    return session ? (
        <>
            <Head>
                <title>Barriere Architettoniche - Admin</title>
            </Head>
            <div className="bg-black flex px-2 text-white font-sans font-medium text-sm py-1 fixed top-0 left-0 right-0">
                <div>
                    <p>Loggato come {session.user.email}</p>
                </div>
                <div className="ml-auto">
                    <button
                        className="bg-red-500 px-2 rounded-sm"
                        onClick={() => logout()}
                    >
                        Log out
                    </button>
                </div>
            </div>
            {childrenWithProps}
        </>
    ) : (
        <Auth setError={setError} />
    );
}
