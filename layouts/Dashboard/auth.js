import { useState } from 'react';
import supabase from 'lib/supabase';

import style from 'styles/layouts/dashboard.auth.module.css';
import Head from 'next/head';

export function Auth({ setError }) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (email, password) => {
        try {
            setLoading(true);
            const { user, session, error } = await supabase.auth.signIn(
                {
                    provider: 'google',
                },
                {
                    redirectTo: window
                        ? window.location.href
                        : process.env.NEXT_PUBLIC_HOST_URL,
                }
            );
            if (error) throw error;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (email, password) => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            alert('Check your inbox to verify your email');
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={style.auth_wrapper}>
            <Head>
                <title>StudentsWeek - Login</title>
            </Head>
            <div className={style.auth_box}>
                <h1 className={style.header}>Accesso</h1>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleLogin(email, password);
                    }}
                    className={style.button}
                    disabled={loading}
                >
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <title>{'Google'}</title>
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                    {loading ? 'Loading' : 'Accedi con Google'}
                </button>
            </div>
        </div>
    );
}
