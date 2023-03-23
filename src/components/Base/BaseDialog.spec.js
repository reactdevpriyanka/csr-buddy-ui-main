import { fireEvent } from '@testing-library/react';
import { renderWrap } from '@utils';
import * as nextRouter from 'next/router';
import BaseDialog, { CLOSE_BUTTONS } from './BaseDialog';

const mockOnClose = jest.fn();
const mockOnOk = jest.fn();
const mockPush = jest.fn();

const defaultProps = {
  open: true,
  onClose: mockOnClose,
  onOk: mockOnOk,
  dialogQueryParam: 'thatOneDialog',
};

describe('<BaseDialog />', () => {
  const render = (props = {}) => renderWrap(BaseDialog, { defaultProps, ...props })();
  const expectedEmptyRouterQuery = [{ query: {} }, null, { shallow: true }];

  beforeEach(() => {
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({
      push: mockPush,
      query: {
        activeDialog: 'thatOneDialog',
      },
    });
  });

  test('it should remove dialog query params', async () => {
    const { getByTestId } = render();
    expect(getByTestId('close-dialog')).toBeTruthy();

    fireEvent.click(getByTestId('close-dialog'));
    expect(mockPush).toHaveBeenCalledWith(...expectedEmptyRouterQuery);

    // There is a 300ms timeout in BaseDialog.js
    // handleOnCloseClick() so we account for that here
    await new Promise((res) =>
      setTimeout(() => {
        expect(mockOnClose).toHaveBeenCalledWith(CLOSE_BUTTONS.X);
        res();
      }, 300),
    );
  });

  test('it should click disagree button', async () => {
    const { getByTestId } = render();
    expect(getByTestId('base-dialog-close-button')).toBeTruthy();
    fireEvent.click(getByTestId('base-dialog-close-button'));

    // There is a 300ms timeout in BaseDialog.js
    // handleOnCloseClick() so we account for that here
    await new Promise((res) =>
      setTimeout(() => {
        expect(mockOnClose).toHaveBeenCalledWith(CLOSE_BUTTONS.CANCEL_BUTTON);
        res();
      }, 300),
    );
  });

  test('it should click the agree button', async () => {
    const { getByTestId } = render();
    expect(getByTestId('base-dialog-ok-button')).toBeTruthy();
    fireEvent.click(getByTestId('base-dialog-ok-button'));

    expect(mockPush).toHaveBeenCalledWith(...expectedEmptyRouterQuery);

    // There is a 300ms timeout in BaseDialog.js
    // handleOnCloseClick() so we account for that here
    await new Promise((res) =>
      setTimeout(() => {
        expect(mockOnOk).toHaveBeenCalled();
        res();
      }, 300),
    );
  });
});
