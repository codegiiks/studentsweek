import { subCourse } from 'lib/studentsweek';
import { validate } from 'jsonschema';

const SCHEMA = {
    type: 'object',
    properties: {
        course: {
            type: 'string',
        },
        plan: {
            type: 'array',
            contains: {
                type: 'array',
                contains: {
                    type: 'integer',
                },
                minItems: 2,
                maxItems: 2,
            },
            uniqueItems: true,
        },
        user: {
            type: 'string',
        },
    },
    required: ['user', 'course', 'plan'],
};

export default async function handler(req, res) {
    try {
        switch (req.method) {
            case 'POST':
                let errors;
                if ((errors = validate(req.body, SCHEMA).errors))
                    throw errors[0];

                const data = await subCourse(
                    req.body.user,
                    req.body.course,
                    req.body.plan
                );
                return res.status(200).send(data.message);
            default:
                return res.status(400).end('Bad Request');
        }
    } catch (e) {
        console.log(e);
        return res.status(e.statusCode || 500).end(e?.message || e);
    }
}
