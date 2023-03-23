import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/core/styles';
import { Slide } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import theme from '@/theme';
import SnackMessage from '@components/SnackMessage';
import RightModalProvider from './RightModalProvider';
import NavigationProvider from './NavigationProvider';
import BreadcrumbProvider from './BreadcrumbProvider';

const Providers = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        TransitionComponent={Slide}
        content={(key, { messageHeader, messageSubheader, listItems, variant, link }) => (
          <SnackMessage
            variant={variant}
            id={key}
            messageHeader={messageHeader}
            messageSubheader={messageSubheader}
            listItems={listItems}
            link={link}
          />
        )}
      >
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <BreadcrumbProvider>
            <NavigationProvider>
              <RightModalProvider>{children}</RightModalProvider>
            </NavigationProvider>
          </BreadcrumbProvider>
        </MuiPickersUtilsProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

Providers.propTypes = {
  children: PropTypes.node,
};

export default Providers;
