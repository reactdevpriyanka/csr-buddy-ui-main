import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const PetAvatar = withStyles((theme) => ({
  root: {
    width: (props) => (props.width ? props.width : '65px'),
    height: (props) => (props.height ? props.height : '70px'),
    borderRadius: 3,
    backgroundColor: (props) =>
      ({
        FMLE: theme.palette.pink.baby,
        MALE: theme.palette.blue.baby,
        UNKN: theme.palette.gray['200'],
      }[props.gender]),
  },
}))(Avatar);

PetAvatar.propTypes = {
  alt: PropTypes.string,
  'data-testid': PropTypes.string,
  gender: PropTypes.oneOf(['FMLE', 'MALE', 'UNKN']),
  src: PropTypes.string,
};

export default PetAvatar;
