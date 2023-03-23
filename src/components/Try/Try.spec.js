/* eslint-disable no-console, react/prop-types */
import { useEffect } from 'react';
import { renderWrap } from '@utils';
import Try from './Try';

describe('<Try />', () => {
  const fallback = <div>{'Failsafe'}</div>;

  const Fallback = ({ error }) => {
    return <span>{error.message}</span>;
  };

  const children = <div>{'Children'}</div>;

  const FailsToRender = () => {
    useEffect(() => {
      throw new Error('whoops I failed');
    });

    return <div>{'Hello World'}</div>;
  };

  const WillAccessInvalidProperties = ({ trackingData }) => {
    return <div>{trackingData.trackingEvent.packageDeliveryDate}</div>;
  };

  const render = renderWrap(Try, { defaultProps: { fallback, children } });

  let err = null;

  beforeEach(() => {
    // TODO
    // Figure out a better way to squelch these errors :(
    err = console.error;
    console.error = () => {};
  });

  afterEach(() => {
    console.error = err;
  });

  test('it should render children if no error', () => {
    const { getByText } = render();
    expect(getByText('Children')).toBeTruthy();
  });

  test('it should render failsafe if error', () => {
    const { getByText } = render({
      children: <FailsToRender />,
    });

    expect(getByText('Failsafe')).toBeTruthy();
  });

  test('it should render component-type failsafes', () => {
    const { getByText } = render({
      fallback: Fallback,
      children: <FailsToRender />,
    });

    expect(getByText('whoops I failed')).toBeTruthy();
  });

  test('it should capture TypeErrors', () => {
    const trackingData = {};

    const { getByText } = render({
      children: <WillAccessInvalidProperties trackingData={trackingData} />,
    });

    expect(getByText('Failsafe')).toBeTruthy();
  });
});
