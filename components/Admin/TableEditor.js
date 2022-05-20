import { InputElement } from 'components';
import { useEffect, useState } from 'react';
import style from 'styles/components/admin.tableeditor.module.css';

function TableRow({
    element,
    index,
    update,
    properties,
    className,
    buttons,
    ...props
}) {
    return (
        <div className={[style.row, className].join(' ')} {...props}>
            {Object.entries(properties).map(([key, elementProperties]) => (
                <InputElement
                    value={element[key]}
                    className={style.cell}
                    key={`row-${index}-${key}`}
                    schema={elementProperties}
                    onChange={(e) => update(index, key, e.target.value)}
                />
            ))}
            {buttons?.map(({ render }, key) => (
                <div className={style.buttonCell} key={key}>
                    {render()}
                </div>
            ))}
        </div>
    );
}

function TableHeading({ properties, buttons }) {
    return (
        <div className={style.header}>
            {Object.entries(properties).map(([key, { label }]) => (
                <p key={key}>{label}</p>
            ))}
            {buttons?.map(({ label }, key) => (
                <p key={key} className={style.buttonCell}>
                    {label}
                </p>
            ))}
        </div>
    );
}

function SaveStatus({ saving }) {
    return <div>{saving ? 'Salvataggio...' : 'Salvato'}</div>;
}

export function TableEditor({
    data,
    update,
    schema,
    buttons,
    className,
    ...props
}) {
    const [filtered, setFiltered] = useState(data);
    const [requestTimeout, setRequestTimeout] = useState(null);

    useEffect(() => {
        if (data) setFiltered(data);
    }, [data]);

    const updateRow = (index, key, value) => {
        filtered[index] = {
            ...filtered[index],
            [key]: value,
        };
        setFiltered(filtered);

        if (requestTimeout) clearTimeout(requestTimeout);
        setRequestTimeout(
            setTimeout(async () => {
                await update(index, { [key]: value });
                setRequestTimeout(null);
            }, 3000)
        );
    };

    return (
        <>
            <SaveStatus saving={requestTimeout !== null} />
            <div className={style.tableWrapper}>
                <div className={[style.table, className].join(' ')} {...props}>
                    <TableHeading
                        properties={schema.properties}
                        buttons={buttons}
                    />
                    {filtered?.map((el, index) => (
                        <TableRow
                            key={`row-${index}`}
                            element={el}
                            schema={schema}
                            update={updateRow}
                            index={index}
                            properties={schema.properties}
                            buttons={buttons}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
