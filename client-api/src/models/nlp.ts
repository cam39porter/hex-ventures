export class NLPResponse {
  entities: NLPEntity[];
  constructor() {
    this.entities = [];
  }
}

export class NLPEntity {
  name: string;
  type: string;
  metadata: NLPMetadata;
  constructor(data) {
    this.name = data.name;
    this.type = data.type;
    this.metadata = data.metadata ? new NLPMetadata(data.metadata) : null;
  }
}

class NLPMetadata {
  wikipedia: string;
  mid: string;
  constructor(data) {
    this.wikipedia = data.wikipedia_url;
    this.mid = data.mid;
  }
}