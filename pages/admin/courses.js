import supabase from 'lib/supabase';
import { CreatePopup, TableEditor, AdminHeading } from 'components';
import { AdminLayout } from 'layouts/Admin';
import { useState } from 'react';

const SCHEMA = [
    {
        id: 'emoji',
        name: '',
    },
    {
        id: 'name',
        name: 'Nome',
    },
    {
        id: 'org',
        name: 'Organizzatore',
        render: (v) => v.org.name,
        uneditable: true,
    },
    {
        id: 'desc',
        name: 'Descrizione',
        as: 'textarea',
    },
    {
        id: 'limit',
        name: 'Limite',
        type: 'number',
    },
    {
        id: 'room',
        name: 'Aula',
    },
];

export default function AdminPanel() {
    const [visiblePopup, setVisiblePopup] = useState(false);

    const fetchData = async () => {
        const { data, error } = await supabase
            .from('courses')
            .select('name, org ( name ), desc, limit, emoji, room, id');
        if (error) throw message.error(error.message);
        return data;
    };

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
                fetchData={fetchData}
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

AdminPanel.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
