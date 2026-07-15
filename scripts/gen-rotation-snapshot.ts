/**
 * Regenerate the on-disk rotation snapshot and inject it into README.md.
 *
 * Reads live crew from Mongo (using the standard .env), builds a mermaid
 * graph via the same generator the API uses, writes:
 *
 *   - Ishimura_crew_rotation.mmd   (raw mermaid source)
 *   - README.md                    (between ROTATION-SNAPSHOT markers)
 *
 * Usage:
 *   npm run gen:rotation
 */

require('dotenv').config({ path: '.env' });

import mongoose from 'mongoose';
import { promises as fs } from 'fs';
import path from 'path';

import Miner from '../CEC/ships/USG_Ishimura/crew/models/miner.model';
import Engineer from '../CEC/ships/USG_Ishimura/crew/models/engineer.model';
import Scientist from '../CEC/ships/USG_Ishimura/crew/models/scientist.model';
import {
    buildRotationMermaid,
    type CrewLike,
} from '../CEC/ships/USG_Ishimura/bridge/utils/mermaidGraph';

const START = '<!-- ROTATION-SNAPSHOT:START -->';
const END = '<!-- ROTATION-SNAPSHOT:END -->';

const ROOT = path.resolve(__dirname, '..');
const MMD_PATH = path.join(ROOT, 'Ishimura_crew_rotation.mmd');
const README_PATH = path.join(ROOT, 'README.md');

function connectionString(): string {
    const u = process.env.MONGO_CEC_ADMIN;
    const p = process.env.MONGO_CEC_PASS;
    const c = process.env.MONGO_CEC_CONN;
    const d = process.env.MONGO_CEC_DB;
    if (!u || !p || !c || !d) {
        throw new Error('Missing MONGO_CEC_* env vars');
    }
    return `mongodb+srv://${u}:${p}@${c}.fm1e1.mongodb.net/${d}?retryWrites=true&w=majority&appName=${c}`;
}

async function main() {
    const slotHours = Number(process.env.ROTATION_SLOT_HOURS ?? '4');

    await mongoose.connect(connectionString());

    const [miners, engineers, scientists] = await Promise.all([
        Miner.find().lean<CrewLike[]>(),
        Engineer.find().lean<CrewLike[]>(),
        Scientist.find().lean<CrewLike[]>(),
    ]);

    const { mermaid, slot } = buildRotationMermaid(
        { miners, engineers, scientists },
        { slotHours },
    );

    const header = [
        `%% Auto-generated on ${new Date().toISOString()}`,
        `%% Slot #${slot.slotIndex} (${slotHours}h) — ${slot.startsAt} → ${slot.endsAt}`,
        `%% Do not hand-edit. Regenerate: npm run gen:rotation`,
        '',
    ].join('\n');

    const mmdOut = header + mermaid + '\n';
    await fs.writeFile(MMD_PATH, mmdOut, 'utf8');
    console.log(`✓ wrote ${path.relative(ROOT, MMD_PATH)}`);

    const readme = await fs.readFile(README_PATH, 'utf8');
    const block =
        '```mermaid\n' +
        mermaid +
        '\n```\n\n' +
        `_Snapshot generated ${new Date().toISOString()}. Live version: \`GET /api/rotations/mermaid\`._\n`;

    if (!readme.includes(START) || !readme.includes(END)) {
        console.warn(
            `⚠ README markers not found (${START} / ${END}); skipping README update.`,
        );
    } else {
        const before = readme.substring(
            0,
            readme.indexOf(START) + START.length,
        );
        const after = readme.substring(readme.indexOf(END));
        const patched = `${before}\n\n${block}\n${after}`;
        await fs.writeFile(README_PATH, patched, 'utf8');
        console.log(`✓ patched ${path.relative(ROOT, README_PATH)}`);
    }

    await mongoose.disconnect();
}

main().catch(err => {
    console.error('gen-rotation-snapshot failed:', err);
    mongoose.disconnect().finally(() => process.exit(1));
});
