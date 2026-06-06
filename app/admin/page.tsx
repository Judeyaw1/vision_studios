import { cookies } from 'next/headers';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import { getGalleries } from '@/lib/galleries';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  const isAuthed = session === process.env.ADMIN_PASSWORD;

  if (!isAuthed) return <AdminLogin />;

  const galleries = getGalleries();
  return <AdminDashboard galleries={galleries} />;
}
