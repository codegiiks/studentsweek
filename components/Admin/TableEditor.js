// import { Loader } from '../Loader';
import supabase from 'lib/supabase';
import React, { useState, useRef, useEffect, Fragment } from 'react';
import { message } from 'react-message-popup';

import style from 'styles/components/admin.tableeditor.module.css';

// eslint-disable-next-line react/display-name
const Input = React.forwardRef((props, ref) => {
    switch (props.as) {
        case 'textarea':
            return <textarea {...props} ref={ref} />;
        default:
            return <input {...props} ref={ref} />;
    }
});

export function DataPopup({ insert }) {
    return <div className={style.dataPopup}></div>;
}

export function TableRow({ data, update, schema, getId }) {
    const [editing, setEditing] = useState(null);
    const inputEl = useRef(null);
    const editingRef = useRef(null);

    useEffect(() => {
        const checkOutsideClick = (e) => {
            if (
                editingRef.current &&
                inputEl.current != e.target &&
                e.target.getAttribute('data-ignore-click') != 'true'
            )
                setEditing(null);
        };

        if (document) document.addEventListener('click', checkOutsideClick);

        return () => {
            document.removeEventListener('click', checkOutsideClick);
        };
    }, []);

    useEffect(() => {
        if (!editing) inputEl.current = null;
        editingRef.current = editing;
    }, [editing]);

    const renderValue = (id, v) => (v.render ? v.render(data) : data[id]);

    const changeValue = (id, v) => update(getId(data), { [id]: v });

    return (
        <div className={[style.row, editing && style.editing].join(' ')}>
            {Object.entries(schema.properties).map(([id, v]) => (
                <div
                    key={id}
                    onClick={() => setEditing(id)}
                    className={editing == id ? style.editing : null}
                    data-ignore-click="true"
                >
                    {editing == id && !v.uneditable ? (
                        <Input
                            type={v.type || 'string'}
                            placeholder={v.name}
                            value={renderValue(id, v)}
                            onChange={(e) => changeValue(id, e.target.value)}
                            as={v.as}
                            ref={inputEl}
                            {...v.options}
                        />
                    ) : (
                        renderValue(id, v) || 'No Data'
                    )}
                </div>
            ))}
        </div>
    );
}

export function TableEditor({
    data,
    schema,
    getId,
    finder,
    tablename,
    buttons,
}) {
    const [query, setQuery] = useState('');
    const [filtered, setFiltered] = useState(null);
    const [changeTimeout, setChangeTimeout] = useState(null);

    useEffect(() => {
        if (!data) return;
        setFiltered(data);
    }, [data]);

    useEffect(() => {
        updateSelected();
    }, [filtered, query]);

    const search = async (query) => {
        if (!data) return;
        const Fuse = (await import('fuse.js')).default;
        const fuse = new Fuse(data, {
            keys: Object.keys(schema.properties),
            findAllMatches: true,
        });
        setFiltered(fuse.search(query).map((v) => v.item));
    };

    const updateSelected = async () => {
        if (!query || query == '') return setFiltered(data);
        // if (searchTimeout.current) clearTimeout(searchTimeout.current);
        // searchTimeout.current = setTimeout(async () => {
        //   await searchTrailhead(query);
        // }, 0);
        await search(query);
    };

    const updateCourse = async (match, value) => {
        const courseIndex = filtered.findIndex((v, i) => finder(v, i, match));
        filtered[courseIndex] = {
            ...filtered[courseIndex],
            ...value,
        };
        updateSelected();

        if (changeTimeout) clearTimeout(changeTimeout);

        setChangeTimeout(
            setTimeout(async () => {
                const { data, error } = await supabase
                    .from(tablename)
                    .update(value)
                    .match(match);

                if (error) return message.error(error.message);
                message.success('Cambiamento effettuato');
            }, 3000)
        );
    };

    const { properties } = schema;
    return (
        filtered && (
            <>
                <div className={style.topButtons}>
                    {buttons && (
                        <div className={style.buttons}>{buttons()}</div>
                    )}
                    <div className={style.searchBox}>
                        <input
                            type="string"
                            className={style.searchInput}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            className={style.searchIcon}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
                <div className={style.tableWrapper}>
                    <div className={style.table}>
                        <div className={style.header}>
                            {Object.entries(properties).map(
                                ([key, { label }]) => (
                                    <p key={key}>{label}</p>
                                )
                            )}
                        </div>
                        {filtered.map((v, i) => (
                            <TableRow
                                data={v}
                                key={i}
                                update={updateCourse}
                                schema={schema}
                                getId={getId}
                            />
                        ))}
                        <div className={style.footer}>
                            {Object.values(properties).map((_v, i) => (
                                <p key={i}>{i == 0 ? 'Total' : ''}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        )
    );
}
