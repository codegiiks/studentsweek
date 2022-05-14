import { browseCourses } from 'lib/courses';

export default async function handler(req, res) {
    try {
        switch (req.method) {
            case 'GET':
                const { day, user } = req.query;
                if (!day || !user)
                    return res.status(400).end('Invalid Request');
                const data = await browseCourses(day, user);
                return res.status(200).send(data);
        }
    } catch (e) {
        return res.status(500).end(e?.message);
    }
}
