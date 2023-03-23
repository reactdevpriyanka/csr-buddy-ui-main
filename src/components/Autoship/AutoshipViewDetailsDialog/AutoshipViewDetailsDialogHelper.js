/* eslint-disable react/jsx-props-no-spreading */
import cn from 'classnames';
import { styled } from '@material-ui/core/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import getThumbnail from '@utils/thumbnails';
import { snakeCaseToTitleCase } from '@/utils/string';

export const Accordion = styled((props) => <MuiAccordion elevation={0} square {...props} />)(
  ({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  }),
);

export const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(270deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.utils.fromPx(5),
    marginTop: 0,
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    alignSelf: 'start',
    transform: 'rotate(90deg)',
  },
}));

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#E5E5E5',
    color: '#031657',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: `${theme.utils.fromPx(14)}`,
  },
}));

export const getNameValue = (testId, name, value, classes, nameStyle, fontStyle) => {
  return (
    <div className={classes.nameValue} id="nameValueContainer">
      <span
        id="nameContainer"
        data-testid={`${testId}_name`}
        className={cn(nameStyle, classes.displayName)}
      >
        {name}
      </span>
      <span
        id="valueContainer"
        data-testid={`${testId}_value`}
        className={cn(fontStyle, classes.displayValue)}
      >
        {value}
      </span>
    </div>
  );
};

export const getImg = ({ thumbnail, classes, returnItem }) => {
  return (
    <figure data-testid="product:thumbnail" className={classes.figure}>
      <div className={classes.container}>
        {returnItem && (
          <div className={classes.imgOverlay}>
            {snakeCaseToTitleCase(returnItem.reasonCategory)}
          </div>
        )}
        <img
          className={cn(classes.thumbnail, { [classes.thumbnailWithBadge]: returnItem })}
          src={getThumbnail(thumbnail)}
          alt=""
        />
      </div>
    </figure>
  );
};
