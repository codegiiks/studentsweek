import { Hero } from 'components';
import Main from 'layouts/Main';

import style from 'styles/pages/index.module.css';

export default function Home() {
    return (
        <>
            <Hero />
        </>
    );
}

Home.getLayout = (page) => <Main navbarClassname={style.navbar}>{page}</Main>;
