import PropTypes from 'prop-types';
import { CircularProgress, Grid, Skeleton, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core';
import BaseDialog from '@/components/Base/BaseDialog';
import React, { useState, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import QuantitySelector from '@/components/Base/MultiItemTable/common/MultiItemQuantitySelector';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useAthena from '@/hooks/useAthena';
import useReturnDetails from '@/hooks/useReturnDetails';

const useStyles = makeStyles((theme) => ({
  tableHeader: {
    borderRadius: theme.utils.fromPx(4),
    padding: `${theme.utils.fromPx(8)} ${theme.utils.fromPx(16)}`,
    backgroundColor: '#EEEEEE',
  },
  tableRow: {
    padding: `${theme.utils.fromPx(8)} ${theme.utils.fromPx(16)}`,
  },
  columnHeader: {
    fontSize: theme.utils.fromPx(12),
    fontWeight: 700,
  },
  columnValue: {
    fontSize: theme.utils.fromPx(12),
  },
  dialogContent: {
    minWidth: theme.utils.fromPx(600),
  },
}));

const CreateNewLabelsDialog = ({ isOpen, handleClose, returnId, orderId }) => {
  const classes = useStyles();

  const { getLang } = useAthena();

  const { enqueueSnackbar } = useSnackbar();

  const { useReturnLabels, createNewReturnLabels } = useReturnDetails();

  const { captureInteraction } = useAgentInteractions();

  const { data: labels, error } = useReturnLabels(returnId);

  const [numberOfLabels, setNumberOfLabels] = useState(null);

  const [requestInProgress, setRequestInProgress] = useState(false);

  const pageName = 'Create New Labels Dialog - VT';

  const unqiueDestinations = useMemo(() => {
    if (labels) {
      return [
        ...new Map(
          labels
            .map((label) => label.destination)
            .map((destination) => [destination['code'], destination]),
        ).values(),
      ];
    }
    return null;
  }, [labels]);

  const handleLabelSubmit = () => {
    setRequestInProgress(true);
    let labelDestinations = [];

    for (const [key, value] of Object.entries(numberOfLabels)) {
      const destination = unqiueDestinations.find(({ code }) => code === key);
      labelDestinations.push({ numberOfPackages: value, destination });
    }

    const body = { destinations: labelDestinations };
    createNewReturnLabels(returnId, body)
      .then(() =>
        captureInteraction({
          type: 'CREATED_NEW_LABELS',
          subjectId: orderId,
          action: 'UPDATE',
          currentVal: body,
          prevVal: {},
        }),
      )
      .then(() => {
        enqueueSnackbar({
          messageHeader: 'Success',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: `New label(s) have been created and sent to customer`,
        });
        handleClose();
      })
      .catch(() => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: `Failed to submit create new labels`,
        });
      })
      .finally(() => {
        setRequestInProgress(false);
      });
  };

  if (!numberOfLabels && labels?.length > 0) {
    let initialMap = {};
    let destinations = labels
      .filter((label) => label?.destination)
      .map((label) => label.destination);

    for (const { code } of destinations) {
      initialMap[code] = 1;
    }

    setNumberOfLabels(initialMap);
  }

  return (
    <BaseDialog
      open={isOpen}
      onClose={handleClose}
      closeLabel="Cancel"
      pageName={pageName}
      okLabel={
        !requestInProgress ? (
          'Create and send to customer'
        ) : (
          <CircularProgress size={26} sx={{ color: 'white ' }} />
        )
      }
      onOk={handleLabelSubmit}
      greyTitleBackground
      maxWidth="sm"
      fullWidth={true}
      dialogTitle={
        <Typography sx={{ color: '#031657', fontSize: '20px' }} variant="h5">
          {getLang('createNewPackageLabelText', { fallback: 'Create New Package Label' })}
        </Typography>
      }
    >
      <div className={classes.tableHeader}>
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <span className={classes.columnHeader}>
              {getLang('destinationText', { fallback: 'Destination' })}
            </span>
          </Grid>
          <Grid item xs={4}>
            <span className={classes.columnHeader}>
              {getLang('addressLabel', { fallback: 'Address' })}
            </span>
          </Grid>
          <Grid item xs={4} textAlign="center">
            <span className={classes.columnHeader}>
              {getLang('ofLabels', { fallback: '# of Labels' })}
            </span>
          </Grid>
        </Grid>
      </div>
      <div className={classes.tableRow}>
        <Grid container spacing={2}>
          {unqiueDestinations?.map(({ code, address }) => (
            <React.Fragment key={code}>
              <Grid item xs={4} alignItems="center">
                <span data-testid={`destination:${code}`} className={classes.columnValue}>
                  {code ?? 'N/A'}
                </span>
              </Grid>
              <Grid item xs={4} alignItems="center">
                <span data-testid={`address:${address?.street1}`} className={classes.columnValue}>
                  {address?.city}, {address?.state}, {address?.postcode}, {address?.country}
                </span>
              </Grid>
              <Grid item xs={4} justifyContent="center">
                <QuantitySelector
                  error={numberOfLabels?.[code] === 0}
                  max={100}
                  initialQuantity={1}
                  showTotalCount={false}
                  onUpdate={(returnQuantity) =>
                    setNumberOfLabels({
                      ...numberOfLabels,
                      [code]: returnQuantity,
                    })
                  }
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </div>
      {!labels && !error && (
        <>
          <Skeleton sx={{ mt: 0.5 }} animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </>
      )}
    </BaseDialog>
  );
};

CreateNewLabelsDialog.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  returnId: PropTypes.string,
  orderId: PropTypes.string,
};

export default CreateNewLabelsDialog;
