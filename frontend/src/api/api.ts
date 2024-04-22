import get_foodgroups from './get_foodgroups';
import get_logout from './get_logout';
import get_profile from './get_profile';
import post_login from './post_login';
import get_history from './get_history';
import get_stores from './get_stores';
import post_search from './post_search';
import post_signup from './post_signup';
import post_del_account from './port_del_account';

// Backend API interface
export default Object.freeze({
  get_foodgroups,
  get_history,
  get_logout,
  get_profile,
  get_stores,
  post_del_account,
  post_login,
  post_search,
  post_signup,
});
