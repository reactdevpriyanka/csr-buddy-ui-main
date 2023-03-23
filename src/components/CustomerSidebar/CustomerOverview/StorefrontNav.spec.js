import useEnactment from '@/hooks/useEnactment';
import { fireEvent, waitFor } from '@testing-library/dom';
import renderWrap from '@/utils/renderWrap';
import StorefrontNav from './StorefrontNav';
const linkTests = [
  ['storefrontnav:account', `/app/account`],
  ['storefrontnav:favorites', '/app/account/favorites'],
  ['storefrontnav:reorder', '/app/account/reorder'],
  ['storefrontnav:wallet', '/app/account/wallet'],
  ['storefrontnav:giftcard', `/app/account/giftcard`],
  ['storefrontnav:pethealth', `/pethealth`],
  ['storefrontnav:clinics', `/app/account/clinics`],
  ['storefrontnav:rescues', `/g/my-rescues`],
];
jest.mock('@/hooks/useEnactment');

describe('<StoreFrontNav />', () => {
  const { openEnactmentPage } = useEnactment(); // call the mock to get access to the jest fn

  beforeEach(() => {
    openEnactmentPage.mockClear();
  });

  const render = renderWrap(StorefrontNav);

  it.each(linkTests)(
    'clicking on [data-testid=%p] should open %p',
    async (testid, enactmentURL) => {
      const { getByTestId } = render();
      const link = getByTestId(testid);
      expect(link).toBeInTheDocument();

      fireEvent.click(link);
      await waitFor(() => expect(openEnactmentPage).toHaveBeenCalled());

      expect(openEnactmentPage).toHaveBeenCalledWith(enactmentURL);
    },
  );
});
