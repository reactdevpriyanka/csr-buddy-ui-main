import NavigationContext from '@/components/NavigationContext';
import { renderWrap } from '@/utils';
import ActivityContext from './ActivityContext';

const DefaultNavigationContext = {
  //default values
  prevRoute: null,
  prevRouteTag: null,
  setPrevRoute: () => {},
  setPrevRouteTag: () => {},
  storePrevRoute: () => {},
  resetPrevRoute: () => {},
};

export function renderActivity(
  ActivityComponent,
  {
    activity = {},
    props = {},
    defaultProps = {},
    testId = null,
    navigationContext = DefaultNavigationContext,
  } = {},
) {
  const TestableActivityComponent = () => (
    <NavigationContext.Provider value={navigationContext}>
      <ActivityContext.Provider value={activity}>
        <ActivityComponent />
      </ActivityContext.Provider>
    </NavigationContext.Provider>
  );

  return renderWrap(TestableActivityComponent, { defaultProps, testId });
}
