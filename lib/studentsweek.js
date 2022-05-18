import supabase from './supabase';
import { getEmail, parseRules } from './utils';

const N_OF_HOURS = process.env.NEXT_PUBLIC_N_OF_HOURS;

export const getUserRule = async (email, day) => {
    const { data, error } = await supabase
        .from('users')
        .select('rules')
        .eq('email', email)
        .limit(1)
        .single();
    const userRule = data.rules[day];
    if (error) throw error.message;

    return {
        rules: data.rules,
        userRule: userRule,
    };
};

export const browseCourses = async (day, user) => {
    const userData = await supabase.auth.api.getUser(user);
    if (userData.error) throw userData.error.message;

    const email = getEmail(userData);

    const { userRule } = await getUserRule(email, day);

    if (userRule == 0) return [];

    const coursesData = await supabase
        .from('courses')
        .select(
            `
            name,
            id,
            rules,
            desc,
            emoji,
            org (
                name,
                propic
            )`
        )
        .neq(`rules->>${day}`, 0);
    if (coursesData?.error) throw coursesData.error;

    const courses = [];

    coursesData.data.forEach((v, i) => {
        const dayRule = v.rules[day];
        const userAvail = userRule & dayRule;

        if (userAvail != 0) courses.push(v);
    });

    return {
        courses,
        userRule,
    };
};

export const getCourseSubs = async (id, day, hour) => {
    const { count } = await supabase
        .from('subs')
        .select('user', { count: 'exact', head: true })
        .eq('day', day)
        .eq('hour', hour)
        .eq('course_id', id);

    return count;
};

export const subCourse = async ({ day, hour, user, course }) => {
    const userData = await supabase.auth.api.getUser(user);
    if (userData.error) throw userData.error.message;

    const email = getEmail(userData);

    const { rules, userRule } = await getUserRule(email, day);

    const { data, error } = await supabase
        .from('courses')
        .select('rules, limit')
        .eq('id', course)
        .limit(1)
        .single();
    if (error) throw error.message;
    const courseRule = data.rules[day];

    if (!parseRules(userRule & courseRule)[N_OF_HOURS - hour - 1])
        throw 'Corso non disponibile';

    const subData = await supabase.from('subs').insert({
        user: email,
        day,
        hour,
        course_id: course,
    });
    if (subData.error) throw subData.error.message;

    const courseSubs = await getCourseSubs(course, day, hour);

    if (courseSubs + 1 >= data.limit) {
        data.rules[day] = data.rules[day]
            ? data.rules[day] - Math.pow(2, hour)
            : Math.pow(2, N_OF_HOURS) - 1 - Math.pow(2, hour);

        const courseData = await supabase
            .from('courses')
            .update({
                rules: data.rules,
            })
            .match({ id: course });
        if (courseData.error) throw courseData.error.message;
    }

    rules[day] = rules[day]
        ? rules[day] - Math.pow(2, hour)
        : Math.pow(2, N_OF_HOURS) - 1 - Math.pow(2, hour);

    const userUpdateData = await supabase
        .from('users')
        .update({
            rules,
        })
        .match({ email });
    if (userUpdateData.error) throw userUpdateData.error.message;

    return 'Ti sei iscritto con successo';
};
