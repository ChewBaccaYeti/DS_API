import { Model, HydratedDocument } from 'mongoose';
import { CrewMember, CrewPrototype } from './CEC.interface';

/**
 * Load a crew collection, wrap in domain objects, and log a summary.
 *
 * Kept as a debug helper — do not call from request handlers in production.
 */
export async function processAndLogCrew(
    model: Model<CrewMember>,
    modelName: string,
): Promise<CrewPrototype[]> {
    const docs: HydratedDocument<CrewMember>[] = await model.find();
    const members: CrewPrototype[] = docs.map(
        d => new CrewPrototype(d.toObject() as CrewMember),
    );

    console.log(`[${modelName}] ${members.length} loaded`);
    for (const m of members) m.dumpRigData();

    return members;
}
