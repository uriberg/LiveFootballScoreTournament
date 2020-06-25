import React from 'react';
import classes from './popup.module.css';

const Zoom = require('react-reveal/Zoom');
const Fade = require('react-reveal/Fade');

interface PopupProps {
    closePopup: () => void,
    open: boolean
}

const Popup = (props: PopupProps) => (
        <div className={classes.popup}>
            <div className={classes.popup_inner}>
                <div className={classes.popup_header}>
                    <div className={classes.close} onClick={props.closePopup}>X</div>
                </div>
                <h1>popup</h1>
            </div>
        </div>

);

export default Popup;
