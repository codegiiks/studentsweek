import supabase from 'lib/supabase';
import { TableEditor, AdminHeading } from 'components';
import { AdminLayout } from 'layouts/Admin';

import style from 'styles/pages/admin.users.module.css';

const SCHEMA = [
    {
        id: 'name',
        name: 'Nome',
    },
    {
        id: 'email',
        name: 'Email',
    },
    {
        id: 'class',
        name: 'Classe',
    },
    {
        id: 'propic',
        name: 'Propic',
    },
    {
        id: 'role',
        name: 'Ruolo',
        as: 'select',
        enum: ['admin', 'student'],
    },
];

export default function AdminPanel() {
    const fetchData = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('name, email, propic, class, role');
        if (error) throw message.error(error.message);
        return data;
    };

    return (
        <div className={style.wrapper}>
            <AdminHeading desc="Qui potrai visualizzare e modificare le informazioni degli utenti iscritti sulla piattaforma">
                Utenti
            </AdminHeading>
            <TableEditor
                fetchData={fetchData}
                tablename="users"
                schema={SCHEMA}
                getId={(data) => ({
                    email: data.email,
                })}
                finder={(v, i, match) => v.email == match.email}
            />
        </div>
    );
}

AdminPanel.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
