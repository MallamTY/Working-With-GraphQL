var {buildSchema} = require('graphql');
var express = require('express');
var {graphqlHTTP} = require('express-graphql');
const { v4: uuidv4 } = require('uuid');


const app = express();


const schemaRandom = buildSchema(`
    type Query {
        integerRoute: [Int]!
        stringRoute: String!
        quoteOfTheDay: String!
        diceRoller(numDices: Int!, numSides: Int!): [Int!]
    }
`)


const rootResolverRandom = {

    quoteOfTheDay: () => {
        const random = Math.random()
        return random < 0.5 ? `It's a day ${random} less than 0.5` : `It's a day ${random} greater than 0.5`
    },

    integerRoute: () => {
        return [1, 2, 3].map(() => 1 + Math.floor(Math.random() * 6));
    },

    stringRoute: () => {
        return 'This is me using GraphQL for the first time.'
    },

    diceRoller: ({numDices, numSides}) => {
        var result = [];
        for (var  i = 0; i < numDices; i++) {
            result.push(1+ Math.floor(Math.random() * (numSides || 6)))
            
        }
        return result;
    }
}


/**
 *  USing Object Types in GraphQL
 */

const schemaDie = buildSchema(`
    type Die {
        numSides: Int!
        rollOnce: Int!
        roll(numRolls: Int!): [Int]
    }

    type Query {
        pickDie(numSides: Int): Die
    }
`)


class Die {
    constructor(numSides) {
        this.numSides = numSides;
    }

    numSides() {
        return this.numSides;
    }

    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides);
    }

    roll({numRolls}) {
        var result = [];
        for (var i = 0; i < numRolls; i++) {
             result.push(this.rollOnce());
            
        }
        return result;
    }
}

    var rootResolverDie = {
        pickDie: ({ numSides }) => {
            return new Die(numSides || 6);
        },
    }





/**
 * Mutation and Input Types in GraphQL
 * 
 */

const schema = buildSchema(`
    input TaskType {
        status: String!
        description: String!
    }

    input updateTaskType {
        status: String
        description: String
    }


    type Message {
        id: ID!
        status: String
        description: String
    }

    type Query {
        getTask(id: ID!): Message
    }

    type Mutation {
        createTask(params: TaskType): Message
        updateTask(id: ID!, params: updateTaskType): Message
    }

`)


  
  

class Task {

    constructor(id, {status, description}) {
        this.id = id;
        this.status = status;
        this.description = description;

    }
}

var taskDB = {};

 const rootResolver = {
    getTask: ({id}) => {
        if (!taskDB[id]) {
            throw new Error(`Task not found in the database !!!`)
        }
        return new Task(id, taskDB.id);
    },

    createTask:  (params) => {
        // Create a random id for our "database".
        var id = uuidv4()
    
        taskDB[id] = params;
        return new Task(id, params.params)
    },

    updateTask: ({id, params}) => {
        if (!taskDB[id]) {
            throw new Error(`Task does not exist in the database !!!`);
        }
        taskDB[id] = params;
        return new Task(id, params);
    }
 }



app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: rootResolver,
    graphiql: true
}))


const port = 5000
app.listen(port, () => {
    console.log(`\n GraphQL API server running on port ${port}........`);
});


