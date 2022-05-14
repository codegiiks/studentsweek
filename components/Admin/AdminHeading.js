export function AdminHeading({ children, desc, as }) {
    return (
        <>
            <as className="font-semibold font-sans text-2xl md:text-3xl">
                {children}
            </as>
            {desc && <p className="opacity-60 my-1">{desc}</p>}
        </>
    );
}

AdminHeading.defaultProps = {
    as: 'h2',
};
