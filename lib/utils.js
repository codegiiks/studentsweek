const START_TIME = process.env.NEXT_PUBLIC_START_TIME;

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
