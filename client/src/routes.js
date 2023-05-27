// Guards
import AlertPopup from './components/layouts/AlertPopup'

// Pages
import Home from './pages'
import Admin from './pages/admin'
import User from './pages/user'
import Professor from './pages/professor'
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
        path: 'student',
        element: (
          <>
            <HeaderBar />
            <AlertPopup />
            <User />
          </>
        ),
      },
      {
        path: 'professor',
        element: (
          <>
            <HeaderBar />
            <AlertPopup />
            <Professor />
          </>
        ),
      },
    ],
  },
]

export default routes
