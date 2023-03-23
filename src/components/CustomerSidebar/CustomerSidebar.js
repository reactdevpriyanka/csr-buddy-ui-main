import { createRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import CustomerBrief from './CustomerBrief';
import CustomerOverview from './CustomerOverview';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    overflowY: 'auto',
    position: 'fixed',
    zIndex: 100,
    border: '1px solid #F5F5F5',
    backgroundColor: theme.palette.background.paper,
    width: theme.utils.constants.customerContentWidth,
  },
  divider: {
    width: '100%',
  },
}));

export const CustomerSidebar = () => {
  const classes = useStyles();
  const router = useRouter();
  const ref = createRef();

  useEffect(() => {
    const scrollTop = () => {
      if (ref.current) {
        ref.current.scroll(0, 0);
      }
    };

    router.events.on('routeChangeComplete', scrollTop);
    return () => router.events.off('routeChangeComplete', scrollTop);
  }, [ref, router.events]);

  return (
    <section className={classes.container} data-testid="customer-sidebar" ref={ref}>
      <Header>
        <CustomerOverview />
      </Header>
      <CustomerBrief />
    </section>
  );
};

CustomerSidebar.propTypes = {};

export default CustomerSidebar;
