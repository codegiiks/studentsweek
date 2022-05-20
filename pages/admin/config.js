import supabase from 'lib/supabase';
import { AdminLayout } from 'layouts/Admin';
import { AdminHeading, Option } from 'components';
import { useEffect, useState, useRef } from 'react';

export default function AdminPanel({}) {
    const infoRef = useRef(null);
    const [info, setInfo] = useState(null);
    const [requestTimeout, setRequestTimeout] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            const { data, error } = await supabase.from('info').select();
            if (error) throw error.message;
            return Object.fromEntries(data.map(({ id, value }) => [id, value]));
        };

        fetchInfo()
            .then((d) => setInfo(d))
            .catch((e) => message.error(e));

        const subscription = supabase
            .from('info')
            .on('*', ({ new: { id, value } }) => {
                setInfo({
                    ...infoRef.current,
                    [id]: value,
                });
            })
            .subscribe();

        return () => supabase.removeSubscription(subscription);
    }, []);

    useEffect(() => {
        infoRef.current = info;
    }, [info]);

    const update = (id, value) => {
        info[id] = value;
        setInfo(info);

        if (requestTimeout) clearTimeout(requestTimeout);

        setRequestTimeout(
            setTimeout(async () => {
                const { data, error } = await supabase
                    .from('info')
                    .update({ value })
                    .match({ id });
                if (error) return message.error(error.message);
                message.success('Configurazione modificata con successo');
                setRequestTimeout(null);
            }, 1000)
        );
    };

    return (
        <div>
            <AdminHeading>Configurazione</AdminHeading>
            <Option
                title="Numero di Ore"
                desc="Cambia qui il numero di ore per la settimana dello studente"
                data={info?.N_OF_HOURS}
                schema={{
                    type: 'number',
                    min: 1,
                    max: 24,
                }}
                update={(n) => update('N_OF_HOURS', n)}
            />
            <Option
                title="Numero di Giorni"
                desc="Cambia qui il numero di giorni per la settimana dello studente"
                data={info?.N_OF_DAYS}
                schema={{
                    type: 'number',
                }}
                update={(n) => update('N_OF_DAYS', n)}
            />
        </div>
    );
}

AdminPanel.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
