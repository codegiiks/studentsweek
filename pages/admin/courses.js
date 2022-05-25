import supabase from 'lib/supabase';
import { useState, useEffect } from 'react';
import { TableEditor, AdminHeading } from 'components';
import { AdminLayout } from 'layouts/Admin';
import style from 'styles/pages/admin.courses.module.css';

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
        desc: {
            type: 'string',
            label: 'Descrizione',
        },
        limit: {
            type: 'number',
            label: 'Limite',
            min: 1,
        },
        room: {
            type: 'string',
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
                .select('name, desc, limit, emoji, room, id');
            if (error) throw message.error(error.message);
            return data;
        };

        fetchCourses().then((d) => setCourses(d));
    }, []);

    const updateCourse = async (index, newData) => {
        message.loading('Caricando...', 4000).then(async ({ destory }) => {
            const { data, error } = await supabase
                .from('courses')
                .update(newData)
                .match({
                    id: courses[index].id,
                });

            if (error) {
                destory();
                return message.error(error.message);
            }

            courses[index] = {
                ...courses[index],
                ...newData,
            };
            setCourses(courses);

            destory();
            message.success('Corso modificato con successo');
        });
    };

    return (
        <div>
            <AdminHeading desc="Qui potrai creare e modificare i corsi inseriti nella piattaforma">
                Corsi
            </AdminHeading>
            <div className={style.topButtons}>
                <div className="button limit">Crea</div>
            </div>
            <TableEditor
                data={courses}
                schema={SCHEMA}
                update={updateCourse}
                buttons={[
                    {
                        label: 'Edit',
                        render: () => (
                            <div
                                onClick={() => console.log('caio')}
                                className="button"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
}

CoursesPanel.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
