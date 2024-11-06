import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import fetchEngineers from '../scripts/fetchers/fetchEngineers.js';
import {
    renderCertifications,
    renderEquipment,
} from '../scripts/helpers/cert_eq.js';
import {
    sortByRank,
    sortByExp,
    SortButtons,
} from '../scripts/helpers/sorters.js';

function Engineers({ isRaw }) {
    const [crew, setCrew] = useState([]);
    const [sortRank, setRank] = useState('asc');
    const [sortExp, setExp] = useState('asc');

    useEffect(() => {
        fetchEngineers().then(data => setCrew(data));
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
        <div id="engineers">
            <h2>Welcome to Engineering ⚙️</h2>
            {isRaw ? (
                <div className="raw-data">
                    {crew.length > 0 ? (
                        crew.map((engineer, index) => (
                            <div key={index} className="raw-data__object">
                                <pre>{JSON.stringify(engineer, null, 2)}</pre>
                            </div>
                        ))
                    ) : (
                        <p className="loading raw">Loading Engineers ⚙️...</p>
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
                    <div className="engineers-grid">
                        {crew.length > 0 ? (
                            crew.map(engineer => (
                                <div key={engineer.id} className="engineer">
                                    <h3>{engineer.name}</h3>
                                    <ul>
                                        <li>
                                            <p>
                                                <strong>Status:</strong>{' '}
                                                {engineer.activeStatus
                                                    ? 'Active'
                                                    : 'Deactivated'}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Execution ID:</strong>{' '}
                                                {engineer.id}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Rank:</strong>{' '}
                                                {engineer.rank}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Role:</strong>{' '}
                                                {engineer.role.name} (
                                                {engineer.role.symbol})
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Species:</strong>{' '}
                                                {engineer.species}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Citizenship:</strong>{' '}
                                                {engineer.citizenship}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Directive:</strong>{' '}
                                                {engineer.directive}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Experience:</strong>{' '}
                                                {engineer.experience.years}{' '}
                                                years
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Skills:</strong>{' '}
                                                {engineer.experience.skills.join(
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
                                                    engineer.certifications,
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
                                                    engineer.equipment,
                                                ),
                                            ),
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="loading styled">
                                Loading Engineers ⚙️...
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Engineers;
