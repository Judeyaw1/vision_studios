import { cookies } from 'next/headers';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { getGalleries } from '@/lib/galleries';
import { makeAdminToken } from '../api/admin/login/route';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  const isAuthed = session === makeAdminToken();

  if (!isAuthed) return <AdminLogin />;

  const galleries = getGalleries();
  return <AdminDashboard galleries={galleries} />;
}
