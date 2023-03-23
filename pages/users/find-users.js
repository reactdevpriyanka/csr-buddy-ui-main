import SingleTabLayout from '@/components/Layout/SingleTabLayout';
import FindUserForm from '@/components/User/FindUserForm';
import FeatureFlag from '@/features/FeatureFlag';

export default function FindUsers() {
  return (
    <FeatureFlag flag="feature.explorer.IAMUserManagerEnabled" showDefaultBackup={true}>
      <FindUserForm />
    </FeatureFlag>
  );
}

FindUsers.getLayout = () => SingleTabLayout;
