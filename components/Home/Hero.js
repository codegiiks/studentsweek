import HeroArtwork from 'assets/HeroArtwork';
import style from 'styles/components/hero.module.css';

export function Hero() {
    return (
        <section id="hero" className={style.wrapper}>
            <div className={style.left}>
                <h3>
                    Organizza la tua settimana dello studente con un semplice
                    click!
                    <span>Provalo Ora »</span>
                </h3>
            </div>
            <div className={style.right}></div>
            <HeroArtwork className={style.artwork} />
        </section>
    );
}
