import style from 'styles/components/admin.searchbox.module.css';
import { useState } from 'react';

export function SearchBox({ searchCallback }) {
    const [changeTimeout, setChangeTimeout] = useState(null);

    const search = (query) => {
        if (changeTimeout) clearTimeout(changeTimeout);

        setChangeTimeout(
            setTimeout(async () => {
                await searchCallback(query);
            }, 1000)
        );
    };

    return (
        <div className={style.searchBox}>
            <input
                type="string"
                className={style.searchInput}
                onChange={(e) => search(e.target.value)}
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
    );
}
