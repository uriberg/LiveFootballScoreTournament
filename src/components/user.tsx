import React from 'react';
//import classes from './BuildControls.module.css';
//import BuildControl from './BuildControl/BuildControl';
import PropTypes from 'prop-types';


interface UserProps {
    name: string,
    score: number
    choice: number
}

const User = (props: UserProps) => (
    <div>
        <p>{props.name} - {props.score}</p>
    </div>
);

User.propTypes = {
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    choice: PropTypes.number.isRequired
};

export default User;
