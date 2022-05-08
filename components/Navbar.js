import { Link } from './Link';
import LongLogo from 'assets/LongLogo';

import style from 'styles/components/navbar.module.css';

const NAVBAR_LINKS = [
    {
        title: 'Contattaci',
        href: '#contact',
        scrollTo: true,
    },
    {
        title: 'Chi siamo',
        href: '#about',
        scrollTo: true,
    },
];

export function Navbar({ className }) {
    return (
        <nav className={[style.wrapper, className].join(' ')}>
            <LongLogo className={style.logo} />
            <div className={style.links}>
                {NAVBAR_LINKS.map((v, i) => (
                    <Link key={i} href={v.href} {...v} className={style.link}>
                        {v.title}
                    </Link>
                ))}
                <Link href="/login" as="button" className={style.loginButton}>
                    Login
                </Link>
            </div>
        </nav>
    );
}
