import { compose } from 'redux';
import FeaturePage from './FeaturePage';
import withRouteProtection from '../../shared/hocs/withRouteProtection.hoc';

export default compose(withRouteProtection)(FeaturePage);
