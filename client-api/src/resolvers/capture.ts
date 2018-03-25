import { PageInfo, Capture, CaptureCollection, Tag } from "../models";
import { db } from "../db/db";

const table = "capture";

export default {
  Query: {
    getCaptures(_, params, context): Promise<CaptureCollection> {
      return getAll().then(captures =>
        page(captures, params.start, params.count)
      );
    },
    getCapture(_, params, context): Promise<Capture> {
      return get(params.id);
    },
    search(_, params, context): Promise<CaptureCollection> {
      return search(params.rawQuery).then(captures =>
        page(captures, params.start, params.count)
      );
    }
  },
  Mutation: {
    createCapture(_, params, context): Promise<Capture> {
      return insert(params.body).then(get);
    }
  }
};

function insert(body: string): Promise<string> {
  return db(table)
    .insert({ body })
    .returning("ID")
    .then(idArr => idArr[0]);
}

function get(id: string): Promise<Capture> {
  return db
    .select()
    .from(table)
    .where("ID", id)
    .then(format);
}

function getAll(): Promise<[Capture]> {
  return db
    .select()
    .from(table)
    .orderBy("created", "desc")
    .then(formatAll);
}

function search(rawQuery: string): Promise<[Capture]> {
  return db
    .raw(
      `SELECT * FROM capture WHERE MATCH(body) AGAINST('${rawQuery}' IN NATURAL LANGUAGE MODE) ORDER BY created DESC`
    )
    .then(arr => arr[0])
    .then(formatAll);
}

function format(arr): Capture {
  return new Capture(arr[0]);
}

function formatAll(arr) {
  return arr.map(dao => new Capture(dao));
}

function page(
  captures: [Capture],
  start: number,
  count: number
): CaptureCollection {
  const collection: CaptureCollection = new CaptureCollection(
    // TODO cole move paging to mysql
    captures.slice(start, start + count),
    new PageInfo(start, count, captures.length)
  );
  return collection;
}
