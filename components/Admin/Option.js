import { InputElement } from 'components';

export function Option({ data, update, schema, title, desc }) {
    return data ? (
        <div>
            <p>{title}</p>
            {desc && <p>{desc}</p>}
            <InputElement
                onChange={(e) => update(e.target.value)}
                value={data}
                schema={schema}
            />
        </div>
    ) : null;
}
