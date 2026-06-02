import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import OPDQueueRoute from './OPDQueueRoute';
import OtherRoutes from './OtherRoutes';

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, AuthenticationRoutes, OPDQueueRoute, OtherRoutes]);
}
