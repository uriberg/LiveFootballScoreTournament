import React from 'react';
import {Menu, Select} from "semantic-ui-react";
import classes from "../containers/tournament.module.css";

interface TournamentMenuProps {
    onBackHome: () => void,
    onToggleEditMode: () => void,
    onDeleteTournament: () => void,
    selectedUser: string,
    isAdmin: boolean,
    togglePopup: () => void
}

const TournamentMenu = (props: TournamentMenuProps) => (
    <Menu inverted floated={"right"}>
        <Menu.Item
            icon='home'
            onClick={props.onBackHome}
        />
        <Menu.Item
            icon='user'
        >{props.selectedUser}
        </Menu.Item>

        {props.isAdmin ?
            <Menu.Item
                // name='deleteTournament'
                icon='add'
                onClick={props.togglePopup}
            /> : null }

        {props.isAdmin ?
        <Menu.Item
            // name='deleteTournament'
            icon='delete'
            onClick={props.onDeleteTournament}
        /> : null }
        {/*<Menu.Menu className={classes.width25} icon='user'>*/}
        {/*    <Select options={props.participants} onChange={props.onSelectedUserChanged}*/}
        {/*            placeholder="Participants"*/}
        {/*            style={{backgroundColor: '#1B1C1D', color: 'rgba(255,255,255,.9)'}}/>*/}

        {/*</Menu.Menu>*/}
    </Menu>
);

export default TournamentMenu;
