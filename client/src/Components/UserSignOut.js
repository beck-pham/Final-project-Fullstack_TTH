import React from 'react';
import { Redirect } from 'react-router-dom';

export default ({ context }) => {
	
	// Using a set time out function to avoid getting a warning in the console about state.
	setTimeout( function(){  context.actions.signOut(); }, 100 );
	
	return (
		<Redirect to="/" />
	);
}


