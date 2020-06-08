import {Button, Form} from "semantic-ui-react";
import classes from "../containers/landing.module.css";
import {Link} from "react-scroll/modules";
import * as objects from '../constants/objects';
import React from "react";

interface createTournamentForm {
    tournamentName: string,
    username: string,
    totalScore: number,
    handleTournamentNameChange: ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => void,
    handleSelectedLeagueChanged: (event: any, {value}: any) => void,
    handleSelectedOddsSourceChange: (event: any, {value}: any) => void,
    handleUsernameChanged: ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => void,
    handleTotalScoreChange: ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => void,
    handleAddUser: () => void,
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
        {/*/!*<div className={classes.addUsersTitle}>Add Users</div>*!/*/}
        {/*/!*<br/>*!/*/}
        {/*/!*<Form>*!/*/}
        {/*/!*    <Form.Field>*!/*/}
        {/*/!*        <label>Username</label>*!/*/}
        {/*/!*        <input placeholder='name' value={props.username}*!/*/}
        {/*/!*               onChange={props.handleUsernameChanged}/>*!/*/}
        {/*/!*    </Form.Field>*!/*/}
        {/*/!*    <Form.Field>*!/*/}
        {/*/!*        <label>Initial score</label>*!/*/}
        {/*/!*        <input placeholder='score' value={props.totalScore}*!/*/}
        {/*/!*               onChange={props.handleTotalScoreChange}/>*!/*/}
        {/*/!*    </Form.Field>*!/*/}
        {/*/!*    <Button type='submit' onClick={props.handleAddUser}>Add User</Button>*!/*/}
        {/*</Form>*/}
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
