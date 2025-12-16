import React, { useEffect, useState, useCallback } from 'react';
import DOMPurify from 'dompurify';
import {
    renderCertifications,
    renderEquipment,
} from '../scripts/helpers/cert_eq.js';
import {
    sortByRank,
    sortByExp,
    SortButtons,
} from '../scripts/helpers/sorters.js';

function CrewComponent({ isRaw, fetchCrew, title, crewType, emoji }) {
    const [crew, setCrew] = useState([]);
    const [sortRank, setRank] = useState('asc');
    const [sortExp, setExp] = useState('asc');

    useEffect(() => {
        fetchCrew().then(data => setCrew(data || []));
    }, [fetchCrew]);

    const handleSortByRank = useCallback(() => {
        setCrew(currentCrew => [...sortByRank(currentCrew, sortRank)]);
        setRank(prev => (prev === 'asc' ? 'desc' : 'asc'));
    }, [crew, sortRank]);

    const handleSortByExp = useCallback(() => {
        setCrew(currentCrew => [...sortByExp(currentCrew, sortExp)]);
        setExp(prev => (prev === 'asc' ? 'desc' : 'asc'));
    }, [crew, sortExp]);

    const renderCrewMember = member => (
        <div key={member.id} className={crewType.slice(0, -1)}>
            <h3>{member.name}</h3>
            <ul>
                <li>
                    <p>
                        <strong>Status:</strong>{' '}
                        {member.activeStatus ? 'Active' : 'Deactivated'}
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Execution ID:</strong> {member.id}
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Rank:</strong> {member.rank}
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Role:</strong> {member.role.name} (
                        {member.role.symbol})
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Species:</strong> {member.species}
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Citizenship:</strong> {member.citizenship}
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Directive:</strong> {member.directive}
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Experience:</strong> {member.experience.years}{' '}
                        years
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Skills:</strong>{' '}
                        {member.experience.skills.join(', ')}
                    </p>
                </li>
            </ul>
            <h4>Certifications:</h4>
            <ul
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                        renderCertifications(member.certifications)
                    ),
                }}
            />
            <br />
            <h4>Equipment:</h4>
            <ul
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(renderEquipment(member.equipment)),
                }}
            />
        </div>
    );

    return (
        <div id={crewType}>
            <h2>{`Welcome to ${title} ${emoji}`}</h2>
            {isRaw ? (
                <div className="raw-data">
                    {crew.length > 0 ? (
                        crew.map((member, index) => (
                            <div key={index} className="raw-data__object">
                                <pre>{JSON.stringify(member, null, 2)}</pre>
                            </div>
                        ))
                    ) : (
                        <p className="loading">{`Loading ${title} ${emoji}...`}</p>
                    )}
                </div>
            ) : (
                <>
                    <SortButtons
                        sortRank={sortRank}
                        sortExp={sortExp}
                        onSortByRank={handleSortByRank}
                        onSortByExp={handleSortByExp}
                    />
                    <div className={`${crewType}-grid`}>
                        {crew.length > 0 ? (
                            crew.map(renderCrewMember)
                        ) : (
                            <p className="loading">{`Loading ${title} ${emoji}...`}</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default CrewComponent;