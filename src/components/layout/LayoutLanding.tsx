import React from 'react';
import Footer from 'components/screens/LandingPage/Footer';
import HeaderLP from 'components/screens/LandingPage/HeaderLP';
const LayoutLanding = ({ children }: any) => {
    return (
        <div className="w-full">
            <HeaderLP />
            {children}
            <Footer />
        </div>
    );
};

export default LayoutLanding;