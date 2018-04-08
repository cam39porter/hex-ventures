import language from "@google-cloud/language";
import { NLPEntityResponse, NLPEntity } from "../models/nlp";

const client = new language.LanguageServiceClient();

function getNLPResponse(body: string): Promise<NLPEntityResponse> {
  const document = {
    content: body,
    type: "PLAIN_TEXT"
  };
  return client
    .analyzeEntitySentiment({ document: document })
    .then(results => {
      let resp = new NLPEntityResponse();
      results[0].entities.forEach(element => {
        const entity = new NLPEntity(element);
        resp.entities.push(entity);
      });
      return resp;
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
}

// Detects the sentiment of the text

export { getNLPResponse };
