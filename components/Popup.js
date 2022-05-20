import style from 'styles/components/popup.module.css';

export function Popup({ close, visible, children, ...props }) {
    return visible ? (
        <div className={style.wrapper} {...props}>
            <div className={style.closer} onClick={close} />
            <div className={style.popup}>{children}</div>
        </div>
    ) : null;
}
