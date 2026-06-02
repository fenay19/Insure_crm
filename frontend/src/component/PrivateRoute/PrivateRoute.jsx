import TokenHandler from 'token/TokenHandler'
import { Outlet, Navigate } from 'react-router'

function PrivateRoute ({ allowedRoles = [], children }) {
  const userRole = localStorage.getItem('loginRole')
  const authToken = TokenHandler()
  const isAuthorized = userRole && authToken && allowedRoles.includes(userRole)
  return isAuthorized ? children : <Navigate to='/login' replace />
}

export default PrivateRoute
