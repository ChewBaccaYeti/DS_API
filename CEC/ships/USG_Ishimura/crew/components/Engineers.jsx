import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import fetchEngineers from '../scripts/fetchers/fetchEngineers.js';
import {
    renderCertifications,
    renderEquipment,
} from '../scripts/helpers/cert_eq.js';

function Engineers() {
    const [engineers, setEngineers] = useState([]);

    useEffect(() => {
        fetchEngineers().then(data => setEngineers(data));
    }, []);

    return (
        <div id="engineers">
            <h2>Welcome to Engineering ⚙️</h2>
            <div className="engineers-grid">
                {engineers.length > 0 ? (
                    engineers.map(engineer => (
                        <div key={engineer.id} className="engineer">
                            <h3>{engineer.name}</h3>
                            <ul>
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
                                        <strong>Rank:</strong> {engineer.rank}
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
                                        {engineer.experience.years} years
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        <strong>Skills:</strong>{' '}
                                        {engineer.experience.skills.join(', ')}
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
                                        renderEquipment(engineer.equipment),
                                    ),
                                }}
                            />
                        </div>
                    ))
                ) : (
                    <p className="loading">Loading Engineers ⚙️...</p>
                )}
            </div>
        </div>
    );
}

export default Engineers;
