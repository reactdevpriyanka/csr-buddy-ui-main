import { useRouter } from 'next/router';
import useCustomer from '@/hooks/useCustomer';
import CustomerInformationEditor from '@components/CustomerSidebar/CustomerInformation/CustomerInformationEditor';
import EditPetProfile from '@components/CustomerSidebar/PetProfile/EditPetProfile';
import DeactivatePetProfile from '@components/CustomerSidebar/PetProfile/DeactivatePetProfile';
import ViewPetProfile from '@components/CustomerSidebar/PetProfile/ViewPetProfile';
import AddPetProfile from '../PetProfile/AddPetProfile';
import CustomerInteraction from './CustomerInteraction';
import TagEditor from './TagEditor';

const panels = {
  CUSTOMER_INFO: 'customerInfo',
  TAG_EDITOR: 'tagEditor',
  ADD_PET_PROFILE: 'addPetProfile',
  VIEW_PET_PROFILE: 'viewPetProfile',
  EDIT_PET_PROFILE: 'editPetProfile',
  DEACTIVATE_PET_PROFILE: 'deactivatePetProfile',
  CUSTOMER_INFORMATION_EDITOR: 'customerInformationEditor',
};

const CustomerBrief = () => {
  const { data, error } = useCustomer();

  const router = useRouter();

  if (!data || error) {
    return null;
  }

  const { interactionPanel } = router.query;

  switch (interactionPanel) {
    case panels.TAG_EDITOR:
      return <TagEditor />;
    case panels.ADD_PET_PROFILE:
      return <AddPetProfile />;
    case panels.VIEW_PET_PROFILE:
      return <ViewPetProfile />;
    case panels.EDIT_PET_PROFILE:
      return <EditPetProfile />;
    case panels.DEACTIVATE_PET_PROFILE:
      return <DeactivatePetProfile />;
    case panels.CUSTOMER_INFORMATION_EDITOR:
      return <CustomerInformationEditor />;
    case panels.CUSTOMER_INFO:
    default:
      return <CustomerInteraction />;
  }
};

export default CustomerBrief;
