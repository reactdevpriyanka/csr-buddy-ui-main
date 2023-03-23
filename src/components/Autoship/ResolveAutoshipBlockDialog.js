import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { Typography } from '@material-ui/core';
import { titleCaseToSnakeCase, snakeCaseToTitleCase } from '@/utils/string';
import { useSWRConfig } from 'swr';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import cn from 'classnames';
import { BaseDialog } from '@components/Base';
import useOrder from '@/hooks/useOrder';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialogActions-root': {
      padding: `${theme.utils.fromPx(16)} ${theme.utils.fromPx(28)} ${theme.utils.fromPx(
        16,
      )} ${theme.utils.fromPx(28)}`,
    },
    '& .MuiDialog-paperWidthSm': {
      maxWidth: `${theme.utils.fromPx(713)}`,
      height: `${theme.utils.fromPx(270)}`,
    },
    '& .MuiButtonBase-root': {
      height: `${theme.utils.fromPx(42)}`,
      width: `${theme.utils.fromPx(96)}`,
    },
    '& .MuiInputBase-inputMultiline': {
      height: `${theme.utils.fromPx(50)}`,
    },
    '& .MuiFormLabel-root': {
      marginLeft: `${theme.utils.fromPx(28)}`,
    },
  },
  title: {
    ...theme.fonts.h3,
    color: theme.palette.blue.dark,
    fontWeight: '500',
    paddingLeft: `${theme.utils.fromPx(28)}`,
  },
  text: {
    color: '#121212',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: theme.utils.fromPx(23),
    fontSize: theme.utils.fromPx(20),
    marginBottom: `${theme.utils.fromPx(24)}`,
  },
}));

const ResolveAutoshipBlockDialog = ({
  resolveBlockOrderDialogOpen,
  blockReason,
  blockId,
  blockComment,
  setParentClose,
  id,
}) => {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(resolveBlockOrderDialogOpen);

  const { enqueueSnackbar } = useSnackbar();

  const { mutate } = useSWRConfig();

  const { resolveAutoshipOrder } = useOrder(id);

  const pageName = 'Resolve Autoship Block Dialog - VT';

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setParentClose();
  }, [setDialogOpen, setParentClose]);

  const revalidateOrderData = () => {
    Promise.all([mutate(`/api/v3/autoship-activities/${id}`)]);
  };

  const submitOrderBlock = useCallback(() => {
    const body = {
      reason: titleCaseToSnakeCase(blockReason),
    };
    resolveAutoshipOrder(id, body)
      .then(() => {
        revalidateOrderData();
        handleDialogClose();
        enqueueSnackbar({
          messageHeader: 'Success!',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: `Resolved autoship order block ${snakeCaseToTitleCase(blockReason)}`,
          persist: false,
        });
      })
      .catch((error) => {
        enqueueSnackbar({
          messageHeader: 'Error',
          messageSubheader: 'Unable to resolve a block',
          persist: false,
          variant: SNACKVARIANTS.ERROR,
        });
      });
  }, [enqueueSnackbar, revalidateOrderData, handleDialogClose, id, resolveAutoshipOrder]);

  return (
    <BaseDialog
      data-testid={`order:resolve-block-dialog-${id}`}
      open={dialogOpen}
      onClose={handleDialogClose}
      closeLabel="No"
      okLabel="Yes"
      onOk={submitOrderBlock}
      hideCloseIcon={true}
      dialogTitle={<Typography variant="h5">{`Confirm Resolve`}</Typography>}
      contentClassName={cn(classes.root)}
      pageName={pageName}
    >
      <div className={classes.text}>
        {' '}
        Are you sure you want to resolve block:{' '}
        <span style={{ fontWeight: 'bold' }}>{snakeCaseToTitleCase(blockReason)}</span> ?
      </div>
    </BaseDialog>
  );
};

ResolveAutoshipBlockDialog.propTypes = {
  resolveBlockOrderDialogOpen: PropTypes.bool.isRequired,
  setParentClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  blockReason: PropTypes.string.isRequired,
  blockComment: PropTypes.string.isRequired,
  blockId: PropTypes.string.isRequired,
};

export default ResolveAutoshipBlockDialog;
