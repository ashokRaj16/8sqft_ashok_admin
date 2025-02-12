import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ userRole, allowedRoles, children}) => {
    if(!allowedRoles.includes(userRole)){

        return <Navigate to='/401' replace />
    }
    return children;
}

export default ProtectedRoute;