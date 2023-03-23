import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import TooltipPrimary from '@components/TooltipPrimary';
import CircleArrowLeftIcon from '@icons/circle-arrow-left.svg';
import CircleArrowRightIcon from '@icons/circle-arrow-right.svg';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  button: {
    position: 'fixed',
    top: '25px',
    left: '14px',
    zIndex: 1300, // stack below SnackMessage
    padding: 0,
    border: `1px solid ${theme.palette.gray[50]}`,
    backgroundColor: theme.palette.white,
    '&:hover': {
      backgroundColor: theme.palette.white,
    },
    '&.sidebarOpen': {
      left: '336px',
    },
  },
  tooltip: {
    border: `1px solid ${theme.palette.gray[400]}`,
    fontSize: '16px',
    lineHeight: '20px',
    marginTop: '-2px',
    backgroundColor: theme.palette.gray[100],
    color: theme.palette.gray.dark,
    '& .MuiTooltip-arrow': {
      color: theme.palette.gray[400],
    },
  },
}));

export default function ToggleSidebarButton({ onClick, sidebarOpen }) {
  const classes = useStyles();
  const { getLang } = useAthena();
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const label = sidebarOpen
    ? getLang('collapseText', { fallback: 'Collapse' })
    : getLang('expandText', { fallback: 'Expand' });

  // workaround for tooltip not closing after click until you hover or click again
  const handleClick = useCallback(() => {
    setTooltipOpen(false);
    onClick();
  }, [onClick]);

  return (
    <TooltipPrimary
      className={classes.tooltip}
      onClose={() => setTooltipOpen(false)}
      onOpen={() => setTooltipOpen(true)}
      open={tooltipOpen}
      placement="right"
      title={label}
    >
      <IconButton
        aria-label={label}
        className={cn(classes.button, { sidebarOpen })}
        data-testid="toggle-sidebar-button"
        onClick={handleClick}
      >
        {sidebarOpen ? <CircleArrowLeftIcon /> : <CircleArrowRightIcon />}
      </IconButton>
    </TooltipPrimary>
  );
}

ToggleSidebarButton.propTypes = {
  sidebarOpen: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};
