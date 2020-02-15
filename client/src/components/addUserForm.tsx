import React from 'react';
import {Button, Form} from "semantic-ui-react";
import classes from "../containers/tournament.module.css";

interface AddUserFormProps {
    usernameToAddName: string,
    usernameToAddScore: any,
    onNewUsernameChanged: ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => void,
    onNewUserScoreChanged: ({currentTarget: {value}}: React.SyntheticEvent<HTMLInputElement>) => void
    onAddUser: () => void
}

const AddUserForm = (props: AddUserFormProps) => (
    <Form className={classes.padding5}>
        <Form.Field>
            <label>Username</label>
            <input placeholder='Full name' value={props.usernameToAddName}
                   onChange={props.onNewUsernameChanged}/>
        </Form.Field>
        <Form.Field>
            <label>Initial score</label>
            <input placeholder='score' value={props.usernameToAddScore}
                   onChange={props.onNewUserScoreChanged}/>
        </Form.Field>
        <Button type='submit' onClick={props.onAddUser}>Submit</Button>
    </Form>
);

export default AddUserForm;
