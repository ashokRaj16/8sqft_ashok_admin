import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import { CSpinner } from '@coreui/react'
import './scss/style.scss'
import { useDispatch, useSelector } from 'react-redux';

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))

const App = () => {

  const { users, isLoggedIn, loading, error } = useSelector((state) => state.auth);
  const isAuthenticated = isLoggedIn;

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/*"
            element={isAuthenticated ? <DefaultLayout /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
