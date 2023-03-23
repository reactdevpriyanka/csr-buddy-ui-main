import { fireEvent, render } from '@testing-library/react';
import ModalContext, { MODAL } from '@/components/ModalContext';
import Providers from '@components/Providers';
import OpenCommentsButton from './OpenCommentsButton';
describe('<OpenCommentsButton />', () => {
  it('sets modal to ARCHIVECONTAINER if provider modal is null', async () => {
    const setModalMock = jest.fn();
    const props = {
      setModal: setModalMock,
      modal: null,
    };
    const { getByTestId } = render(
      <Providers>
        <ModalContext.Provider value={props}>
          <OpenCommentsButton />
        </ModalContext.Provider>
      </Providers>,
    );

    const oc = getByTestId('agent-alert:open-comments');
    fireEvent.click(oc);

    expect(setModalMock).toHaveBeenCalledWith(MODAL.ARCHIVECONTAINER);
  });

  it('sets modal to null if provider is ARCHIVECONTAINER', () => {
    const setModalMock = jest.fn();
    const props = {
      setModal: setModalMock,
      modal: MODAL.ARCHIVECONTAINER,
    };
    const { getByTestId } = render(
      <Providers>
        <ModalContext.Provider value={props}>
          <OpenCommentsButton />
        </ModalContext.Provider>
      </Providers>,
    );

    const oc = getByTestId('agent-alert:open-comments');
    fireEvent.click(oc);

    expect(setModalMock).toHaveBeenCalledWith(null);
  });
});
