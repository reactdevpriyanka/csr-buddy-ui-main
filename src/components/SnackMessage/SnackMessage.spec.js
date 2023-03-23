import { fireEvent } from '@testing-library/dom';
import { renderWrap } from '@utils';
import SnackMessage, { SNACKVARIANTS } from './SnackMessage';

describe('<SnackMessage />', () => {
  const testId = 999;
  const testMsgHdr = 'My Test Message Header';
  const testSubHdr = 'My Test Sub Header';
  const testListItemsMsg1 = 'My Test ListItemMsg1';
  const testListItemsMsg2 = 'My Test ListItemMsg2';
  const testListItems = [testListItemsMsg1, testListItemsMsg2];
  const testLinkLabel = 'My Test testLinkLabel';
  const testLinkOnClickFunc = jest.fn();
  const testLink = { label: testLinkLabel, onClick: testLinkOnClickFunc };

  const defaultProps = {
    id: testId,
    variant: SNACKVARIANTS.INFO,
    messageHeader: testMsgHdr,
    messageSubheader: testSubHdr,
    listItems: testListItems,
    link: {},
  };

  const render = (overrideProps = {}) =>
    renderWrap(SnackMessage, { defaultProps: { ...defaultProps, ...overrideProps } })();

  test('it should render expected messageHeader', () => {
    const { getByText } = render();
    expect(getByText(testMsgHdr)).toBeInTheDocument();
  });

  test('it should render expected messageSubheader', () => {
    const { getByText } = render();
    expect(getByText(testSubHdr)).toBeInTheDocument();
  });

  test('it should render expected listItems', () => {
    const { getByText } = render();
    expect(getByText(testListItemsMsg1)).toBeInTheDocument();
    expect(getByText(testListItemsMsg2)).toBeInTheDocument();
  });

  test('it should not render testLinkLabel', () => {
    const { queryByText } = render();
    expect(queryByText(testLinkLabel)).toBeNull();
  });

  test('it should not call onClick by default', () => {
    render();
    expect(testLinkOnClickFunc).not.toHaveBeenCalled();
  });

  test('it should not render any link button', () => {
    const { queryByTestId } = render();
    expect(queryByTestId(`actionButton-${SNACKVARIANTS.INFO}`)).toBeNull();
    expect(queryByTestId(`actionButton-${SNACKVARIANTS.WARNING}`)).toBeNull();
    expect(queryByTestId(`actionButton-${SNACKVARIANTS.ERROR}`)).toBeNull();
    expect(queryByTestId(`actionButton-${SNACKVARIANTS.SUCCESS}`)).toBeNull();
  });

  describe('Snack with link', () => {
    test('it should render getByText text', () => {
      const { getByText } = render({ link: testLink });
      expect(getByText(testLinkLabel)).toBeInTheDocument();
    });

    test('it should render with link button', () => {
      const { getByTestId } = render({ link: testLink });
      expect(getByTestId(`actionButton-${SNACKVARIANTS.INFO}`)).toBeInTheDocument();
    });

    test('it should render with link button but not call onClick by default', () => {
      render({ link: testLink });
      expect(testLinkOnClickFunc).not.toHaveBeenCalled();
    });

    test('it should call link onClick function', () => {
      const { getByTestId } = render({ link: testLink });
      fireEvent.click(getByTestId(`actionButton-${SNACKVARIANTS.INFO}`));
      expect(testLinkOnClickFunc).toHaveBeenCalled();
    });
  }); // End Snack with link

  describe('Snack with Success Variant', () => {
    test('it should render card as Success', () => {
      const { getByTestId } = render({ link: testLink, variant: SNACKVARIANTS.SUCCESS });
      expect(getByTestId(`snack-card-${SNACKVARIANTS.SUCCESS}`)).toBeInTheDocument();
    });

    test('it should render closeIcon as Success', () => {
      const { getByTestId } = render({ link: testLink, variant: SNACKVARIANTS.SUCCESS });
      expect(getByTestId(`closeIcon-${SNACKVARIANTS.SUCCESS}`)).toBeInTheDocument();
    });

    test('it should render Success link button', () => {
      const { getByTestId } = render({ link: testLink, variant: SNACKVARIANTS.SUCCESS });
      expect(getByTestId(`actionButton-${SNACKVARIANTS.SUCCESS}`)).toBeInTheDocument();
    });
  }); // End Snack with Success Variant

  describe('Snack with Warning Variant', () => {
    test('it should render card as Warning', () => {
      const { getByTestId } = render({ link: testLink, variant: SNACKVARIANTS.WARNING });
      expect(getByTestId(`snack-card-${SNACKVARIANTS.WARNING}`)).toBeInTheDocument();
    });

    test('it should render Warning link button', () => {
      const { getByTestId } = render({ link: testLink, variant: SNACKVARIANTS.WARNING });
      expect(getByTestId(`actionButton-${SNACKVARIANTS.WARNING}`)).toBeInTheDocument();
    });
  }); // End Snack with Warning Variant

  describe('Snack with Error Variant', () => {
    test('it should render card as Error', () => {
      const { getByTestId } = render({ link: testLink, variant: SNACKVARIANTS.ERROR });
      expect(getByTestId(`snack-card-${SNACKVARIANTS.ERROR}`)).toBeInTheDocument();
    });

    test('it should render closeIcon as Error', () => {
      const { getByTestId } = render({ link: testLink, variant: SNACKVARIANTS.ERROR });
      expect(getByTestId(`closeIcon-${SNACKVARIANTS.ERROR}`)).toBeInTheDocument();
    });

    test('it should render Error link button', () => {
      const { getByTestId } = render({ link: testLink, variant: SNACKVARIANTS.ERROR });
      expect(getByTestId(`actionButton-${SNACKVARIANTS.ERROR}`)).toBeInTheDocument();
    });
  }); // End Snack with Error Variant

  describe('Snack with Info Variant', () => {
    test('it should render card as Info', () => {
      const { getByTestId } = render({ link: testLink, variant: SNACKVARIANTS.INFO });
      expect(getByTestId(`snack-card-${SNACKVARIANTS.INFO}`)).toBeInTheDocument();
    });

    test('it should render closeIcon as Info', () => {
      const { getByTestId } = render({ link: testLink, variant: SNACKVARIANTS.INFO });
      expect(getByTestId(`closeIcon-${SNACKVARIANTS.INFO}`)).toBeInTheDocument();
    });

    test('it should render Info link button', () => {
      const { getByTestId } = render({ link: testLink, variant: SNACKVARIANTS.INFO });
      expect(getByTestId(`actionButton-${SNACKVARIANTS.INFO}`)).toBeInTheDocument();
    });
  }); // End Snack with Info Variant
});
