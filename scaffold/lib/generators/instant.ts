import { IFieldGenerator, ImportModel } from './interface';
import { Type } from '../fields';
import { faker } from '@faker-js/faker';

export class InstantGen implements IFieldGenerator {
  type: Type = 'instant';

  src_api_model(name: string): string {
    return `readonly ${name}!: string;`;
  }

  src_api_mapper_fromReq(name: string): string {
    return `${name}: Temporal.Instant.from(req.${name}),`;
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
    return `entity.${name} = new Date(domain.${name}.epochMilliseconds);`;
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
    return `Temporal.Instant.fromEpochMilliseconds(data.${name}.valueOf()),`;
  }

  src_data_model(name: string): string {
    return `@Property() ${name}!: Date;`;
  }

  src_zod_import(): ImportModel[] {
    return [];
  }

  src_zod_model(name: string): string {
    return `${name}: z.string().datetime({ offset: false }),`;
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
    return `readonly ${name}: Temporal.Instant,`;
  }

  test_unit_api_fromCreateReq_pair(name: string): [string, string] {
    const now = faker.date.anytime().toISOString();
    return [`${name}: '${now}',`, `${name}: Temporal.Instant.from('${now}'),`];
  }

  test_unit_api_fromUpdateReq_pair(name: string): [string, string] {
    const now = faker.date.anytime().toISOString();
    return [`${name}: '${now}',`, `${name}: Temporal.Instant.from('${now}'),`];
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
    const now = faker.date.anytime().toISOString();
    return [`${name}: Temporal.Instant.from('${now}'),`, `${name}: '${now}',`];
  }

  test_unit_api_toRes_pair(name: string): [string, string] {
    const now = faker.date.anytime().toISOString();
    return [`${name}: Temporal.Instant.from('${now}'),`, `${name}: '${now}',`];
  }

  test_unit_data_fromPrincipal_pair(name: string): [string, string] {
    const now = faker.date.anytime();
    const s = now.toISOString();
    return [
      `${name}: Temporal.Instant.from('${s}'),`,
      `${name}: new Date('${s}'),`,
    ];
  }

  test_unit_data_fromRecord_pair(name: string): [string, string] {
    const now = faker.date.anytime();
    const s = now.toISOString();
    return [
      `${name}: Temporal.Instant.from('${s}'),`,
      `${name}: new Date('${s}'),`,
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
    const now = faker.date.anytime();
    const s = now.toISOString();
    return [
      `${name}: new Date('${s}'),`,
      `${name}: Temporal.Instant.from('${s}'),`,
    ];
  }

  test_unit_data_toPrincipal_pair(name: string): [string, string] {
    const now = faker.date.anytime();
    const s = now.toISOString();
    return [
      `${name}: new Date('${s}'),`,
      `${name}: Temporal.Instant.from('${s}'),`,
    ];
  }

  test_unit_data_toRecord_pair(name: string): [string, string] {
    const now = faker.date.anytime();
    const s = now.toISOString();
    return [
      `${name}: new Date('${s}'),`,
      `${name}: Temporal.Instant.from('${s}'),`,
    ];
  }

  test_unit_service_create_model(name: string): string {
    return `${name}: Temporal.Instant.from('${faker.date
      .anytime()
      .toISOString()}'),`;
  }

  test_unit_service_get_model(name: string): string {
    return `${name}: Temporal.Instant.from('${faker.date
      .anytime()
      .toISOString()}'),`;
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
        `${name}: Temporal.Instant.from('${faker.date
          .anytime()
          .toISOString()}'),`,
    );
  }

  test_unit_service_update_model(name: string): string {
    return `${name}: Temporal.Instant.from('${faker.date
      .anytime()
      .toISOString()}'),`;
  }
}
