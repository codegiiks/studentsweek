import { Link } from 'components/Link';
import style from 'styles/components/hero.module.css';

export function Hero() {
    return (
        <section id="hero" className={style.wrapper}>
            <div className={style.left}>
                <h3 className={style.heroType}>
                    Organizza la tua <br />
                    settimana dello studente <br />
                    con un semplice click!
                    <div className={style.buttonsWrapper}>
                        <Link href="/login">
                            <span>Accedi</span>
                        </Link>
                    </div>
                </h3>
            </div>
            <div className={style.heroPic}></div>
            <div className={style.right}></div>
        </section>
    );
}
