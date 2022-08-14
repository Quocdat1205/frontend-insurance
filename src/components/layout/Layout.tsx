import React from 'react'
import PropTypes from 'prop-types'

import Header from 'components/screens/HomePage/Header'
import Footer from 'components/screens/LandingPage/Footer'

function Layout({ children }: any) {
  return (
    <div className="w-full">
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
