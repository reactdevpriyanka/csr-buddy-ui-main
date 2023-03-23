# Try Component

The `<Try />` component is useful for the following scenarios:

- A complex object has been passed as a `prop` but could have properties that are undefined.
  Naturally, a fallback is desired in these situations. Capturing the issue would also
  be desirable.
- An error could occur within side-effects of the component's children.
  Naturally, a fallback is desired while also capturing the error.

`<Try />` is an error-boundary component that captures errors and reports the exception via the DataDog logs.

## Usage

Presently, you can utilize the `fallback` property to pass either of:
- A component type (i.e. if you have a component named Fallback)
- A node with any amount of children

With respect to case (1):

```
import Try from '@components/Try';
import YourFallBackComponent from '@components/YourFallBackComponent';

const ComponentThatMightHaveErrors = () => {
  return (
    <Try fallback={YourFallBackComponent}>
      {...}
    </Try>
  );
};
```

**NOTE**: In the example above `YourFallBackComponent` would receive the caught exception as the `error` property.

With respect to case (2):

```
import Try from '@components/Try';

const ComponentThatMightHaveErrors = () => {
  return (
    <Try fallback={<div>{'Unknown'}</div>}>
      ...
    </Try>
  );
};
```
