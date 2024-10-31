import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import renderScientists from '../scripts/helpers/renderScientists.js';
import {
    renderCertifications,
    renderEquipment,
} from '../scripts/helpers/cert_eq.js';

function Scientists() {
    const [scientists, setScientists] = useState([]);

    useEffect(() => {
        renderScientists().then(data => setScientists(data));
    }, []);

    return (
        <div id="scientists">
            <h2>Welcome to Medical Bay 🔬</h2>
            <div className="scientists-grid">
                {scientists.length > 0 ? (
                    scientists.map(scientist => (
                        <div key={scientist.id} className="scientist">
                            <h3>{scientist.name}</h3>
                            <ul>
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
                                        <strong>Rank:</strong> {scientist.rank}
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
                                        {scientist.experience.years} years
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        <strong>Skills:</strong>{' '}
                                        {scientist.experience.skills.join(', ')}
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
                                        renderEquipment(scientist.equipment),
                                    ),
                                }}
                            />
                        </div>
                    ))
                ) : (
                    <p>Loading Scientists 🔬...</p>
                )}
            </div>
        </div>
    );
}

export default Scientists;
