import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import fetchMiners from '../scripts/fetchers/fetchMiners.js';
import {
    renderCertifications,
    renderEquipment,
} from '../scripts/helpers/cert_eq.js';
import {
    sortByRank,
    sortByExp,
    SortButtons,
} from '../scripts/helpers/sorters.js';

function Miners({ isRaw }) {
    const [crew, setCrew] = useState([]);
    const [sortRank, setRank] = useState('asc');
    const [sortExp, setExp] = useState('asc');

    useEffect(() => {
        fetchMiners().then(data => setCrew(data));
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
        <div id="miners">
            {isRaw ? (
                <div className="raw-data">
                    {crew.length > 0 ? (
                        crew.map((miner, index) => (
                            <div key={index} className="raw-data__object">
                                <pre>{JSON.stringify(miner, null, 2)}</pre>
                            </div>
                        ))
                    ) : (
                        <p className="loading">Loading Miners ⚙️...</p>
                    )}
                </div>
            ) : (
                <>
                    <h2>Welcome to Mining Deck ⚒</h2>
                    <SortButtons
                        sortRank={sortRank}
                        sortExp={sortExp}
                        onSortByRank={handleSortByRank}
                        onSortByExp={handleSortByExp}
                    />
                    <div className="miners-grid">
                        {crew.length > 0 ? (
                            crew.map(miner => (
                                <div key={miner.id} className="miner">
                                    <h3>{miner.name}</h3>
                                    <ul>
                                        <li>
                                            <p>
                                                <strong>Status:</strong>{' '}
                                                {miner.activeStatus
                                                    ? 'Active'
                                                    : 'Deactivated'}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Execution ID:</strong>{' '}
                                                {miner.id}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Rank:</strong>{' '}
                                                {miner.rank}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Role:</strong>{' '}
                                                {miner.role.name} (
                                                {miner.role.symbol})
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Species:</strong>{' '}
                                                {miner.species}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Citizenship:</strong>{' '}
                                                {miner.citizenship}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Directive:</strong>{' '}
                                                {miner.directive}
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Experience:</strong>{' '}
                                                {miner.experience.years} years
                                            </p>
                                        </li>
                                        <li>
                                            <p>
                                                <strong>Skills:</strong>{' '}
                                                {miner.experience.skills.join(
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
                                                    miner.certifications,
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
                                                    miner.equipment,
                                                ),
                                            ),
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="loading">Loading Miners ⚒...</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Miners;
