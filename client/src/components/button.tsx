import React from 'react';
import classes from './button.module.css';

interface ButtonProps {
    onHandleClick: () => void,
    name: string
}

const Button = (props: ButtonProps) => (
    <button onClick={props.onHandleClick} className={classes.btn}>{props.name}</button>
);

export default Button;
