/*!
 * Type definitions (typeDefs) that are turned into the schema
 */

export default `
  type Edge {
    source: String!
    destination: String!
    type: EdgeType!
    salience: Float 
  }

  type Graph {
    nodes: [Node!]!
    edges: [Edge!]!
  }

  type Node {
    id: String!
    type: NodeType!
    text: String!
    level: Int!
  }

  enum NodeType {
    CAPTURE, 
    ENTITY,
    TAG
  }

  enum EdgeType {
    REFERENCES,
    TAGGED_WITH
  }

  type SearchResults {
    graph: Graph! # for generating the graph visualization,
    pageInfo: PageInfo!
  }

  type PageInfo {
    start: Int!
    count: Int!
    total: Int!
  }

  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    search(
      rawQuery: String!
      start: Int = 0
      count: Int = 10
    ): SearchResults!
    get(id: String!): Graph!
  }

  type Mutation {
    createCapture(body: String!): Graph!
  }
`;
