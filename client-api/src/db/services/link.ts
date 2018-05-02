import { StatementResult } from "neo4j-driver/types/v1";
import { toLinkUrn } from "../../helpers/urn-helpers";
import { executeQuery } from "../db";
import { Link } from "../models/link";

export function upsert(url: string, captureId: string): Promise<Link> {
  const params = { id: toLinkUrn(url), url };
  const query = `
    MATCH (capture:Capture {id: "${captureId}"})
    MERGE (link:Link {
      id: {id},
      url: {url}
    })
    ON CREATE SET link.created = TIMESTAMP()
    CREATE (link)<-[:LINKS_TO]-(capture)
    RETURN link`;
  return executeQuery(query, params).then((result: StatementResult) => {
    return result.records[0].get("link") as Link;
  });
}
