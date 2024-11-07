export function renderCertifications(certifications) {
    return certifications
        .map(
            cert => `
        <li>
            <strong>${cert.title}</strong> (Obtained on: ${new Date(cert.dateObtained).toLocaleDateString()})
        </li>
    `,
        )
        .join('');
}

export function renderEquipment(equipment) {
    return equipment
        .map(
            eq => `
        <li>
            <strong>${eq.name}</strong> (${eq.type}, Acquired on: ${new Date(eq.acquired).toLocaleDateString()})
        </li>
    `,
        )
        .join('');
}
