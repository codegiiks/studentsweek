import supabase from './supabase';
import { parseRules } from './utils';

const N_OF_HOURS = process.env.NEXT_PUBLIC_N_OF_HOURS;

export const getUser = async (access_token) => {
    const { data, error } = await supabase.auth.api.getUser(access_token);
    if (error) throw error.message;

    return data;
};

export const getUserRules = async (email) => {
    const { data, error } = await supabase
        .from('users')
        .select('rules')
        .eq('email', email)
        .limit(1)
        .single();
    if (error) throw error.message;

    return data.rules;
};

export const getAvailableCourses = async (day) => {
    const { data, error } = await supabase
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
    if (error) throw error;

    return data;
};

export const checkUserAndCourseCompatibility = (
    userRule,
    courseRule,
    exact = false
) => {
    if (!exact) return (userRule & courseRule) == 0 ? false : true;
    else return !parseRules(userRule & courseRule)[N_OF_HOURS - exact - 1];
};

export const browseCourses = async (access_token, day) => {
    const { email } = await getUser(access_token);

    const userRules = await getUserRules(email);
    const userRule = userRules[day];

    if (userRule == 0) return [];

    const coursesData = await getAvailableCourses(day);

    if (!Array.isArray(coursesData) || coursesData?.length <= 0) return [];

    const courses = [];

    coursesData.forEach(
        (v) =>
            checkUserAndCourseCompatibility(userRule, v.rules[day]) &&
            courses.push(v)
    );

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

export const getCourse = async (id, selectors = '') => {
    const { data, error } = await supabase
        .from('courses')
        .select(selectors)
        .eq('id', course)
        .limit(1)
        .single();
    if (error) throw error;

    return data;
};

export const subtractHour = (rule, hour) =>
    rule
        ? rule - Math.pow(2, hour)
        : Math.pow(2, N_OF_HOURS) - 1 - Math.pow(2, hour);

export const subCourse = async (access_token, course_id, plan) => {
    const { email } = await getUser(access_token);

    const userRules = await getUserRule(email);

    const { courseRules = rules, courseLimit = limit } = await getCourse(
        course_id,
        'rules, limit'
    );

    plan.forEach((v) => {
        if (
            !checkUserAndCourseCompatibility(
                userRules[v[0]],
                courseRules[v[0]],
                v[1]
            )
        )
            throw {
                message: 'Corso non disponibile',
            };
    });

    const subData = await supabase.from('subs').insert(
        plan.map((v) => ({
            day: v[0],
            hour: v[1],
            user: email,
            course_id,
        }))
    );
    if (subData.error) throw subData.error;

    for (const [day, hour] of plan) {
        userRules[day] = subtractHour(userRules[day], hour);
    }

    const userUpdateData = await supabase
        .from('users')
        .update({
            rules: userRules,
        })
        .match({ email });
    if (userUpdateData.error) throw userUpdateData.error;

    let changed = false;
    for (const [day, hour] of plan) {
        const courseSubs = await getCourseSubs(course_id, day, hour);

        if (courseSubs + 1 >= courseLimit) {
            changed = true;
            courseRules[day] = subtractHour(courseRules[day], hour);
        }
    }

    if (changed) {
        const courseData = await supabase
            .from('courses')
            .update({
                rules: courseRules,
            })
            .match({ id: course_id });
        if (courseData.error) throw courseData.error;
    }

    return {
        message: 'Iscritto con successo.',
    };
};
