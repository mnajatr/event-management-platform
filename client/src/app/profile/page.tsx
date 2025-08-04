import ProtectedPage from '@/components/auth/ProtectedPage';
import ProfilePage from '@/components/profile/ProfilePage';
import LogoutButton from '@/components/LogoutButton';

export default function Profile() {
  return (
    <ProtectedPage allowedRoles={['CUSTOMER', 'ORGANIZER']}>
      <div className="flex justify-end p-4">
        <LogoutButton />
      </div>
      <ProfilePage />
    </ProtectedPage>
  );
}
