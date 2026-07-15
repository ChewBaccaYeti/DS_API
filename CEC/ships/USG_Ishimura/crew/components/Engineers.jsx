import CrewComponent from './CrewComponent';

function Engineers({ isRaw }) {
    return (
        <CrewComponent
            isRaw={isRaw}
            role="engineers"
            title="Engineering"
            crewType="engineers"
            emoji="⚙︎"
        />
    );
}

export default Engineers;
