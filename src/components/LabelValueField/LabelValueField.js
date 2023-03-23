import PropTypes from 'prop-types';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { FormLabel } from '@material-ui/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import CopiedIcon from '@icons/check-outline.svg';

const COPIED_ICON_TIMEOUT_MS = 1000;

const copiedIcon = {
  true: CopiedIcon,
  false: function empty() {
    return <span />;
  },
};
const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
  },
  label: {
    width: theme.utils.fromPx(60),
    paddingRight: theme.spacing(2),
    display: 'inline-block',
  },
  value: {
    display: 'inline-flex',
    width: '100%',
    height: theme.utils.fromPx(20),
    color: (props) => props.valueColor || '#121212',
    marginBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.8),
    fontWeight: '400',
  },
  valueText: {
    paddingRight: theme.spacing(0.5),
  },
  copiedSpan: {
    display: 'flex',
    flexDirection: 'row',
    color: '#0A8E4E',
    fontWeight: '700',
    width: 'max-content',
  },
  icon: {
    alignContent: 'center',
    width: theme.spacing(1),
    height: theme.spacing(1),
    marginTop: theme.spacing(-0.1),
  },
  copiedText: {
    position: 'relative',
    paddingLeft: theme.spacing(0.2),
  },
}));

const LabelValueField = ({
  id,
  name,
  className = '',
  label = '',
  value = '',
  valueFormatter,
  ...props
}) => {
  const classes = useStyles(props);
  const timeout = useRef(null);
  const [showCopied, setShowCopied] = useState(false);

  const copyId = useCallback(() => {
    navigator.clipboard.writeText(value);
  }, [value]);

  const onShown = useCallback(() => {
    timeout.current && window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => {
      setShowCopied(false);
    }, COPIED_ICON_TIMEOUT_MS);
  }, [setShowCopied]);

  const onCopy = useCallback(() => {
    copyId();
    setShowCopied(true);
    onShown();
  }, [copyId]);

  const el = useRef(null);
  useEffect(() => el?.current?.addEventListener('dblclick', onCopy), [onCopy]);

  const Icon = copiedIcon[showCopied];

  return (
    <div className={cn(classes.root)}>
      <span>
        <FormLabel
          component="label"
          data-testid={`${props['data-testid']}:label`}
          className={cn(classes.label, className)}
        >
          {label}
        </FormLabel>
      </span>
      <span>
        <FormLabel ref={el} component="label" className={cn(classes.value, className)}>
          <span data-testid={`${props['data-testid']}:value`} className={cn(classes.valueText)}>
            {valueFormatter ? valueFormatter(value) : value}
          </span>
          <span hidden={!showCopied} className={classes.copiedSpan}>
            <span>
              <Icon data-testid={`${props['data-testid']}:icon`} className={cn(classes.icon)} />
            </span>
            <span
              hidden={!showCopied}
              data-testid={`${props['data-testid']}:copied`}
              className={cn(classes.copiedText)}
            >
              COPIED
            </span>
          </span>
        </FormLabel>
      </span>
    </div>
  );
};

LabelValueField.propTypes = {
  className: PropTypes.string,
  'data-testid': PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.any,
  value: PropTypes.any,
  valueColor: PropTypes.string,
  valueFormatter: PropTypes.func,
};

export default LabelValueField;
