/* eslint-disable react/jsx-props-no-spreading */
import cn from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import useGwfContext from '@/hooks/useGwfContext';
import useFeature from '@/features/useFeature';

const alignments = {
  HORIZONTAL: 'inline-block',
  VERTICAL: 'block',
};

const useStyles = makeStyles((theme) => ({
  root: { marginBottom: theme.spacing(1.25) },
  bolded: { fontSize: theme.fonts.size.md, fontWeight: 'bold', marginBottom: theme.spacing(0.5) },
  title: { marginBottom: 0, fontSize: theme.fonts.size.md, fontWeight: 400 },
  label: { marginBottom: theme.spacing(0.5) },
  none: { display: 'none' },
  block: { display: 'block' },
  color: { color: theme.palette.primary.main },
  'inline-block': { display: 'inline-block' },
  headerPriority1: {
    fontSize: theme.utils.fromPx(24),
    fontWeight: 500,
    lineHeight: theme.utils.fromPx(32),
  },
  headerPriority2: {
    fontSize: theme.utils.fromPx(18),
    fontWeight: 500,
    lineHeight: theme.utils.fromPx(24),
  },
  headerPriority3: {
    fontSize: theme.utils.fromPx(16),
    fontWeight: 500,
    lineHeight: theme.utils.fromPx(22),
  },
  headerPriority4: {
    fontSize: theme.utils.fromPx(16),
    fontWeight: 400,
    lineHeight: theme.utils.fromPx(22),
  },
  primary: { color: theme.palette.primary.main },
  secondary: { color: '#1C49C2' },
  info: { color: theme.palette.success.main },
  warn: { color: theme.palette.yellow.medium },
  error: { color: theme.palette.error.main },
}));

const testId = `gwf-node:label`;

const LabelNode = ({
  visible = true,
  label,
  subLabel,
  alignment = 'HORIZONTAL',
  emphasis = '',
  headerPriority = '',
  subLabelEmphasis = '',
  subLabelPriority = '',
}) => {
  const classes = useStyles();
  const alignmentClass = classes?.[alignments?.[alignment]];
  const labelEmphasisClass = classes?.[emphasis];
  const labelPriorityClass = classes?.[`headerPriority${headerPriority}`];
  const subLabelPriorityClass = classes?.[`headerPriority${subLabelPriority}`];
  const subLabelEmphasisClass = classes?.[subLabelEmphasis];
  const enableCRDF = useFeature('feature.explorer.coloradoRetailDeliveryFeeEnabled');
  const {
    summaryDetails: { hasCRDF },
  } = useGwfContext();

  return (
    <div data-testid={testId} className={cn(classes.root, !visible && classes.none)}>
      <Typography
        variant="h1"
        className={cn([classes.title, alignmentClass, labelEmphasisClass, labelPriorityClass])}
      >
        {label}
        {label === 'Total Refund' && hasCRDF && enableCRDF && <span> *</span>}
      </Typography>
      {subLabel && (
        <span
          className={cn([
            classes.label,
            alignmentClass,
            subLabelPriorityClass,
            subLabelEmphasisClass,
          ])}
        >
          {subLabel}
        </span>
      )}
    </div>
  );
};

LabelNode.propTypes = {
  visible: PropTypes.bool,
  label: PropTypes.string,
  subLabel: PropTypes.string,
  alignment: PropTypes.oneOf(['HORIZONTAL', 'VERTICAL']),
  emphasis: PropTypes.string,
  headerPriority: PropTypes.string,
  subLabelEmphasis: PropTypes.string,
  subLabelPriority: PropTypes.string,
};

export default LabelNode;
