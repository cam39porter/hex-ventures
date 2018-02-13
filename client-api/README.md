# Client Api

This directory contains a Node server implemented using the [Express](https://expressjs.com/) framework. Core components include a [GrapqhQL](http://graphql.org/) function.

## Starting the server

> npm i <br>
> npm start

#### Hot reload all the things!

> npm run start:dev

## Hitting the server

Via curl:
> curl -v "http://localhost:3000/graphql?query=\{testString\}"

Via graphical
> http://localhost:3000/graphiql
<br>
query { 
  testString
}

## Debugging

In vscode, hit F5. (Must not be running the server elsewhere, or set up a different port) Set breakpoints as desired and hit the app in a way defined above.
