export function Loader({ visible }) {
    return visible ? <div>Caricando</div> : null;
}

Loader.defaultProps = {
    visible: true,
};
