import { subCourse } from 'lib/studentsweek';

const SCHEMA = {
    type: 'object',
    properties: {
        course: {
            type: 'string',
        },
        day: {
            type: 'integer',
        },
        hour: {
            type: 'integer',
        },
        user: {
            type: 'string',
        },
    },
};

export default async function handler(req, res) {
    try {
        switch (req.method) {
            case 'POST':
                const data = await subCourse(req.body);
                return res.status(200).send(data);
            default:
                return res.status(400).end('Bad Request');
        }
    } catch (e) {
        return res.status(500).end(e);
    }
}
