export default function HeroArtwork(props) {
    return (
        <svg
            width={1441}
            height={865}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1441 865"
            {...props}
        >
            <path
                d="M916 565.5C792.831 732.509 253.833 750 0 770v95h1440.5V.5c-114.83 9.5-417.5 12.5-492 118-103.314 146.304 56 327-32.5 447Z"
                fill="url(#a)"
            />
            <defs>
                <linearGradient
                    id="a"
                    x1={720.25}
                    y1={0.5}
                    x2={1262}
                    y2={702.5}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#08E300" />
                    <stop offset={1} stopColor="#069E00" />
                </linearGradient>
            </defs>
        </svg>
    );
}
