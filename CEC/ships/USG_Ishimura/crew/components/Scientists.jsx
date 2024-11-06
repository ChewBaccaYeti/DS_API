import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import fetchScientists from '../scripts/fetchers/fetchScientists.js';
import {
    renderCertifications,
    renderEquipment,
} from '../scripts/helpers/cert_eq.js';
import {
    sortByRank,
    sortByExp,
    SortButtons,
} from '../scripts/helpers/sorters.js';

function Scientists({ isRaw }) {
    const [crew, setCrew] = useState([]);
    const [sortRank, setRank] = useState('asc');
    const [sortExp, setExp] = useState('asc');

    useEffect(() => {
        fetchScientists().then(data => setCrew(data));
    }, []);

    const handleSortByRank = () => {
        setCrew(sortByRank(crew, sortRank));
        setRank(sortRank === 'asc' ? 'desc' : 'asc');
    };

    const handleSortByExp = () => {
        setCrew(sortByExp(crew, sortExp));
        setExp(sortExp === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div id="scientists">
            <h2>Welcome to Medical Bay 🔬</h2>
            {isRaw ? (
                <div className="raw-data">
                    {crew.length > 0 ? (
                        crew.map((scientist, index) => (
                            <div key={index} className="raw-data__object">
                                <pre>{JSON.stringify(scientist, null, 2)}</pre>
                            </div>
                        ))
                    ) : (
                        <p className="loading">Loading Engineers ⚙️...</p>
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
                    <div className="scientists-grid">
                        {crew.length > 0 ? (
                            crew.map(scientist => (
                                <div key={scientist.id} className="scientist">
                                    <h3>{scientist.name}</h3>
                                    <ul>
                                        <li>
                                            <p>
                                                <strong>Status:</strong>{' '}
                                                {scientist.activeStatus
                                                    ? 'Active'
                                                    : 'Deactivated'}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Execution ID:</strong>{' '}
                                                {scientist.id}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Rank:</strong>{' '}
                                                {scientist.rank}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Role:</strong>{' '}
                                                {scientist.role.name} (
                                                {scientist.role.symbol})
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Species:</strong>{' '}
                                                {scientist.species}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Citizenship:</strong>{' '}
                                                {scientist.citizenship}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Directive:</strong>{' '}
                                                {scientist.directive}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Experience:</strong>{' '}
                                                {scientist.experience.years}{' '}
                                                years
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Skills:</strong>{' '}
                                                {scientist.experience.skills.join(
                                                    ', ',
                                                )}
                                            </p>
                                        </li>
                                    </ul>
                                    <h4>Certifications:</h4>
                                    <ul
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                renderCertifications(
                                                    scientist.certifications,
                                                ),
                                            ),
                                        }}
                                    />
                                    <br />
                                    <h4>Equipment:</h4>
                                    <ul
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                renderEquipment(
                                                    scientist.equipment,
                                                ),
                                            ),
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="loading">Loading Scientists 🔬...</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Scientists;
