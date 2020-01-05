import React from 'react';

interface UserProps {
    name: string,
    totalScore: number,
    weeklyScore: number
}


const User = (props: UserProps) => (
    <div>
        <p>{props.name} - {(+(props.totalScore) + (+props.weeklyScore)).toFixed(2)}</p>
    </div>
);


export default User;
