var {graphql, buildSchema} = require('graphql');



const schema = buildSchema(`
    type Query {
        integerRoute: Int
        stringRoute: String
    }
`)


const rootValue = {
    integerRoute: () => {
        const firstNumber = 500;
        const secondNumber = 1000;
        return (result = firstNumber + secondNumber);;
    },
    stringRoute: () => {
        return 'This is me using GraphQL for the first time.'
    }
}


graphql({
    schema,
    source: "{integerRoute stringRoute}",
    rootValue
}).then((response) => {
    console.log(response);
})