/*!
 * GraphQL Express Server
 */
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as requestContext from "request-context";

import { makeExecutableSchema } from "graphql-tools";

import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import * as formidable from "express-formidable";
import * as fs from "fs";
import { GraphQLSchema } from "graphql";
import * as path from "path";
import captureResolvers from "./capture/resolver";
import { authFilter, initAuth } from "./filters/auth";
import surfaceResolvers from "./surface/resolver";
import { importEvernoteNote } from "./upload/services/evernote-import";

const schema = fs.readFileSync(
  path.join(__dirname, "../data-template/schema.graphql"),
  "utf8"
);

/*!
 * Make the schema executable
 */

const executableSchema: GraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: [captureResolvers, surfaceResolvers]
});

initAuth();

const PORT = 8080;
const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: ["https://web-client-prod-dot-opit-193719.appspot.com"],
      methods: ["GET", "POST"],
      optionsSuccessStatus: 200
    })
  );
} else {
  app.use(cors());
}

app.use(requestContext.middleware("request"));
app.use(authFilter);

// bodyParser is needed just for POST.
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({ schema: executableSchema })
);
app.use(formidable());
app.post("/uploadHtml", (req, res) => {
  fs.readFile(req["files"].file.path, (err, data) => {
    if (err) {
      res.status(500).end("Could not read file");
    }
    if (req["files"].file.type !== "text/html") {
      res.status(400).end("Unsupported content type");
    }
    importEvernoteNote(data)
      .then(b => {
        if (b) {
          res.sendStatus(200);
        } else {
          res.status(409).end("Object already exists, please delete it first");
        }
      })
      .catch(error => {
        console.log(error);
        res.sendStatus(500);
      });
  });
});

app.get("/graphiql", graphiqlExpress({ endpointURL: "/graphql" })); // if you want GraphiQL enabled

app.listen(PORT, () => {
  console.log("Api listening on port " + PORT);
});
