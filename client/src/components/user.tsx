import React from 'react';

interface UserProps {
    name: string,
    totalScore: number,
    weeklyScore: number
}


const User = (props: UserProps) => (
    <div>
        <p>{props.name} - {props.totalScore}</p>
    </div>
);


export default User;
