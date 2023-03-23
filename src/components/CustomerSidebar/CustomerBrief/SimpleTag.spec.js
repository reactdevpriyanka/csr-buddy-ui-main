import { renderWrap } from '@utils';
import useTags from '@/hooks/useTags';
import * as useAgentInteractions from '@/hooks/useAgentInteractions';
import * as nextRouter from 'next/router';
import { waitFor } from '@testing-library/dom';
import SimpleTag from './SimpleTag';

jest.mock('@/hooks/useTags');

describe('<SimpleTag />', () => {
  const mockRouter = jest.spyOn(nextRouter, 'useRouter');

  mockRouter.mockReturnValue({
    query: {
      id: '123123',
    },
  });

  const captureInteractionMock = jest.fn();
  jest
    .spyOn(useAgentInteractions, 'default')
    .mockImplementation(() => ({ captureInteraction: captureInteractionMock }));

  const render = renderWrap(SimpleTag);

  const { updateCustomerTags } = useTags;

  afterEach(() => {
    updateCustomerTags.mockReset();
    captureInteractionMock.mockReset();
  });

  test('it should render unchecked by default', () => {
    const { container } = render({
      name: 'UPDATE_ME',
      displayName: 'Update Me',
    });
    const el = container.querySelector('input:not(:checked)');
    expect(el).toBeInTheDocument();
  });

  test('it should render name attribute', () => {
    const { container } = render({ name: 'HYSTERICAL_FITS_OF_RAGE', displayName: 'hfor' });
    expect(container.querySelector('[name="HYSTERICAL_FITS_OF_RAGE"]')).toBeInTheDocument();
  });

  test('it should render display name as label', () => {
    const { getByText } = render({
      name: 'customertag',
      displayName: 'Customer has hysterical fits of rage',
    });
    expect(getByText('Customer has hysterical fits of rage')).toBeInTheDocument();
  });

  describe('when input checked', () => {
    test('it should update tags', () => {
      useTags().updateCustomerTags.mockReturnValue({ then: (fn) => {} });

      const { getByLabelText } = render({
        name: 'UPDATE_ME',
        displayName: 'Update Me',
      });

      render.trigger.click(getByLabelText('Update Me'));

      expect(updateCustomerTags).toHaveBeenCalledWith({ name: 'UPDATE_ME', value: true });
    });

    it('should invoke captureInteraction if successful', async () => {
      useTags().updateCustomerTags.mockResolvedValue(true);

      const { getByLabelText } = render({
        name: 'UPDATE_ME',
        displayName: 'Update Me',
      });

      render.trigger.click(getByLabelText('Update Me'));

      expect(updateCustomerTags).toHaveBeenCalledWith({ name: 'UPDATE_ME', value: true });
      await waitFor(() => expect(captureInteractionMock).toHaveBeenCalled());

      expect(captureInteractionMock.mock.calls[0][0]).toMatchObject({
        type: 'CUSTOMER_TAGS',
        action: 'UPDATE',
      });
    });

    it('does not invoke captureInteraction if updateCustomer unsuccessful', async () => {
      useTags().updateCustomerTags.mockResolvedValue(false);

      const { getByLabelText } = render({
        name: 'UPDATE_ME',
        displayName: 'Update Me',
      });

      render.trigger.click(getByLabelText('Update Me'));

      expect(updateCustomerTags).toHaveBeenCalledWith({ name: 'UPDATE_ME', value: true });
      await waitFor(() => expect(captureInteractionMock).not.toHaveBeenCalled());
    });
  });
});
