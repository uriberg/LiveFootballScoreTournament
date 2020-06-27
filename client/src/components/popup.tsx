import React from 'react';
import classes from './popup.module.css';
import {Button, Form} from "semantic-ui-react";

const Zoom = require('react-reveal/Zoom');
const Fade = require('react-reveal/Fade');

interface PopupProps {
    closePopup: () => void,
    open: boolean,
    email: string,
    tournamentCode: any,
    handleEmailChange: ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => void,
    handleTournamentCodeChange: ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => void,
    handleJoinRequest: () => void,
    emailStatus: string
}

const Popup = (props: PopupProps) => (
        <div className={classes.popup}>
            <div className={classes.popup_inner}>
                <div className={classes.popup_header}>
                    <div className={classes.close} onClick={props.closePopup}>X</div>
                </div>
                <Form className={classes.popup_form}>
                    <Form.Field>
                        <label>Recipient's email address</label>
                        <input placeholder='Email' value={props.email} type='email'
                               onChange={props.handleEmailChange}/>
                    </Form.Field>

                    <Form.Field>
                        <label>Tournament's code</label>
                        <input placeholder='Tournament code' value={props.tournamentCode}
                               onChange={props.handleTournamentCodeChange}/>
                    </Form.Field>

                    <Button type='submit' onClick={props.handleJoinRequest} style={{width: '100%'}}>
                        Send invitation
                    </Button>
                    <div>{props.emailStatus}</div>
                </Form>
            </div>
        </div>

);

export default Popup;
