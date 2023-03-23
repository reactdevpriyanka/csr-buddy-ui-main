import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';

const getAbbreviatedGender = (gender) => {
  switch (gender) {
    case 'FMLE':
      return 'F';
    case 'MALE':
      return 'M';
    default:
      return '?';
  }
};

const PetBadge = withStyles((theme) => ({
  badge: {
    padding: '2px 0 0 0',
    top: theme.spacing(2.25),
    fontSize: '0.875rem',
    color: theme.palette.white,
    backgroundColor: (props) =>
      ({
        FMLE: theme.palette.pink.baby,
        MALE: theme.palette.blue.baby,
        UNKN: theme.palette.gray['200'],
      }[props.gender]),
  },
}))(({ children, classes, gender, ...props }) => (
  <Badge
    badgeContent={getAbbreviatedGender(gender)}
    classes={classes}
    data-testid={props['data-testid']}
  >
    {children}
  </Badge>
));

PetBadge.propTypes = {
  children: PropTypes.node,
  'data-testid': PropTypes.string.isRequired,
  gender: PropTypes.oneOf(['FMLE', 'MALE', 'UNKN']).isRequired,
};

export default PetBadge;
