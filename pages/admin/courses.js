import supabase from 'lib/supabase';
import { useState, useEffect } from 'react';
import { CreatePopup, TableEditor, AdminHeading } from 'components';
import { AdminLayout } from 'layouts/Admin';

const SCHEMA = {
    type: 'object',
    properties: {
        emoji: {
            type: 'string',
            label: 'Emoji',
        },
        name: {
            type: 'string',
            label: 'Nome',
            minLength: 3,
        },
        org: {
            type: 'string',
            label: 'Organizzatore',
            render: (v) => v.org.name,
            options: {
                readOnly: true,
            },
        },
        desc: {
            type: 'string',
            label: 'Descrizione',
            as: 'textarea',
        },
        limit: {
            type: 'number',
            label: 'Limite',
            minimum: 1,
        },
        room: {
            type: 'number',
            label: 'Aula',
        },
    },
};

export default function CoursesPanel() {
    const [courses, setCourses] = useState(null);
    const [visiblePopup, setVisiblePopup] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            const { data, error } = await supabase
                .from('courses')
                .select('name, org ( name ), desc, limit, emoji, room, id');
            if (error) throw message.error(error.message);
            return data;
        };

        fetchCourses().then((d) => setCourses(d));
    });

    return (
        <div>
            <AdminHeading desc="Qui potrai creare e modificare i corsi inseriti nella piattaforma">
                Corsi
            </AdminHeading>
            <CreatePopup
                visible={visiblePopup}
                close={() => setVisiblePopup(false)}
            />
            <TableEditor
                data={courses}
                tablename="courses"
                schema={SCHEMA}
                getId={(data) => ({
                    id: data.id,
                })}
                finder={(v, i, match) => v.id == match.id}
                buttons={() => (
                    <button
                        className="button"
                        onClick={() => setVisiblePopup(!visiblePopup)}
                    >
                        Nuovo Corso
                    </button>
                )}
            />
        </div>
    );
}

CoursesPanel.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
