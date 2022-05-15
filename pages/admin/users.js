import supabase from 'lib/supabase';
import { TableEditor } from 'components';
import { AdminLayout } from 'layouts/Admin';

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
        <TableEditor
            fetchData={fetchData}
            tablename="users"
            schema={SCHEMA}
            getId={(data) => ({
                email: data.email,
            })}
            finder={(v, i, match) => v.email == match.email}
            desc="Qui potrai creare e modificare gli utenti inseriti nella piattaforma"
        />
    );
}

AdminPanel.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
