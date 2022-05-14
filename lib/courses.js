import supabase from './supabase';
import { getEmail } from './utils';

const BASE_USER_RULES = '000000';

export const browseCourses = async (day, user) => {
    const userData = await supabase.auth.api.getUser(user);

    const email = getEmail(userData);
    const userSubs = (
        await supabase
            .from('subs')
            .select('hour')
            .eq('user', email)
            .eq('day', day)
    ).data;
    let userRule = 0;

    const N_OF_HOURS = (
        await supabase.from('info').select().eq('id', 'N_OF_HOURS')
    ).data[0].value;

    let BASE_RULE = Math.pow(2, N_OF_HOURS) - 1;

    userSubs.forEach((v) => (userRule += Math.pow(2, v.hour)));

    userRule = BASE_RULE ^ userRule;

    if (userRule == 0) return [];

    const coursesData = await supabase
        .from('courses')
        .select(
            `
            name,
            id,
            rules,
            org (
                name,
                propic
            )`
        )
        .neq(`rules->>${day}`, 0);
    if (coursesData?.error) throw coursesData.error;

    let courses = [];

    coursesData.data.forEach((v, i) => {
        const dayRule = v.rules[day];
        const userAvail = userRule & dayRule;

        if (userAvail != 0) courses.push(v);
    });

    return courses;
};
