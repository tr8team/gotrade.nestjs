import { IFieldGenerator, ImportModel } from './interface';
import { Type } from '../fields';
import { faker } from '@faker-js/faker';

export class DateGen implements IFieldGenerator {
  type: Type = 'date';

  src_api_model(name: string): string {
    return `readonly ${name}!: string;`;
  }

  src_api_mapper_fromReq(name: string): string {
    return `${name}: Temporal.PlainDate.from(req.${name}),`;
  }

  src_api_mapper_imports(): ImportModel[] {
    return [
      {
        from: '@js-temporal/polyfill',
        name: 'Temporal',
        mode: 'multi',
      },
    ];
  }

  src_api_mapper_toRes(name: string): string {
    return `${name}: domain.record.${name}.toString(),`;
  }

  src_data_mapper_from(name: string): string {
    return `entity.${name} = domain.${name}.toString();`;
  }

  src_data_mapper_imports(): ImportModel[] {
    return [
      {
        from: '@js-temporal/polyfill',
        name: 'Temporal',
        mode: 'multi',
      },
    ];
  }

  src_data_mapper_to(name: string): string {
    return `Temporal.PlainDate.from(data.${name}),`;
  }

  src_data_model(name: string): string {
    return `@Property() ${name}!: string;`;
  }

  src_zod_import(): ImportModel[] {
    return [
      {
        from: 'validator',
        name: 'validator',
        mode: 'default',
      },
    ];
  }

  src_zod_model(name: string): string {
    return `${name}: z.string().refine(v => validator.isDate(v, { format: "YYYY-MM-DD" }), { message: "Invalid date" }),`;
  }

  src_domain_imports(): ImportModel[] {
    return [
      {
        mode: 'multi',
        from: '@js-temporal/polyfill',
        name: 'Temporal',
      },
    ];
  }

  src_domain_model(name: string): string {
    return `readonly ${name}: Temporal.PlainDate,`;
  }

  test_unit_api_fromCreateReq_pair(name: string): [string, string] {
    const date = faker.date.anytime();
    const val = date.toISOString().split('T')[0];
    return [
      `${name}: '${val}',`,
      `${name}: Temporal.PlainDate.from('${val}'),`,
    ];
  }

  test_unit_api_fromUpdateReq_pair(name: string): [string, string] {
    const date = faker.date.anytime();
    const val = date.toISOString().split('T')[0];
    return [
      `${name}: '${val}',`,
      `${name}: Temporal.PlainDate.from('${val}'),`,
    ];
  }

  test_unit_api_imports(): ImportModel[] {
    return [
      {
        from: '@js-temporal/polyfill',
        name: 'Temporal',
        mode: 'multi',
      },
    ];
  }

  test_unit_api_toPrincipalRes_pair(name: string): [string, string] {
    const date = faker.date.anytime();
    const val = date.toISOString().split('T')[0];
    return [
      `${name}: Temporal.PlainDate.from('${val}'),`,
      `${name}: '${val}',`,
    ];
  }

  test_unit_api_toRes_pair(name: string): [string, string] {
    const date = faker.date.anytime();
    const val = date.toISOString().split('T')[0];
    return [
      `${name}: Temporal.PlainDate.from('${val}'),`,
      `${name}: '${val}',`,
    ];
  }

  test_unit_data_fromPrincipal_pair(name: string): [string, string] {
    const date = faker.date.anytime();
    const val = date.toISOString().split('T')[0];
    return [
      `${name}: Temporal.PlainDate.from('${val}'),`,
      `${name}: '${val}',`,
    ];
  }

  test_unit_data_fromRecord_pair(name: string): [string, string] {
    const date = faker.date.anytime();
    const val = date.toISOString().split('T')[0];
    return [
      `${name}: Temporal.PlainDate.from('${val}'),`,
      `${name}: '${val}',`,
    ];
  }

  test_unit_data_imports(): ImportModel[] {
    return [
      {
        from: '@js-temporal/polyfill',
        name: 'Temporal',
        mode: 'multi',
      },
    ];
  }

  test_unit_data_toDomain_pair(name: string): [string, string] {
    const date = faker.date.anytime();
    const val = date.toISOString().split('T')[0];
    return [
      `${name}: '${val}',`,
      `${name}: Temporal.PlainDate.from('${val}'),`,
    ];
  }

  test_unit_data_toPrincipal_pair(name: string): [string, string] {
    const date = faker.date.anytime();
    const val = date.toISOString().split('T')[0];
    return [
      `${name}: '${val}',`,
      `${name}: Temporal.PlainDate.from('${val}'),`,
    ];
  }

  test_unit_data_toRecord_pair(name: string): [string, string] {
    const date = faker.date.anytime();
    const val = date.toISOString().split('T')[0];
    return [
      `${name}: '${val}',`,
      `${name}: Temporal.PlainDate.from('${val}'),`,
    ];
  }

  test_unit_service_create_model(name: string): string {
    const date = faker.date.anytime();
    const val = date.toISOString().split('T')[0];
    return `${name}: Temporal.PlainDate.from('${val}'),`;
  }

  test_unit_service_get_model(name: string): string {
    const date = faker.date.anytime();
    const val = date.toISOString().split('T')[0];
    return `${name}: Temporal.PlainDate.from('${val}'),`;
  }

  test_unit_service_imports(): ImportModel[] {
    return [
      {
        from: '@js-temporal/polyfill',
        name: 'Temporal',
        mode: 'multi',
      },
    ];
  }

  test_unit_service_search(name: string, amt: number): string[] {
    return [...Array(amt)].map(
      () =>
        `${name}: Temporal.PlainDate.from('${
          faker.date.anytime().toISOString().split('T')[0]
        }'),`,
    );
  }

  test_unit_service_update_model(name: string): string {
    const date = faker.date.anytime();
    const val = date.toISOString().split('T')[0];
    return `${name}: Temporal.PlainDate.from('${val}'),`;
  }
}
