import { useState } from 'react';

import style from 'styles/components/admin.createpopup.module.css';

export function CreatePopup({
    initialData,
    insert,
    visible,
    close,
    schema,
    name,
}) {
    const [data, setData] = useState(initialData);

    return (
        visible && (
            <div className={style.wrapper}>
                <div className={style.closer} onClick={close} />
                <div className={style.popup}>
                    <h3>{name}</h3>
                </div>
            </div>
        )
    );
}
