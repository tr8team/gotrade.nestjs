import { IFieldGenerator } from './generators/interface';
import * as os from 'os';
import { indentString } from './config-gen';
import { processImport } from './generators/import';
import { faker } from '@faker-js/faker';

type Type =
  | 'number'
  | 'boolean'
  | 'string'
  | 'date'
  | 'time'
  | 'instant'
  | 'email'
  | 'uuid'
  | 'url';

interface Field {
  type: Type;
  name: string;
}

type Vars = {
  src: {
    api: {
      model: string;
      mapper: {
        fromReq: string;
        toRes: string;
        imports: string;
      };
    };
    zod: {
      model: string;
      imports: string;
    };
    data: {
      model: string;
      mapper: {
        imports: string;
        from: string;
        to: string;
      };
    };
    domain: {
      imports: string;
      model: string;
    };
  };

  test: {
    unit: {
      api: {
        imports: string;
        fromCreateReq: {
          subj: string;
          ex: string;
        };
        fromUpdateReq: {
          subj: string;
          ex: string;
        };
        toPrincipalRes: {
          subj: string;
          ex: string;
          id: string;
        };
        toRes: {
          subj: string;
          ex: string;
          id: string;
        };
      };
      data: {
        imports: string;
        toDomain: {
          subj: string;
          ex: string;
          id: string;
        };
        toPrincipal: {
          subj: string;
          ex: string;
          id: string;
        };
        toRecord: {
          subj: string;
          ex: string;
          id: string;
        };
        fromRecord: {
          subj: string;
          ex: string;
        };
        fromPrincipal: {
          subj: string;
          ex: string;
        };
      };
      service: {
        imports: string;
        search: string;
        get: {
          model: string;
          id: string;
          id2: string;
        };
        create: {
          model: string;
          id: string;
        };
        update: {
          model: string;
          id: string;
        };
        delete: string;
      };
    };
  };
};

class AllGenerator {
  constructor(private readonly generators: IFieldGenerator[]) {}

  split(a: [string, string][]): [string[], string[]] {
    const b = a.reduce(
      (acc, [k, v]) => {
        acc[0].push(k);
        acc[1].push(v);
        return acc;
      },
      [[], []] as [string[], string[]],
    );
    return b;
  }

  gen(field: Field[]): Vars {
    const fields = field
      .map(
        ({ name, type }) =>
          [name, this.generators.find(gen => gen.type === type)] as [
            string,
            IFieldGenerator,
          ],
      )
      .filter(([, g]) => g != null);
    const unit_api_fromCreateReq = this.split(
      fields.map(([name, g]) => g.test_unit_api_fromCreateReq_pair(name)),
    );

    const unit_api_fromUpdateReq = this.split(
      fields.map(([name, g]) => g.test_unit_api_fromUpdateReq_pair(name)),
    );

    const unit_api_toPrincipalRes = this.split(
      fields.map(([name, g]) => g.test_unit_api_toPrincipalRes_pair(name)),
    );

    const unit_api_toRes = this.split(
      fields.map(([name, g]) => g.test_unit_api_toRes_pair(name)),
    );

    const unit_data_toDomain = this.split(
      fields.map(([name, g]) => g.test_unit_data_toDomain_pair(name)),
    );

    const unit_data_toPrincipal = this.split(
      fields.map(([name, g]) => g.test_unit_data_toPrincipal_pair(name)),
    );

    const unit_data_toRecord = this.split(
      fields.map(([name, g]) => g.test_unit_data_toRecord_pair(name)),
    );

    const unit_data_fromRecord = this.split(
      fields.map(([name, g]) => g.test_unit_data_fromRecord_pair(name)),
    );

    const unit_data_fromPrincipal = this.split(
      fields.map(([name, g]) => g.test_unit_data_fromPrincipal_pair(name)),
    );

    const r = faker.number.int({ min: 1, max: 5 });
    const search = fields
      .map(([name, g]) => g.test_unit_service_search(name, r))
      .reduce(
        (prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])),
        [] as string[][],
      )
      .map(x => `{\n${indentString(x.join(os.EOL), 2)}\n},`)
      .join(os.EOL);

    return {
      src: {
        api: {
          model: indentString(
            fields.map(([name, g]) => g.src_api_model(name)).join(os.EOL),
            2,
          ),
          mapper: {
            fromReq: indentString(
              fields
                .map(([name, g]) => g.src_api_mapper_fromReq(name))
                .join(os.EOL),
              6,
            ),
            toRes: indentString(
              fields
                .map(([name, g]) => g.src_api_mapper_toRes(name))
                .join(os.EOL),
              6,
            ),
            imports: processImport(
              fields.map(([, g]) => g.src_api_mapper_imports()).flat(),
            ),
          },
        },
        data: {
          model: indentString(
            fields.map(([name, g]) => g.src_data_model(name)).join(os.EOL),
            2,
          ),
          mapper: {
            imports: processImport(
              fields.map(([, g]) => g.src_data_mapper_imports()).flat(),
            ),
            from: indentString(
              fields
                .map(([name, g]) => g.src_data_mapper_from(name))
                .join(os.EOL),
              4,
            ),
            to: indentString(
              fields
                .map(([name, g]) => g.src_data_mapper_to(name))
                .join(os.EOL),
              6,
            ),
          },
        },
        domain: {
          imports: processImport(
            fields.map(([, g]) => g.src_domain_imports()).flat(),
          ),
          model: indentString(
            fields.map(([name, g]) => g.src_domain_model(name)).join(os.EOL),
            4,
          ),
        },
        zod: {
          model: indentString(
            fields.map(([name, g]) => g.src_zod_model(name)).join(os.EOL),
            2,
          ),
          imports: processImport(
            fields.map(([, g]) => g.src_zod_import()).flat(),
          ),
        },
      },
      test: {
        unit: {
          api: {
            imports: processImport(
              fields.map(([, g]) => g.test_unit_api_imports()).flat(),
            ),
            fromCreateReq: {
              subj: indentString(unit_api_fromCreateReq[0].join(os.EOL), 8),
              ex: indentString(unit_api_fromCreateReq[1].join(os.EOL), 8),
            },
            fromUpdateReq: {
              subj: indentString(unit_api_fromUpdateReq[0].join(os.EOL), 8),
              ex: indentString(unit_api_fromUpdateReq[1].join(os.EOL), 8),
            },
            toPrincipalRes: {
              subj: indentString(unit_api_toPrincipalRes[0].join(os.EOL), 10),
              ex: indentString(unit_api_toPrincipalRes[1].join(os.EOL), 10),
              id: '',
            },
            toRes: {
              subj: indentString(unit_api_toRes[0].join(os.EOL), 12),
              ex: indentString(unit_api_toRes[1].join(os.EOL), 10),
              id: faker.string.uuid(),
            },
          },
          data: {
            imports: processImport(
              fields.map(([, g]) => g.test_unit_data_imports()).flat(),
            ),
            toDomain: {
              subj: indentString(unit_data_toDomain[0].join(os.EOL), 8),
              ex: indentString(unit_data_toDomain[1].join(os.EOL), 12),
              id: faker.string.uuid(),
            },
            toPrincipal: {
              subj: indentString(unit_data_toPrincipal[0].join(os.EOL), 8),
              ex: indentString(unit_data_toPrincipal[1].join(os.EOL), 10),
              id: faker.string.uuid(),
            },
            toRecord: {
              subj: indentString(unit_data_toRecord[0].join(os.EOL), 8),
              ex: indentString(unit_data_toRecord[1].join(os.EOL), 8),
              id: faker.string.uuid(),
            },
            fromRecord: {
              subj: indentString(unit_data_fromRecord[0].join(os.EOL), 8),
              ex: indentString(unit_data_fromRecord[1].join(os.EOL), 8),
            },
            fromPrincipal: {
              subj: indentString(unit_data_fromPrincipal[0].join(os.EOL), 10),
              ex: indentString(unit_data_fromPrincipal[1].join(os.EOL), 8),
            },
          },
          service: {
            imports: processImport(
              fields.map(([, g]) => g.test_unit_service_imports()).flat(),
            ),
            search: indentString(search, 10),
            get: {
              model: indentString(
                fields
                  .map(([name, g]) => g.test_unit_service_get_model(name))
                  .join(os.EOL),
                12,
              ),
              id: faker.string.uuid(),
              id2: faker.string.uuid(),
            },
            create: {
              model: indentString(
                fields
                  .map(([name, g]) => g.test_unit_service_create_model(name))
                  .join(os.EOL),
                12,
              ),
              id: faker.string.uuid(),
            },
            update: {
              model: indentString(
                fields
                  .map(([name, g]) => g.test_unit_service_update_model(name))
                  .join(os.EOL),
                12,
              ),
              id: faker.string.uuid(),
            },
            delete: faker.string.uuid(),
          },
        },
      },
    };
  }
}

export { Field, Type, AllGenerator };
