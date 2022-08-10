import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/screens/HomePage/Header';
import Footer from 'components/screens/LandingPage/Footer';

const Layout = ({ children }: any) => {
    return (
        <div className="w-full">
            <Header></Header>
            {children}
            <Footer></Footer>
        </div>
    );
};

export default Layout;
