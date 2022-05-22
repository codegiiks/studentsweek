import { Link } from './Link';
import Logo from 'assets/Logo';

import style from 'styles/components/navbar.module.css';

const NAVBAR_LINKS = [];

export function Navbar({ className }) {
    return (
        <nav className={[style.wrapper, className].join(' ')}>
            <div className={style.logo}>
                <Logo />
                <h1>StudentsWeek</h1>
            </div>

            <div className={style.links}>
                {NAVBAR_LINKS.map((v, i) => (
                    <Link key={i} href={v.href} {...v} className={style.link}>
                        {v.title}
                    </Link>
                ))}
                <Link href="/login" as="button" className={style.loginButton}>
                    Accedi
                </Link>
            </div>
        </nav>
    );
}
