import supabase from 'lib/supabase';
import { useState, useEffect } from 'react';
import { AdminLayout } from 'layouts/Admin';
import { TableEditor, AdminHeading } from 'components';

import style from 'styles/pages/admin.users.module.css';

const SCHEMA = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            label: 'Nome',
            minLength: 3,
        },
        email: {
            type: 'string',
            label: 'Email',
            minLength: 5,
        },
        class: {
            type: 'string',
            label: 'Classe',
        },
        propic: {
            type: 'string',
            label: 'Propic',
        },
        role: {
            type: 'string',
            label: 'Ruolo',
            enum: ['Admin', 'Student'],
        },
    },
};

export default function AdminPanel() {
    const [users, setUsers] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('name, email, propic, class, role');
            if (error) throw message.error(error.message);
            return data;
        };

        fetchUsers().then((d) => setUsers(d));
    });

    return (
        <div className={style.wrapper}>
            <AdminHeading desc="Qui potrai visualizzare e modificare le informazioni degli utenti iscritti sulla piattaforma">
                Utenti
            </AdminHeading>
            <TableEditor
                data={users}
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
