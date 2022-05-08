import { useRouter } from 'next/router';

import style from 'styles/components/link.module.css';

export function Link({
    href,
    scrollTo,
    children,
    as,
    block,
    behavior,
    className,
    ...props
}) {
    const router = useRouter();
    const Element = as;

    const goTo = () => {
        if (scrollTo) {
            try {
                document.querySelector(href).scrollIntoView({
                    behavior,
                    block,
                });
            } catch (e) {
                console.log(e);
            }
            window.history.pushState(href, '', href);
        } else router.push(href);
    };

    return (
        <Element
            onClick={goTo}
            className={[style.link, className].join(' ')}
            {...props}
        >
            {children}
        </Element>
    );
}

Link.defaultProps = {
    block: 'center',
    behavior: 'smooth',
    as: 'a',
};
