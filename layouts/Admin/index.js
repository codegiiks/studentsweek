import React, { useEffect, useState } from 'react';
import { Auth } from '../auth';
import supabase from 'lib/supabase';
import Head from 'next/head';
import { message } from 'react-message-popup';
import style from 'styles/layouts/admin.index.module.css';
import { ErrorPage, Link, Loader } from 'components';
import { getEmail } from 'lib/utils';

const SIDEBAR_LINKS = [
    {
        href: '/admin',
        name: 'Home',
        icon: (
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
            </svg>
        ),
    },
    {
        href: '/admin/courses',
        name: 'Courses',
        icon: (
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
            </svg>
        ),
    },
    {
        href: '/admin/users',
        name: 'Users',
        icon: (
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
        ),
    },
    {
        href: '/admin/config',
        name: 'Configuration',
        icon: (
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
            </svg>
        ),
    },
];

export function Sidebar({}) {
    return (
        <div className={style.sidebar}>
            {SIDEBAR_LINKS.map((v, i) => (
                <Link
                    href={v.href}
                    className={style.sidebarLink}
                    key={i}
                    as="div"
                >
                    {v.icon}
                    <span className={style.name}>{v.name}</span>
                </Link>
            ))}
        </div>
    );
}

export function AdminLayout({ children }) {
    const [session, setSession] = useState('init');
    const [error, setError] = useState(null);

    const checkSession = async (s) => {
        if (!s) return setSession(null);
        if (s?.user?.email) {
            const userData = await supabase
                .from('users')
                .select('role')
                .eq('email', s?.user?.email);
            if (userData?.data?.length > 0 && userData.data[0]?.role == 'admin')
                setSession(s);
            else setSession('notAllowed');
        } else setSession(false);
    };

    useEffect(() => {
        const session = supabase.auth.session();
        checkSession(session);

        supabase.auth.onAuthStateChange((event, session) => {
            if (event == 'SIGNED_IN') checkSession(session);
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

    if (session == 'notAllowed')
        return <ErrorPage error={{ message: 'Non sei un admin' }} />;
    else if (session == 'init') {
        return <Loader />;
    } else if (session)
        return (
            <>
                <Head>
                    <title>StudentsWeek - Admin</title>
                </Head>
                <div className="bg-black flex px-2 text-white font-sans font-medium text-sm py-1 sticky top-0 left-0 right-0">
                    <div>
                        <p>Loggato come {getEmail(session)}</p>
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
                <div className={style.adminLayout}>
                    <Sidebar />
                    <div className={style.content}>{childrenWithProps}</div>
                </div>
                <style jsx global>{`
                    html {
                        scroll-top-padding: calc(1.75rem);
                    }
                `}</style>
            </>
        );
    else return <Auth setError={setError} />;
}
