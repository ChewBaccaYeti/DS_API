/*  
    MongoDB Atlas 
    MongoDBCompass / Studio 3T
    mongoose
    node.js
    Typescript
*/
require('dotenv').config({ path: '.env' });

const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const username = process.env.MONGO_AEGIS_ADMIN;
const password = process.env.MONGO_AEGIS_PASS;
const database = process.env.MONGO_AEGIS_DB;

app.use(helmet());
app.use(helmet.hsts());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

app.use(cors({ origin: '*' }));

app.get('/', (req: any, res: any) => {
    res.send(
        'Hello, World!' +
        'You must looking for Mining Deck. Go to the `/miners` endpoint.' +
        'If you are looking for Engineer Deck - go to the `/engineers` endpoint.' +
        'If you need Medical Bay - go to /scientists endpoint.'
    )
})
app.get('/miners', async (req: any, res: any) => {
    try {
        if (!mongoose.connection.readyState) {
            return res.status(503).send('MongoDB not connected')
        }
        const minersData = await Miner.find()
        res.json(minersData)
    } catch(error) {
        res.status(500).send('Error acquired during miners data fetching override.')
        console.error(error)
    }
})

app.get('/engineers', async (req: any, res: any) => {
    try {
        if (!mongoose.connection.readyState) {
            return res.status(503).send('MongoDB not connected')
        }
        const engineersData = await Engineer.find()
        res.json(engineersData)
    } catch(error) {
        res.status(500).send('Error acquired during engineers data fetching override.') 
        console.error(error)
    }
})

app.get('/scientists', async (req: any, res: any) => {
    try {
        if (!mongoose.connection.readyState) {
            return res.status(503).send('MongoDB not connected')
        }
        const scientistsData = await Scientist.find()
        res.json(scientistsData)
    } catch(error) {
        res.status(500).send('Error acquired during scientists data fetching override.') 
        console.error(error)
    }
})

mongoose.connect(
    `mongodb+srv://${username}:${password}@${database}.fm1e1.mongodb.net/${database}?retryWrites=true&w=majority&appName=${database}`
).then(() => {
    fetchMiners()
    fetchEngineers()
    fetchScientists()
    console.log('Connection successful.')
    app.listen(3000, () => {
        console.log(`Server running at http://localhost:3000`)
    })
}).catch((error: Error) => {
    if(error instanceof Error) {
        throw error
    }
    console.error(error)
});

const certificationSchema = new Schema({
    title: { type: String, required: true },
    dateObtained: { type: Date, required: true }
});

const equipmentSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    acquired: { type: Date, required: true }
});

const lastMissionSchema = new Schema({
    missionName: String,
    completedDate: Date
});

const CEC_schema = new Schema({
    name : String,
    role: {
        name: String,
        symbol: String,
    },
    avatar: String,
    species: String,
    citizenship: String,
    rank: { type: Number, min: 0 },
    directive: String,
    id: { type: String, required: true },
    birthdate: Date,
    experience: {
        years: Number,
        skills: [String],
    },
    certifications: [certificationSchema],
    equipment: [equipmentSchema],
    activeStatus: Boolean,
    lastMission: [lastMissionSchema]
});

const Miner = mongoose.model('Miner', CEC_schema, 'Miners');
const Engineer = mongoose.model('Engineer', CEC_schema, 'Engineers');
const Scientist = mongoose.model('Scientist', CEC_schema, 'Scientists');

interface CEC_Type {
    name: string;
    role: {
        name: string;
        symbol: string
    };
    avatar: string;
    species: string;
    citizenship: string;
    rank: number;
    directive: string;
    id: string;
    birthdate: Date;
    experience: {
        years: number,
        skills: string[]
    };
    certifications: {
        title: string,
        dateObtained: Date
    }[];
    equipment: {
        name: string;
        type: string;
        acquired: Date
    }[];
    activeStatus: boolean;
    lastMission: {
        missionName: string,
        completedDate: Date
    }
};

class Prototype {
    name : string;
    role: object;
    avatar: string;
    species: string;
    citizenship: string;
    rank: number;
    directive: string;
    id: string;
    birthdate: Date;
    experience: object;
    certifications: object;
    equipment: object;
    activeStatus: boolean;
    lastMission: object

    constructor( 
        name : string, 
        role: object, 
        avatar: string, 
        species: string, 
        citizenship: string, 
        rank: number, 
        directive: string, 
        id: string,
        birthdate: Date,
        experience: object,
        certifications: object,
        equipment: object,
        activeStatus: boolean,
        lastMission: object
    ) {
            this.name = name
            this.role = role
            this.avatar = avatar
            this.species = species
            this.citizenship = citizenship
            this.rank = rank
            this.directive = directive
            this.id = id
            this.birthdate = birthdate
            this.experience = experience
            this.certifications = certifications
            this.equipment = equipment
            this.activeStatus = activeStatus
            this.lastMission = lastMission
    }
    RIG_data() {
        console.log(this)
    }
};

const fetchMiners = async () => {
    try {
        const minersData: CEC_Type[] = await Miner.find() as CEC_Type[]
        console.log('Miners: ', minersData)
        const minersArray = minersData.map((miner: CEC_Type) => {
            return new Prototype(
                miner.name,
                miner.role,
                miner.avatar,
                miner.species,
                miner.citizenship,
                miner.rank,
                miner.directive,
                miner.id,
                miner.birthdate,
                miner.experience,
                miner.certifications,
                miner.equipment,
                miner.activeStatus,
                miner.lastMission
            )
        })
        minersArray.forEach(miner => miner.RIG_data())
    } catch(error) {
        console.error(error)
    } 
};

const fetchEngineers = async () => {
    try {
        const engineersData: CEC_Type[] = await Engineer.find() as CEC_Type[]
        console.log('Engineers: ', engineersData)
        const engineersArray = engineersData.map((engineer: CEC_Type) => {
            return new Prototype(
                engineer.name,
                engineer.role,
                engineer.avatar,
                engineer.species,
                engineer.citizenship,
                engineer.rank,
                engineer.directive,
                engineer.id,
                engineer.birthdate,
                engineer.experience,
                engineer.certifications,
                engineer.equipment,
                engineer.activeStatus,
                engineer.lastMission
            )
        })
        engineersArray.forEach(engineer => engineer.RIG_data())
    } catch(error) {
        console.error(error)
    }
};

const fetchScientists = async () => {
    try {
        const scientistsData: CEC_Type[] = await Scientist.find() as CEC_Type[]
        console.log('Scientist: ', scientistsData)
        const scientistsArray = scientistsData.map((scientist: CEC_Type) => {
            return new Prototype(
                scientist.name,
                scientist.role,
                scientist.avatar,
                scientist.species,
                scientist.citizenship,
                scientist.rank,
                scientist.directive,
                scientist.id,
                scientist.birthdate,
                scientist.experience,
                scientist.certifications,
                scientist.equipment,
                scientist.activeStatus,
                scientist.lastMission
            )
        })
        scientistsArray.forEach(scientist => scientist.RIG_data())
    } catch(error) {
        console.error(error)
    }
};