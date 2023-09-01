import { IFieldGenerator, ImportModel } from './interface';
import { Type } from '../fields';
import { faker } from '@faker-js/faker';

export class TimeGen implements IFieldGenerator {
  type: Type = 'time';

  src_api_model(name: string): string {
    return `readonly ${name}!: string;`;
  }

  src_api_mapper_fromReq(name: string): string {
    return `${name}: Temporal.PlainTime.from(req.${name}),`;
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
    return `${name}: domain.record.${name}.toString({smallestUnit: 'second'}),`;
  }

  src_data_mapper_from(name: string): string {
    return `entity.${name} = domain.${name}.toString({smallestUnit: 'second'});`;
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
    return `Temporal.PlainTime.from(data.${name}),`;
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
    return `${name}: z.string().refine(v => validator.isTime(v, { hourFormat: "hour24", mode: "withSeconds" }), { message: "Invalid time" }),`;
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
    return `readonly ${name}: Temporal.PlainTime,`;
  }

  test_unit_api_fromCreateReq_pair(name: string): [string, string] {
    const time = this.randomTime();
    return [
      `${name}: '${time}',`,
      `${name}: Temporal.PlainTime.from('${time}'),`,
    ];
  }

  test_unit_api_fromUpdateReq_pair(name: string): [string, string] {
    const time = this.randomTime();
    return [
      `${name}: '${time}',`,
      `${name}: Temporal.PlainTime.from('${time}'),`,
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

  randomTime(): string {
    const h = faker.number
      .int({
        min: 0,
        max: 23,
      })
      .toString()
      .padStart(2, '0');
    const m = faker.number
      .int({
        min: 0,
        max: 59,
      })
      .toString()
      .padStart(2, '0');
    const s = faker.number
      .int({
        min: 0,
        max: 59,
      })
      .toString()
      .padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  test_unit_api_toPrincipalRes_pair(name: string): [string, string] {
    const time = this.randomTime();
    return [
      `${name}: Temporal.PlainTime.from('${time}'),`,
      `${name}: '${time}',`,
    ];
  }

  test_unit_api_toRes_pair(name: string): [string, string] {
    const time = this.randomTime();
    return [
      `${name}: Temporal.PlainTime.from('${time}'),`,
      `${name}: '${time}',`,
    ];
  }

  test_unit_data_fromPrincipal_pair(name: string): [string, string] {
    const time = this.randomTime();
    return [
      `${name}: Temporal.PlainTime.from('${time}'),`,
      `${name}: '${time}',`,
    ];
  }

  test_unit_data_fromRecord_pair(name: string): [string, string] {
    const time = this.randomTime();
    return [
      `${name}: Temporal.PlainTime.from('${time}'),`,
      `${name}: '${time}',`,
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
    const time = this.randomTime();
    return [
      `${name}: '${time}',`,
      `${name}: Temporal.PlainTime.from('${time}'),`,
    ];
  }

  test_unit_data_toPrincipal_pair(name: string): [string, string] {
    const time = this.randomTime();
    return [
      `${name}: '${time}',`,
      `${name}: Temporal.PlainTime.from('${time}'),`,
    ];
  }

  test_unit_data_toRecord_pair(name: string): [string, string] {
    const time = this.randomTime();
    return [
      `${name}: '${time}',`,
      `${name}: Temporal.PlainTime.from('${time}'),`,
    ];
  }

  test_unit_service_create_model(name: string): string {
    return `${name}: Temporal.PlainTime.from('${this.randomTime()}'),`;
  }

  test_unit_service_get_model(name: string): string {
    return `${name}: Temporal.PlainTime.from('${this.randomTime()}'),`;
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
      () => `${name}: Temporal.PlainTime.from('${this.randomTime()}'),`,
    );
  }

  test_unit_service_update_model(name: string): string {
    return `${name}: Temporal.PlainTime.from('${this.randomTime()}'),`;
  }
}
