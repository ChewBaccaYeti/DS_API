import React from 'react';
import CrewComponent from './CrewComponent';
import fetchScientists from '../scripts/fetchers/fetchScientists.js';

function Scientists({ isRaw }) {
    return (
        <CrewComponent
            isRaw={isRaw}
            fetchCrew={fetchScientists}
            title="Medical Bay"
            crewType="scientists"
            emoji="🔬"
        />
    );
}

export default Scientists;
