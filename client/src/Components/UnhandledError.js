import React from 'react';

// Import SVG as a component.
import {ReactComponent as PageWarning} from '../svg/page_warning.svg';

export default () => {
  return (
  <div className="warning-div">
    <h1>Ooops! It looks like something has gone wrong.</h1>
    <PageWarning />
    <a href='https://dryicons.com/free-icons/error'> Icon by Dryicons </a>
  </div>
  );
}