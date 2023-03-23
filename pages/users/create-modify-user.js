import SingleTabLayout from '@/components/Layout/SingleTabLayout';
import CreateModifyUserForm from '@/components/User/CreateModifyUserForm';
import FeatureFlag from '@/features/FeatureFlag';
import { useRouter } from 'next/router';

export default function CreateModifyUser() {
  const router = useRouter();
  const { loginId = '' } = router.query;

  return (
    <FeatureFlag flag="feature.explorer.IAMUserManagerEnabled" showDefaultBackup={true}>
      <CreateModifyUserForm loginIdInput={loginId} />
    </FeatureFlag>
  );
}

CreateModifyUser.getLayout = () => SingleTabLayout;
