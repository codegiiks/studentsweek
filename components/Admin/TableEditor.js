import { Loader } from '../Loader';
import supabase from 'lib/supabase';
import { useState, useRef, useEffect, Fragment } from 'react';
import { message } from 'react-message-popup';

import style from 'styles/components/admin.tableeditor.module.css';

export function Input(props) {
    switch (props.as) {
        case 'textarea':
            return <textarea {...props} />;
        default:
            return <input {...props} />;
    }
}

export function DataPopup({ insert }) {
    return <div className={style.dataPopup}></div>;
}

export function TableRow({ data, update, schema, getId }) {
    const [editing, setEditing] = useState(null);

    const renderValue = (v) => (v.render ? v.render(data) : data[v.id]);

    const changeValue = (id, value) => update(getId(data), { [id]: value });

    return (
        <div className={[style.row, editing && style.editing].join(' ')}>
            {schema.map((v, i) => (
                <div
                    key={i}
                    onClick={() => setEditing(i)}
                    className={editing == i ? style.editing : null}
                >
                    {editing == i && !v.uneditable ? (
                        <Input
                            type={v.type || 'string'}
                            placeholder={v.name}
                            value={renderValue(v)}
                            onChange={(e) => changeValue(v.id, e.target.value)}
                            as={v.as}
                        />
                    ) : (
                        renderValue(v) || 'No Data'
                    )}
                </div>
            ))}
        </div>
    );
}

export function TableEditor({
    schema,
    fetchData,
    getId,
    finder,
    tablename,
    buttons,
}) {
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [query, setQuery] = useState(null);
    const [changeTimeout, setChangeTimeout] = useState(null);
    const dataset = useRef(null);

    useEffect(() => {
        const fetchAndSetDataset = async () => {
            setSelectedDataset((dataset.current = await fetchData()));
        };
        fetchAndSetDataset();
    }, []);

    useEffect(() => {
        updateSelected();
    }, [dataset, query]);

    const search = async (query) => {
        if (!dataset.current) return;
        const Fuse = (await import('fuse.js')).default;
        const fuse = new Fuse(dataset.current, {
            keys: schema.map((v) => v.id),
            findAllMatches: true,
        });
        setSelectedDataset(fuse.search(query).map((v) => v.item));
        console.log(fuse.search(query).map((v) => v.item));
    };

    const updateSelected = async () => {
        if (!query || query == '') return setSelectedDataset(dataset.current);
        // if (searchTimeout.current) clearTimeout(searchTimeout.current);
        // searchTimeout.current = setTimeout(async () => {
        //   await searchTrailhead(query);
        // }, 0);
        await search(query);
    };

    const updateCourse = async (match, value) => {
        const courseIndex = dataset.current.findIndex((v, i) =>
            finder(v, i, match)
        );
        dataset.current[courseIndex] = {
            ...dataset.current[courseIndex],
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
                console.log('Sent!', data);
            }, 3000)
        );
    };

    return selectedDataset ? (
        <>
            <div className={style.topButtons}>
                {buttons && <div className={style.buttons}>{buttons()}</div>}
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
                        {schema.map((v, i) => (
                            <p key={i}>{v.name}</p>
                        ))}
                    </div>
                    {selectedDataset.map((v, i) => (
                        <TableRow
                            data={v}
                            key={i}
                            update={updateCourse}
                            schema={schema}
                            getId={getId}
                        />
                    ))}
                    <div className={style.footer}>
                        {schema.map((v, i) => (
                            <p key={i}>{i == 0 ? 'Total' : ''}</p>
                        ))}
                    </div>
                </div>
            </div>
        </>
    ) : (
        <Loader />
    );
}
