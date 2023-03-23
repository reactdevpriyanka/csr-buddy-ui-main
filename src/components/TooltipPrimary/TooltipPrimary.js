import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';

/* just a tooltip for styling consistency */
const TooltipPrimary = ({ title, children, className, ...props }) => {
  return (
    <Tooltip
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
      title={title}
      arrow
      componentsProps={{
        tooltip: { sx: { backgroundColor: '#031657', padding: '12px', fontSize: '12px' } },
        arrow: { sx: { color: '#031657' } },
      }}
    >
      <div className={className}>{children}</div>
    </Tooltip>
  );
};
TooltipPrimary.propTypes = {
  title: PropTypes.any.isRequired,
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};
export default TooltipPrimary;
