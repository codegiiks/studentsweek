export function InputElement(props) {
    switch (props.schema.type) {
        case 'enum':
            return (
                <select {...props}>
                    {Object.entries(props.schema.enumOptions).map(
                        ([key, value]) => (
                            <option key={`option-${key}`} value={key}>
                                {value}
                            </option>
                        )
                    )}
                </select>
            );
        case 'number':
            return (
                <input
                    {...props}
                    min={props.schema.min}
                    max={props.schema.max}
                    type="number"
                />
            );
        default:
            return <input {...props} type={props.schema.type} />;
    }
}

InputElement.defaultProps = {
    schema: {
        type: 'string',
    },
};
