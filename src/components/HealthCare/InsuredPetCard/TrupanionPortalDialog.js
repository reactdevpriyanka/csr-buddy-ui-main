import BaseDialog from '@/components/Base/BaseDialog';
import { makeStyles } from '@material-ui/core';
import { Accordion, AccordionSummary } from '@mui/material';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import useAthena from '@/hooks/useAthena';
import InsuredPetCard from './InsuredPetCard';

const useStyles = makeStyles((theme) => ({
  baseDialog: {
    '& .MuiPaper-root': {
      maxWidth: '1180.01px',
    },
    '& .MuiDialogTitle-root': {
      borderBottom: '2px solid #EEEEEE',
    },
    '& .MuiPaper-elevation1': {
      boxShadow: 'none',
    },
    '& .MuiDialogContent-root': {
      padding: '0rem 1rem 1rem 1rem !important',
    },
  },
  dialogTitle: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '900',
    fontSize: '20px',
    lineHeight: '28px',
    color: '#121212',
  },
  title: {
    color: '#333333',
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(24),
    fontWeight: 700,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    letterSpacing: '0.01em',
  },
  accordionComponent: {
    '& .MuiPaper-root.MuiAccordion-root': {
      border: 'none',
    },
    '& .MuiAccordionSummary-root': {
      padding: `${theme.utils.fromPx(0)} ${theme.utils.fromPx(0)}`,
    },
    '& .MuiAccordionDetails-root': {
      padding: `${theme.utils.fromPx(0)} ${theme.utils.fromPx(0)}`,
      paddingBottom: theme.utils.fromPx(0),
    },
    '& .MuiCollapse-wrapperInner': {
      border: 'none',
    },
  },
  iframe: {
    display: 'block',
    width: '1124px',
    height: '671px',
    border: 'none',
    flex: 'none',
    order: '0',
    flexGrow: '0',
  },
}));

const TrupanionPortalDialog = ({ trupanionPolicy = [], open, onClose, trupanionPortalURL }) => {
  const classes = useStyles();

  const { getLang } = useAthena(); // athena config
  return (
    <BaseDialog
      contentClassName={classes.baseDialog}
      okLabel={getLang('viewTrupanionPortalBtn', { fallback: 'Leave Trupanion Portal' })}
      onOk={onClose}
      onClose={onClose}
      showCloseButton={false}
      hideOutSideClick={true}
      open={open}
      dialogTitle={
        <span className={classes.dialogTitle}>
          {getLang('trupanionPortalTitle', { fallback: 'Trupanion Portal' })}
        </span>
      }
    >
      <Accordion
        data-testid="insuredpets:accordion"
        defaultExpanded
        className={classes.accordionComponent}
      >
        <AccordionSummary
          data-testid="insuredpets:accordion:summary"
          expandIcon={<ExpandMoreIcon sx={{ color: 'black' }} />}
        >
          <div className={classes.title}>
            {getLang('insuredPetsLabel', { fallback: 'Insured Pets' })} (
            {Number.parseInt(trupanionPolicy?.length)})
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ pb: 4 }}>
          <div data-testid="insuredpets:accordion:details">
            {trupanionPolicy?.map((pet) => (
              <Fragment key={pet?.id}>
                <InsuredPetCard pet={pet} />
              </Fragment>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
      <iframe
        className={classes.iframe}
        id="standalone_csrb1.0-iframe"
        title="Standalone CSRB1.0"
        width="100%"
        height="100%"
        src={trupanionPortalURL}
      />
    </BaseDialog>
  );
};

TrupanionPortalDialog.propTypes = {
  trupanionPolicy: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  trupanionPortalURL: PropTypes.string,
};

export default TrupanionPortalDialog;
