import {Button, Form} from "semantic-ui-react";
import classes from "../containers/landing.module.css";
import {Link} from "react-scroll/modules";
import * as objects from '../constants/objects';
import React from "react";

interface createTournamentForm {
    tournamentName: string,
    nickname: string,
    totalScore: number,
    handleTournamentNameChange: ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => void,
    handleSelectedLeagueChanged: (event: any, {value}: any) => void,
    handleSelectedOddsSourceChange: (event: any, {value}: any) => void,
    handleNicknameChanged: ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => void,
    handleTotalScoreChange: ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => void,
    handleTournamentCreate: () => void
}


const CreateTournamentForm = (props: createTournamentForm) => (
    <Form className={classes.createFormStyle}>
        <Form.Field>
            <label>Tournament's name</label>
            <input placeholder='name' value={props.tournamentName}
                   onChange={props.handleTournamentNameChange}/>
        </Form.Field>
        <Form.Field>
            <Form.Select
                fluid
                label='League'
                options={objects.options}
                placeholder='League'
                onChange={props.handleSelectedLeagueChanged}
            />
        </Form.Field>
        <Form.Field>
            <Form.Select
                fluid
                label='Odds source'
                options={objects.oddsFetchingOptions}
                placeholder='Source'
                onChange={props.handleSelectedOddsSourceChange}
            />
        </Form.Field>
        <br/>
        <Form>
            <Form.Field>
                <label>Your nickname</label>
                <input placeholder='nickname' value={props.nickname}
                       onChange={props.handleNicknameChanged}/>
            </Form.Field>
        </Form>
        <div className={classes.createTournamentButton}>
            <Link activeClass="active" to="test2" spy={true} smooth="easeInOutQuart"
                  offset={0}
                  duration={800}>
                <Button type='submit' onClick={props.handleTournamentCreate} style={{width: '100%'}}>Create
                    Tournament</Button>
            </Link>
        </div>
    </Form>
);

export default CreateTournamentForm;
