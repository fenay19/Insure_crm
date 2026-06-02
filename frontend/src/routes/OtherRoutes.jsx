import ViewUserDetails from 'views/HR/User/ViewUserDetails'
import PrivateRoute from 'component/PrivateRoute/PrivateRoute'

const OtherRoutes = {
  path: '/users/viewUserDetails/:userType/:id',
  element: (
    <PrivateRoute allowedRoles={['admin']}>
      <ViewUserDetails />
    </PrivateRoute>
  )
}

export default OtherRoutes
