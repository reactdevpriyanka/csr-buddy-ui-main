import { renderWrap } from '@utils';
import useTags from '@/hooks/useTags';
import * as nextRouter from 'next/router';
import * as useAgentInteractions from '@/hooks/useAgentInteractions';
import { waitFor } from '@testing-library/dom';
import WeightTag from './WeightTag';

jest.mock('@/hooks/useTags');

describe('<WeightTag />', () => {
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

  const render = renderWrap(WeightTag, {
    defaultProps: {
      name: 'WEIGHT_LIMIT',
      displayName: 'Weight limit',
    },
  });

  const { updateCustomerTags } = useTags;

  test('it should render disabled weight options by default', () => {
    const { container } = render();
    const weights = container.querySelectorAll('input:disabled');
    expect(weights).toHaveLength(4);
  });

  describe('when checkbox is checked', () => {
    const clickCheckbox = () => {
      const result = render();
      render.trigger.click(result.getByText('Weight limit'));
      return result;
    };

    test('it should enable all weight options', () => {
      const { container } = clickCheckbox();
      expect(container.querySelectorAll('input:disabled')).toHaveLength(0);
    });

    describe('when checkbox is unchecked', () => {
      test('it should update tags', () => {
        const { getByText } = clickCheckbox();
        useTags().updateCustomerTags.mockReturnValue({ then: (fn) => {} });
        render.trigger.click(getByText('Weight limit'));
        expect(updateCustomerTags).toHaveBeenCalledWith({
          name: 'WEIGHT_LIMIT',
          value: -1,
        });
      });

      test('it should post a customer interaction if successful', async () => {
        captureInteractionMock.mockClear();
        useTags().updateCustomerTags.mockResolvedValue(true);
        const { getByText } = clickCheckbox();
        render.trigger.click(getByText('Weight limit'));
        expect(updateCustomerTags).toHaveBeenCalledWith({
          name: 'WEIGHT_LIMIT',
          value: -1,
        });
        await waitFor(() => expect(captureInteractionMock).toHaveBeenCalledTimes(1));
      });

      test('it should notpost a customer interaction if unsuccessful', async () => {
        captureInteractionMock.mockClear();
        useTags().updateCustomerTags.mockResolvedValue(false);
        const { getByText } = clickCheckbox();
        render.trigger.click(getByText('Weight limit'));
        expect(updateCustomerTags).toHaveBeenCalledWith({
          name: 'WEIGHT_LIMIT',
          value: -1,
        });
        await waitFor(() => expect(captureInteractionMock).toHaveBeenCalledTimes(0));
      });
    });

    describe('when weight option is selected', () => {
      test('it should update customer tag', () => {
        const { getByLabelText } = clickCheckbox();
        const twentyLbsLimit = getByLabelText('20 lbs');
        useTags().updateCustomerTags.mockReturnValue({ then: (fn) => {} });
        render.trigger.click(twentyLbsLimit);
        expect(updateCustomerTags).toHaveBeenCalledWith({
          name: 'WEIGHT_LIMIT',
          value: 20,
        });
      });

      it('should capture a new interaction if succesful', async () => {
        captureInteractionMock.mockClear();
        useTags().updateCustomerTags.mockResolvedValue(true);
        const { getByLabelText } = clickCheckbox();
        const twentyLbsLimit = getByLabelText('20 lbs');
        render.trigger.click(twentyLbsLimit);
        expect(updateCustomerTags).toHaveBeenCalledWith({
          name: 'WEIGHT_LIMIT',
          value: 20,
        });
        await waitFor(() => expect(captureInteractionMock).toHaveBeenCalledTimes(1));

        expect(captureInteractionMock.mock.calls[0][0]).toMatchObject({
          type: 'CUSTOMER_TAGS',
          action: 'UPDATE',
        });
      });

      it('should not capture a new interaction if unsuccessful', async () => {
        captureInteractionMock.mockClear();

        const { getByLabelText } = clickCheckbox();
        const twentyLbsLimit = getByLabelText('20 lbs');
        useTags().updateCustomerTags.mockResolvedValue(false);
        render.trigger.click(twentyLbsLimit);
        expect(updateCustomerTags).toHaveBeenCalledWith({
          name: 'WEIGHT_LIMIT',
          value: 20,
        });
        await waitFor(() => expect(captureInteractionMock).not.toHaveBeenCalled());
      });
    });
  });
});
