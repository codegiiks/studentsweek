import { Navbar } from 'components';
import style from 'styles/layouts/main.module.css';

export default function Main({ children, navbarClassname }) {
    return (
        <main className={style.wrapper}>
            <Navbar className={navbarClassname} />
            {children}
        </main>
    );
}
