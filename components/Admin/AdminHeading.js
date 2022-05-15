export function AdminHeading({ children, desc, as }) {
    return (
        <>
            <h2 className="font-semibold font-sans text-2xl md:text-3xl capitalize">
                {children}
            </h2>
            {desc && <p className="opacity-60 my-1">{desc}</p>}
        </>
    );
}

AdminHeading.defaultProps = {
    as: 'h2',
};
