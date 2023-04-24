// Guards
import Layout from './components/layouts/Layout'
import AlertPopup from './components/layouts/AlertPopup'

// Pages
import Home from './pages'
import Admin from './pages/admin'
import User from './pages/user'
import HeaderBar from './components/layouts/Layout'

const routes = [
  {
    path: '/',
    children: [
      {
        path: '',
        element: (
          <>
            <AlertPopup />
            <Home />
          </>
        ),
      },
      {
        path: 'admin',
        element: (
          <>
            <HeaderBar/>
            <AlertPopup />
            <Admin />
          </>
        ),
      },
      {
        path: 'user',
        element: (
          <>
            <HeaderBar />
            <AlertPopup />
            <User />
          </>
        ),
      },
    ],
  },
]

export default routes
