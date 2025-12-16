import React from 'react';
import CrewComponent from './CrewComponent';
import fetchEngineers from '../scripts/fetchers/fetchEngineers.js';

function Engineers({ isRaw }) {
    return (
        <CrewComponent
            isRaw={isRaw}
            fetchCrew={fetchEngineers}
            title="Engineering"
            crewType="engineers"
            emoji="⚙️"
        />
    );
}

export default Engineers;
