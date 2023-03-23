# CSR Buddy Feature Flags

This guide will walk you through how to implement a feature behind a toggle. You have several options at your disposal: a hook and a component. The choice you make is ultimately up to you. This API is intended to be developer friendly and to be flexible enough to adapt to many different use-cases. Ultimately, the look and feel of your code and your component is up to you!

## Getting Started

First, we assume you have a component that is ready to be "feature gated." One relevant example would be a brand new screen for CSR Buddy.

Let's start with a NextJS page component:

```js
import useSomeContentHook from '@/hooks/useSomeContentHook';

export default function MyBrandNewScreen() {
  const content = useSomeContentHook();
  return (
    <div>
      <h1>{'My Title'}</h1>
      <div>
        {content}
      </div>
    </div>
  );
}
```

Boom! We have a page. Now, we need to link to this page from another component but we only want to show this link if the feature is enabled for go-live.

That is the problem this API intends to solve for you.

Let's assume we have a toggle called `spicyNewProductFeature` in our configuration and that you've determined that the component you're linking to your new screen from exists in a file called `MyNavigationComponent.js`. Here's an example of how we would implement this *without* a toggle:

**MyNavigationComponent.js**

```js
import Link from 'next/link';

const MyNavigationComponent = () => {
  return (
    <nav>
      <Link href="/">{'Home'}</Link>
      <Link href="/my-brand-new-screen">{'My Brand New Screen'}</Link>
    </nav>
  );
};
```

This will work! But, we're not gating this behind a feature toggle just yet.

Look at the below sections for examples of how to use the `features` API to provide this functionality.

### Using a Hook

We can use the `useFeature` hook like so:

**MyNavigationComponent.js**

```js
import Link from 'next/link';
import { useFeature } from '@/features';

const MyNavigationComponent = () => {
  const mySpicyProductFeature = useFeature('spicyNewProductFeature');
  return (
    <nav>
      <Link href="/">{'Home'}</Link>
      {mySpicyProductFeature && <Link href="/my-brand-new-screen">{'My Brand New Screen'}</Link>}
    </nav>
  );
};
```

We have the option to use the raw `boolean` value straight from the configuration. This pattern is particularly useful while writing custom hooks of your own that will interact with a new service endpoint, for example. Some may choose to use this hook as in the above example and that's fine. Hooks can be powerful and this hook is no different! Use it how you see fit.

### Using the <FeatureFlag /> Component

While the above example is fine for a basic integration with the configuration service we recommend that if you're writing JSX that is dependent upon a feature toggle that you utilize the `<FeatureFlag />` component.

Here's an example:

**MyNavigationComponent.js**

```js
import { FeatureFlag } from '@/features';

const MyNavigationComponent = () => {
  return (
    <nav>
      <Link href="/">{'Home'}</Link>
      <FeatureFlag flag="spicyNewProductFeature">
        <Link href="/my-brand-new-screen">{'My Brand New Screen'}</Link>
      </FeatureFlag>
    </nav>
  );
};
```

In the above example the only value of the `flag` property that will result in a render is `true`.

If the feature flag is not present, is set to `false` or the request for the feature flags results in an error being thrown, this component will fail closed and result in its children not being rendered.

### Adding Your Feature Flag to the App Config

The application config containing all feature flags is returned from the `/gateway/configuration` endpoint. 

To get your feature flag into that API response, start by visiting [Chronus (stg)](https://pet-cronus.shss.chewy.com/athena/application/non-prd/csrb-gateway/stg).

First, add your flag under a namespaced key. For example, a new flag for displaying order payment details could be called `feature.explorer.orderPaymentDetailEnabled`.

Next, set your flag's type to `Object` and give it this value:

``` json
{"default":true,"alpha":true,"beta":false,"stable":false}
```

Now add your flag's key to [configbaseKeys](https://pet-cronus.shss.chewy.com/athena/application/non-prd/csrb-gateway/stg/configbaseKeys) to include it in the API response from `/gateway/configuration`.

Your changes should propagate after about 5 minutes, at which point your new flag will appear in the app config.

## API Reference

### useFeature

`useFeature` accepts a feature toggle as a string to resolve. It will always return a `Boolean`.

```js
useFeature(feature: String): Boolean
```

### <FeatureFlag />

`<FeatureFlag />` accepts a `flag` property as a string and will render its children if this resolves to `true`.

For a `false`y value this component will attempt to render an optional `fallback` or `null`.

```js
<FeatureFlag flag={string} fallback={node?}>
  {children}
</FeatureFlag>
```
