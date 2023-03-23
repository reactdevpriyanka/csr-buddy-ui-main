import { cloneElement, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import TooltipPrimary from '@components/TooltipPrimary';
// eslint-disable-next-line import/no-unresolved
import { defaultDataValues, useCustServices } from '@hooks/useCustServices';
import { SNACKVARIANTS } from '@components/SnackMessage/SnackMessage';
import { Box, Divider } from '@material-ui/core';
import { useFeature } from '@/features';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(1.5)} 0`,
  },
  title: {
    ...theme.fonts.h2,
    color: theme.palette.blue.dark,
  },
  tooltipContainer: {
    '&:not(:last-of-type)': {
      marginRight: theme.spacing(1),
    },
  },

  box: {
    flexDirection: 'column',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  disabled: {
    opacity: 0.4,
  },
  icon: {
    height: theme.utils.fromPx(48),
    borderRadius: '20px',
  },
  divider: {
    marginTop: theme.utils.fromPx(28),
  },
}));

const CustomerServices = () => {
  const { data: custServicesData = [], error } = useCustServices();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      enqueueSnackbar({
        key: 'cust-service',
        variant: SNACKVARIANTS.ERROR,
        message: error?.response?.data || error?.message,
      });
    }
  }, [error, enqueueSnackbar]);

  const features = {
    VETDIET: useFeature('feature.explorer.vetDietEnabled'),
    RXORDER: useFeature('feature.explorer.rxEnabled'),
    AUTOSHIP: useFeature('feature.explorer.autoshipEnabled'),
  };

  const isFeatureEnabled = (name) => {
    if (name === 'AUTOSHIP') {
      return features.AUTOSHIP;
    }
    if (name === 'RX_ORDER') {
      return features.RXORDER;
    }
    if (name === 'VET_DIET') {
      return features.VETDIET;
    }
    return false;
  };

  const isPresent = (custServicesValues, defaultServices) => {
    return custServicesValues.some((data) => data.name === defaultServices.name);
  };

  const csDataValues = Object.values(custServicesData);
  const displayIcons = Object.values(defaultDataValues);

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Divider className={classes.divider} />
      <h3 className={classes.title}>Chewy Services</h3>
      <Box className={classes.box} alignItems="center">
        {displayIcons.map(
          (i) =>
            isFeatureEnabled(i.name) && (
              <div key={i.name} className={classes.tooltipContainer}>
                {isPresent(csDataValues, i) ? (
                  <TooltipPrimary title={i.description} aria-label="add" placement="top" arrow>
                    <div>{cloneElement(i.icon, { className: classes.icon })}</div>
                  </TooltipPrimary>
                ) : (
                  <div className={classes.disabled} data-testid="disabledIcon">
                    {cloneElement(i.icon, { className: classes.icon })}
                  </div>
                )}
              </div>
            ),
        )}
      </Box>
      <Divider className={classes.divider} />
    </div>
  );
};

CustomerServices.propTypes = {};

export default CustomerServices;
