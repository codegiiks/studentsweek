import { AdminLayout } from 'layouts/Admin';

export default function AdminPanel({}) {
    return (
        <div>
            <h1>courses panel</h1>
        </div>
    );
}

AdminPanel.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;
