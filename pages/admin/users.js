import supabase from 'lib/supabase';
import { useState, useEffect } from 'react';
import { AdminLayout } from 'layouts/Admin';
import { TableEditor, AdminHeading, SearchBox } from 'components';

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
            type: 'enum',
            label: 'Ruolo',
            enumOptions: {
                admin: 'Amminsitratore',
                student: 'Studente',
                org: 'Organizzatore',
            },
        },
    },
};

export default function AdminPanel() {
    const [users, setUsers] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('name, email, propic, class, role')
                .limit(10);
            if (error) throw message.error(error.message);
            return data;
        };

        fetchUsers().then((d) => setUsers(d));
    }, []);

    const searchUser = async (query) => {
        if (!query) return;
        const { data, error } = await supabase
            .from('users')
            .select()
            .textSearch('name', `'${query}'`)
            .limit(10);

        if (error) return message.error(error.message);

        setUsers(data);
    };

    const updateUser = async (index, newData) => {
        message.loading('Caricando...', 4000).then(async ({ destory }) => {
            const { data, error } = await supabase
                .from('users')
                .update(newData)
                .match({
                    email: users[index].email,
                });

            if (error) {
                destory();
                return message.error(error.message);
            }

            users[index] = {
                ...users[index],
                ...newData,
            };
            setUsers(users);

            destory();
            message.success('Utente modificato con successo');
        });
    };

    return (
        <div className={style.wrapper}>
            <AdminHeading desc="Qui potrai visualizzare e modificare le informazioni degli utenti iscritti sulla piattaforma">
                Utenti
            </AdminHeading>
            <div className={style.topButtons}>
                <SearchBox searchCallback={searchUser} />
            </div>
            <TableEditor data={users} schema={SCHEMA} update={updateUser} />
        </div>
    );
}

AdminPanel.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
