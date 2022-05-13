import style from 'styles/components/selectcoursepopup.module.css';

export function SelectCoursePopup({ data, visible, close }) {
    return visible ? (
        <div className={style.wrapper}>
            <div className={style.closer} onClick={close} />
            <div className={style.popup}></div>
        </div>
    ) : null;
}
