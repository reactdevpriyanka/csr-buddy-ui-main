import cn from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import { currencyFormatter } from '@/utils/string';
import {
  AccordionDetails,
  AccordionSummary,
  Accordion,
  getNameValue,
} from './AutoshipViewDetailsDialogHelper';

const useStyles = makeStyles((theme) => ({
  accordionComponent: {
    '& .MuiAccordion-root': {
      border: 'none',

      '& .Mui-disabled': {
        backgroundColor: 'unset',
        opacity: 'unset',
      },
    },
    '& .MuiAccordion-root.Mui-disabled': {
      backgroundColor: 'unset',

      '& .MuiAccordionSummary-expandIconWrapper': {
        color: '#cccccc',
      },
    },
    '& .MuiAccordionSummary-root': {
      paddingLeft: 0,
      paddingRight: 0,
      minHeight: theme.utils.fromPx(5),
      height: theme.utils.fromPx(20),
      marginTop: theme.utils.fromPx(5),
      marginBottom: theme.utils.fromPx(5),
    },
    '& .MuiAccordionDetails-root': {
      border: 'none',
      paddingTop: 0,
      paddingLeft: 0,
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: '#031657',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.utils.fromPx(5),
      marginTop: theme.utils.fromPx(5),
    },
  },
  promotionPanel: {
    backgroundColor: '#DDF0FF',
    display: 'grid',
    gridTemplateColumns: '40% 40% 20%',
    width: '100%',
    borderBottomColor: 'white',
    borderBottomStyle: 'solid',
    borderBottomWidth: '5px',
    paddingLeft: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingRight: '10px',
  },
  promotionLabel: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(16),
    color: '#666666',
  },
  promotionValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(21),
    color: '#121212',
  },
  promotionLabelValuePanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  promotionValueColumn: {
    textAlign: 'end',
  },
  nameValue: {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    width: '100%',
    marginTop: theme.utils.fromPx(4),
  },
  displayName: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontStyle: 'medium',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(18),
    color: '#666666',
  },
  displayValue: {
    textAlign: 'end',
    marginRight: theme.utils.fromPx(15),
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontStyle: 'bold',
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(19),
    color: '#333333',
  },
  adjustmentName: {
    color: '#031657',
  },
}));

const AutoshipAdjustmentDetails = ({
  disableAdjustments = false,
  adjustmentTotal = '',
  promotions = [],
  expand = false,
}) => {
  const classes = useStyles();
  const [panelExpanded, setPanelExpanded] = useState(expand);
  const handleChange = (panel) => (event, newExpanded) => {
    setPanelExpanded(!panelExpanded);
  };

  return (
    <div className={classes.accordionComponent}>
      <Accordion
        data-testid="autoship:payment:viewdetails:adjustment:accordion"
        disableGutters
        disabled={disableAdjustments}
        expanded={panelExpanded}
        onChange={handleChange()}
      >
        <AccordionSummary
          data-testid="autoship:payment:viewdetails:adjustment:accordion:summary"
          aria-controls="panel1d-content"
          id="panel1d-header"
        >
          {getNameValue(
            'totalAdjustment',
            'Adjustment(s) Applied',
            adjustmentTotal,
            classes,
            disableAdjustments ? '' : classes.adjustmentName,
          )}
        </AccordionSummary>
        <AccordionDetails>
          <div data-testid="autoship:payment:viewdetails:adjustment:accordion:details">
            {promotions.map((promotion) => (
              <div key={promotion.code} className={classes.promotionPanel}>
                <div className={classes.promotionLabelValuePanel}>
                  <span className={classes.promotionLabel}>Promotion</span>
                  <span
                    data-testid={`${promotion.code}_promotionName`}
                    className={classes.promotionValue}
                  >
                    {promotion.name}
                  </span>
                </div>
                <div className={classes.promotionLabelValuePanel}>
                  <span className={classes.promotionLabel}>Code</span>
                  <span
                    data-testid={`${promotion.code}_promotionCode`}
                    className={classes.promotionValue}
                  >
                    {promotion.code}
                  </span>
                </div>
                <div className={cn(classes.promotionLabelValuePanel, classes.promotionValueColumn)}>
                  <span className={classes.promotionLabel}>Value</span>
                  <span
                    data-testid={`${promotion.value}_promotionValue`}
                    className={classes.promotionValue}
                  >
                    {currencyFormatter(promotion.amount.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

AutoshipAdjustmentDetails.propTypes = {
  disableAdjustments: PropTypes.bool,
  adjustmentTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  promotions: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      promotion: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
  expand: PropTypes.bool,
};

export default AutoshipAdjustmentDetails;
