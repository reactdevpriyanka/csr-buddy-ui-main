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
} from '@components/Autoship/AutoshipViewDetailsDialog/AutoshipViewDetailsDialogHelper';

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
      padding: 0,
      minHeight: theme.utils.fromPx(5),
      height: theme.utils.fromPx(20),
    },
    '& .MuiAccordionDetails-root': {
      border: 'none',
      padding: 0,
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
    backgroundColor: '#DBEBF9',
    display: 'grid',
    gridTemplateColumns: '40% 40% 20%',
    borderBottomColor: 'white',
    borderBottomStyle: 'solid',
    borderBottomWidth: '5px',
    paddingLeft: theme.utils.fromPx(10),
    paddingTop: theme.utils.fromPx(5),
    paddingBottom: theme.utils.fromPx(5),
    paddingRight: theme.utils.fromPx(10),
    marginTop: theme.utils.fromPx(10),
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
  promotionValueValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(21),
    color: '#121212',
    textAlign: 'end',
  },
  promotionLabelValuePanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  promotionValueColumn: {
    width: theme.utils.fromPx(160),
  },
  nameValue: {
    display: 'grid',
    gridTemplateColumns: '80% 20%',
    width: '100%',
    marginTop: theme.utils.fromPx(4),
  },
  displayName: {
    display: 'flex',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontStyle: 'medium',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(18),
    color: '#666666',
  },
  displayValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(19),
    color: '#333333',
    float: 'right',
    textAlign: 'end',
  },
  adjustmentName: {
    color: '#031657',
  },
  fontStyle: {
    fontWeight: '700',
  },
}));

const OrderAdjustmentDetails = ({
  disableAdjustments = false,
  promotions = [],
  adjustmentTotal = '',
  expand = false,
  className = '',
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
        className={className}
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
            {promotions?.map((promotion) => (
              <div key={promotion.code} className={classes.promotionPanel}>
                <div className={classes.promotionLabelValuePanel}>
                  <span className={classes.promotionLabel}>Promotion</span>
                  <span
                    data-testid={`${promotion.code}_promotionName`}
                    className={classes.promotionValue}
                  >
                    {promotion.name ?? 'N/A'}
                  </span>
                </div>
                <div className={classes.promotionLabelValuePanel}>
                  <span className={classes.promotionLabel}>Code</span>
                  <span
                    data-testid={`${promotion.code}_promotionCode`}
                    className={classes.promotionValue}
                  >
                    {promotion.code ?? 'N/A'}
                  </span>
                </div>
                <div className={cn(classes.promotionLabelValuePanel, classes.promotionValueValue)}>
                  <span className={classes.promotionLabel}>Value</span>
                  <span
                    data-testid={`${promotion.value}_promotionValue`}
                    className={classes.promotionValueValue}
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

OrderAdjustmentDetails.propTypes = {
  disableAdjustments: PropTypes.bool,
  promotions: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      promotion: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
  expand: PropTypes.bool,
  adjustmentTotal: PropTypes.string,
  className: PropTypes.string,
};

export default OrderAdjustmentDetails;
