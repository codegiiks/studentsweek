const START_TIME = process.env.NEXT_PUBLIC_START_TIME;
const DAY_NAMES = [
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
    'Domenica',
];

export const getDayName = (i, day_of_start = START_TIME) =>
    DAY_NAMES[(new Date(day_of_start).getDay() + i - 1) % 7];

export const getIdentity = (session) => {
    if (!session) return undefined;
    if (session?.user?.identities?.length != 0)
        return {
            id: session.user.identities[0].id,
            ...session.user.identities[0].identity_data,
        };
};

export const getFullName = (session) =>
    getIdentity(session) ? getIdentity(session).full_name : null;

export const getPropic = (session) =>
    getIdentity(session) ? getIdentity(session)?.avatar_url : null;

export const getEmail = (session) => session?.user?.email;

export const getAccessToken = (session) => session?.access_token;

export const parseRules = (code) => {
    let bin = code.toString(2);
    bin = '00000'.substr(bin.length) + bin;

    return bin.split('').map((v) => v == '1');
};

export const getByHoursDiff = (diff, date = new Date(START_TIME)) => {
    date.setTime(date.getTime() + diff * 60 * 60 * 1000);

    return `${date.getHours()}:${date.getMinutes()}`;
};

export const generateColor = (string) => {
    function hashCode(str) {
        const hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    function intToRGB(i) {
        const c = (i & 0x00ffffff).toString(16).toUpperCase();

        return '00000'.substring(0, 6 - c.length) + c;
    }

    return `#${intToRGB(hashCode(string))}`;
};
