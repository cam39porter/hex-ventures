import { GraphNode } from "../models/graph-node";
import { Node } from "neo4j-driver/types/v1";
import { Capture } from "../../db/models/capture";
import { CAPTURE_LABEL, SESSION_LABEL } from "../../db/helpers/labels";
import { Session } from "../../db/models/session";

export function formatNode(node: Node, isRoot: boolean): GraphNode {
  return new GraphNode(
    node.properties["id"],
    node.labels[0],
    node.properties["body"] ||
      node.properties["name"] ||
      node.properties["title"] ||
      node.properties["url"] ||
      "Untitled",
    isRoot ? 0 : 1
  );
}

export function formatCapture(capture: Capture, isRoot: boolean): GraphNode {
  return new GraphNode(
    capture.urn.toRaw(),
    CAPTURE_LABEL.name,
    capture.body,
    isRoot ? 0 : 1
  );
}

export function formatSession(session: Session, isRoot: boolean): GraphNode {
  return new GraphNode(
    session.urn.toRaw(),
    SESSION_LABEL.name,
    session.title,
    isRoot ? 0 : 1
  );
}