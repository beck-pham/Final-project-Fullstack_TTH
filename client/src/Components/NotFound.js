import React from 'react';
import { Link } from 'react-router-dom';

// Import SVG as a component.
import { ReactComponent as NotFoundSVG } from '../svg/notfound.svg';

export default () => (

    <div className="warning-div">
        <Link className="button button-secondary" to="/">Return to list</Link>
        <h1>Not Found</h1>
        <p>Sorry! It looks like the page you are looking for doesn't exist.</p>
        <NotFoundSVG />
        <a href='https://dryicons.com/free-graphics/not-found'> Icon by Dryicons </a>
    </div>
);