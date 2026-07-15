import CrewComponent from './CrewComponent';

function Scientists({ isRaw }) {
    return (
        <CrewComponent
            isRaw={isRaw}
            role="scientists"
            title="Medical Bay"
            crewType="scientists"
            emoji="⚗︎"
        />
    );
}

export default Scientists;
