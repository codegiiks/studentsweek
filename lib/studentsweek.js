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
        .rpc('get_user_info', {
            useremail: email,
        })
        .limit(1)
        .single();
    if (error) throw error.message;

    return data.rules;
};

export const getAvailableCourses = async () => {
    const { data, error } = await supabase.rpc('browse_courses');
    if (error) throw error;

    return data;
};

export const checkUserAndCourseCompatibility = (
    userRule,
    courseRule,
    exact = false
) => {
    if (exact == false && exact != 0)
        return (userRule & courseRule) == 0 ? false : true;
    return parseRules(userRule & courseRule)[N_OF_HOURS - exact - 1];
};

export const browseCourses = async (access_token) => {
    const { email } = await getUser(access_token);

    const userRules = await getUserRules(email);

    if (userRules.every((v) => v == 0)) return [];

    const coursesData = await getAvailableCourses();

    if (!Array.isArray(coursesData) || coursesData?.length <= 0) return [];

    const courses = [];

    coursesData.forEach(
        (v) =>
            userRules.some((j, i) =>
                checkUserAndCourseCompatibility(j, v.rules[i])
            ) && courses.push(v)
    );

    return courses;
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
        .eq('id', id)
        .limit(1)
        .single();
    if (error) throw error;

    return data;
};

export const subtractHour = (rule, hour) =>
    rule
        ? rule - Math.pow(2, hour)
        : Math.pow(2, N_OF_HOURS) - 1 - Math.pow(2, hour);

export const subCourse = async (access_token, course_id, tmp_plan) => {
    const { email } = await getUser(access_token);

    const userRules = await getUserRules(email);

    const courseData = await getCourse(
        course_id,
        'rules, limit, unit, accepts'
    );
    const courseRules = courseData.rules;
    const courseLimit = courseData.limit;
    const courseDuration = courseData.unit;

    let plan = [];

    if (Array.isArray(tmp_plan) && courseData.accepts === 0) {
        if (tmp_plan.length == 0)
            throw {
                message: 'Il piano inserito non contiene ore',
                statusCode: 400,
            };

        for (const [d, h] of tmp_plan) {
            if (
                h % courseDuration == 0 &&
                h + 1 <= parseInt(N_OF_HOURS / courseDuration) * courseDuration
            ) {
                for (let i = 0; i < courseDuration; i++) {
                    plan.push([d, h + i]);
                }
            } else if (
                h + 1 >
                parseInt(N_OF_HOURS / courseDuration) * courseDuration
            )
                plan.push([d, h]);
        }
    } else if (typeof tmp_plan == 'string' && courseData.accepts === 1) {
        const hourPackData = await supabase
            .from('hours_packs')
            .select()
            .eq('id', tmp_plan)
            .limit(1)
            .single();
        if (hourPackData.error) throw hourPackData.error;
        plan = hourPackData.data.value;
    } else
        throw {
            message: 'Questo corso non permette questo metodo di iscrizione',
            statusCode: 400,
        };

    plan.forEach(([d, h]) => {
        if (!checkUserAndCourseCompatibility(userRules[d], courseRules[d], h))
            throw {
                message: 'Corso non disponibile',
            };
    });

    const subData = await supabase.from('subs').insert(
        plan.map(([day, hour]) => ({
            day,
            hour,
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
        .match({
            email,
        });
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
