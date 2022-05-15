import style from 'styles/components/loader.module.css';

export function Loader({ visible, space }) {
    return visible ? (
        <div className={[style.wrapper, space ? style.space : null].join(' ')}>
            <div className={style.loader}>
                <div />
                <div />
                <div />
            </div>
        </div>
    ) : null;
}

Loader.defaultProps = {
    visible: true,
};
