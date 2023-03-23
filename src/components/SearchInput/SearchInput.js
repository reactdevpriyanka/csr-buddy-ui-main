import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ReactComponent as SearchIcon } from '@icons/search.svg';

const SearchInput = ({ classes, onSearch = () => {} }) => {
  return (
    <form onSubmit={onSearch} className={classes.root} role="search" data-testid="search-form">
      <div className={classes.searchContainer}>
        <SearchIcon className={classes.searchIcon} />
        <input
          type="search"
          id="search"
          name="query"
          className={classes.searchInput}
          placeholder="Search"
          aria-label="Search customer activity or knowledge base"
          data-testid="search-input"
        />
      </div>
    </form>
  );
};

SearchInput.propTypes = {
  classes: PropTypes.object.isRequired,
  onSearch: PropTypes.func,
};

const styles = {
  root: {
    //
  },
  searchContainer: {
    position: 'relative',
  },
  searchIcon: {
    display: 'inline-block',
    width: '1rem',
    height: '1rem',
    position: 'absolute',
    padding: '0.5rem',
    top: '50%',
    left: '0',
    transform: 'translate(0, -50%)',
  },
  searchInput: {
    padding: '0.5rem 1rem 0.5rem 1.75rem',
    borderRadius: '0.25rem',
    border: '1px solid #ccc',
    color: '#666',
    '&::placeholder': {
      color: '#666',
    },
  },
};

export default withStyles(styles)(SearchInput);
