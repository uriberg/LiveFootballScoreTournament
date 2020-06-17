import {Button, Form} from "semantic-ui-react";
import classes from "../containers/landing.module.css";
import {Link} from "react-scroll/modules";
import React from "react";

interface joinTournamentForm {
    nickname: string,
    tournamentSerialNumber: any,
    handleTournamentSerialChange: ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => void,
    handleNicknameChanged: ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => void,
    handleJoinToTournament: () => void
}


const JoinTournamentForm = (props: joinTournamentForm) => (
    <Form className={classes.joinFormStyle}>
        <Form>
            <Form.Field>
                <label>Tournament Serial</label>
                <input placeholder='Tournament Serial Number' value={props.tournamentSerialNumber}
                       onChange={props.handleTournamentSerialChange}/>
            </Form.Field>
        </Form>

        <Form.Field>
            <label>Choose a Nickname</label>
            <input placeholder='nickname' value={props.nickname}
                   onChange={props.handleNicknameChanged}/>
        </Form.Field>

        <div className={classes.createTournamentButton}>
            <Link activeClass="active" to="test2" spy={true} smooth="easeInOutQuart"
                  offset={0}
                  duration={800}>
                <Button type='submit' onClick={props.handleJoinToTournament} style={{width: '100%'}}>
                    Confirm</Button>
            </Link>
        </div>
    </Form>
);

export default JoinTournamentForm;
