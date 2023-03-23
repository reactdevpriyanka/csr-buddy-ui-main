import { useRouter } from 'next/router';
import { renderWrap } from '@utils';
import useCustomer from '@/hooks/useCustomer';
import customer from '__mock__/customers/nessa';
import usePetProfile from '@/hooks/usePetProfile';
import petProfile from '__mock__/petprofiles/pet-profile-full';
import CustomerBrief from './CustomerBrief';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useCustomer');
jest.mock('@/hooks/usePetProfile');
usePetProfile.mockReturnValue({
  data: petProfile,
  createPetProfile: jest.fn(),
  updatePetProfile: jest.fn(),
  mutate: jest.fn(),
});

describe('<CustomerBrief />', () => {
  const render = renderWrap(CustomerBrief);

  useRouter.mockReturnValue({
    query: {
      interactionPanel: null,
    },
  });

  useCustomer.mockReturnValue({
    data: customer,
    error: null,
  });

  test('it should render interaction panel', () => {
    const { getByTestId } = render();
    expect(getByTestId('customer-interaction')).toBeInTheDocument();
  });

  describe('when customer interaction is open', () => {
    beforeEach(() => {
      useRouter.mockReturnValue({
        query: {
          interactionPanel: 'customerInfo',
        },
      });
    });

    test('it should render customer interaction', () => {
      const { getByTestId } = render();
      expect(getByTestId('customer-interaction')).toBeInTheDocument();
    });

    test('it should fall back to customer interaction', () => {
      useRouter.mockReturnValue({
        query: {
          interactionPanel: 'abcdef',
        },
      });
      const { getByTestId } = render();
      expect(getByTestId('customer-interaction')).toBeInTheDocument();
    });
  });

  describe('when customer info editor is open', () => {
    beforeEach(() => {
      useRouter.mockReturnValue({
        query: {
          interactionPanel: 'customerInformationEditor',
        },
      });
    });

    test('it should render customer editor', () => {
      const { getByTestId } = render();
      expect(getByTestId('tag-editor')).toBeInTheDocument();
    });
  });

  describe('when tag editor is open', () => {
    beforeEach(() => {
      useRouter.mockReturnValue({
        query: {
          interactionPanel: 'tagEditor',
        },
      });
    });

    test('it should render tag editor', () => {
      const { getByTestId } = render();
      expect(getByTestId('tag-editor')).toBeInTheDocument();
    });
  });

  describe('when add pet profile is open', () => {
    beforeEach(() => {
      useRouter.mockReturnValue({
        query: {
          interactionPanel: 'addPetProfile',
        },
      });
    });

    test('it should render add pet profile', () => {
      const { getByTestId } = render();
      expect(getByTestId('add-pet-profile')).toBeInTheDocument();
    });
  });

  describe('when view pet profile is open', () => {
    beforeEach(() => {
      useRouter.mockReturnValue({
        query: {
          interactionPanel: 'viewPetProfile',
          id: '123123',
        },
      });
    });

    test('it should render view pet profile', () => {
      const { getByTestId } = render();
      expect(getByTestId('view-pet-profile')).toBeInTheDocument();
    });
  });

  describe('when edit pet profile is open', () => {
    beforeEach(() => {
      useRouter.mockReturnValue({
        query: {
          interactionPanel: 'editPetProfile',
        },
      });
    });

    test('it should render edit pet profile', () => {
      const { getByTestId } = render();
      expect(getByTestId('edit-pet-profile')).toBeInTheDocument();
    });
  });

  describe('when deactivate pet profile is open', () => {
    beforeEach(() => {
      useRouter.mockReturnValue({
        query: {
          interactionPanel: 'deactivatePetProfile',
        },
      });
    });

    test('it should render deactivate pet profile', () => {
      const { getByTestId } = render();
      expect(getByTestId('deactivate-pet-profile')).toBeInTheDocument();
    });
  });
});
