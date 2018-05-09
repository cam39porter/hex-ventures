import language from "@google-cloud/language";
import { NLPEntity, NLPEntityResponse } from "../models/nlp";

const client = process.env.GCLOUD_APPLICATION_CREDENTIALS
  ? new language.LanguageServiceClient({
      keyFilename: process.env.GCLOUD_APPLICATION_CREDENTIALS
    })
  : new language.LanguageServiceClient();

function getNLPResponse(
  body: string,
  contentType: string
): Promise<NLPEntityResponse> {
  const document = {
    content: body,
    type: contentType
  };
  return client
    .analyzeEntitySentiment({ document })
    .then(results => {
      const resp = new NLPEntityResponse();
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

export { getNLPResponse };
