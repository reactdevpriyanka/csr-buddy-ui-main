import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CssBaseLine from '@material-ui/core/CssBaseline';
import CustomerSidebarLayout from '@components/Layout/CustomerSidebarLayout';
import EnvProvider from '@/components/EnvContext';
import Providers from '@components/Providers';
import '@/init';
import useFeature from '@/features/useFeature';
import useAthena from '@/hooks/useAthena';
import BreadCrumbNavBar from '@/components/BreadCrumbs/BreadCrumbNavBar';
import { useRouter } from 'next/router';
import { getBreadcrumbByRootTag, isCrumbCoreNavByTag } from '@/utils/breadcrumbUtils';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.remove();
    }
  }, []);

  const [isInitialLoad, setInitialLoad] = useState(true);
  const { getLang } = useAthena();
  const isStandaloneCsrbEnabled = useFeature('feature.explorer.standaloneCsrbEnabled');
  const oracleRedirectUrl = getLang('oracleRedirectUrl');


  // We have to do this to make sure we are getting the needed values from Athena
  // Because this is a high level component we have no other way of checking
  // right now.
  useEffect(() => {
    if (typeof window !== typeof undefined && oracleRedirectUrl && isInitialLoad) {
      setInitialLoad(false);

      // eslint-disable-next-line unicorn/no-lonely-if
      if (
        !/localhost/.test(window.location.href) &&
        !/standalone/.test(window.location.href) &&
        window === window.top &&
        !isStandaloneCsrbEnabled
      ) {
        window.location = oracleRedirectUrl;
      }
    }
  }, [isStandaloneCsrbEnabled, oracleRedirectUrl, isInitialLoad]);

  const getLayout = Component.getLayout || (() => CustomerSidebarLayout);

  const Layout = getLayout();

  const router = useRouter();
  const customerId = router.query.id;
  const tag = router.pathname.split("/").pop();
  const isCoreNav = isCrumbCoreNavByTag(tag);
  const breadcrumb = isCoreNav ? getBreadcrumbByRootTag({tag, customerId}) : {};

  return (
    <EnvProvider>
      <Providers>
        <CssBaseLine />
        <Layout>
          { isCoreNav && <BreadCrumbNavBar breadcrumb={breadcrumb} />}
          <Component {...pageProps} /> {/* eslint-disable-line react/jsx-props-no-spreading */}
        </Layout>
      </Providers>
    </EnvProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
