import React from 'react';
import CrewComponent from './CrewComponent';
import fetchMiners from '../scripts/fetchers/fetchMiners.js';

function Miners({ isRaw }) {
    return (
        <CrewComponent
            isRaw={isRaw}
            fetchCrew={fetchMiners}
            title="Mining Deck"
            crewType="miners"
            emoji="⚒️"
        />
    );
}

export default Miners;
