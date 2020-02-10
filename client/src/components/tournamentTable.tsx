import React from 'react';
import {Table} from "semantic-ui-react";
import classes from "../containers/tournament.module.css";
import _ from "lodash";

interface User {
    name: string;
    totalScore: number;
    weeklyScore: number;
}

interface TournamentTableProps {
    usersList: User [],
    handleSort: (columnName: string) => void,
    sortDirection: string,
    columnToSort: any
}

const TournamentTable = (props: TournamentTableProps) => (
    <Table sortable celled>
        <Table.Header style={{display: 'contents'}}>
            <Table.Row>
                <Table.HeaderCell
                    sorted={props.columnToSort === 'name' ? (props.sortDirection === 'descending' ? 'descending' : 'ascending') : undefined}
                    onClick={props.handleSort('name')}
                >
                    Name
                </Table.HeaderCell>
                <Table.HeaderCell
                    sorted={props.columnToSort === 'totalScore' ? (props.sortDirection === 'descending' ? 'descending' : 'ascending') : undefined}
                    onClick={props.handleSort('totalScore')}
                >
                    Score
                </Table.HeaderCell>
                <Table.HeaderCell
                    sorted={props.columnToSort === 'weeklyScore' ? (props.sortDirection === 'descending' ? 'descending' : 'ascending') : undefined}
                    onClick={props.handleSort('weeklyScore')}
                >
                    Weekly Score
                </Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body className={classes.tableBody}>
            <style>{`
            @media (max-width: 767px){
                    .ui.table:not(.unstackable) tbody{
              display: table-row-group !important;
            }
            .ui.table:not(.unstackable) tr>td{
            display: table-cell !important;
          
             }
             
             .ui.table:not(.unstackable) tr>th {
                display: table-cell !important;
             }
             
             .ui.table:not(.unstackable) tr{
             display: table-row !important;
             }
            }
          `}</style>
            {_.map(props.usersList, ({totalScore, name, weeklyScore}) => (
                <Table.Row key={name}>
                    <Table.Cell>{name}</Table.Cell>
                    <Table.Cell>{totalScore.toFixed(2)}</Table.Cell>
                    <Table.Cell>{weeklyScore}</Table.Cell>
                </Table.Row>
            ))}
        </Table.Body>
    </Table>
);

export default TournamentTable;
