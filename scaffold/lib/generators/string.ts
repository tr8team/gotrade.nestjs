import { IFieldGenerator, ImportModel } from './interface';
import { Type } from '../fields';
import { faker } from '@faker-js/faker';

export class StringGen implements IFieldGenerator {
  type: Type = 'string';

  src_api_model(name: string): string {
    return `readonly ${name}!: string;`;
  }

  src_api_mapper_fromReq(name: string): string {
    return `${name}: req.${name},`;
  }

  src_api_mapper_imports(): ImportModel[] {
    return [];
  }

  src_api_mapper_toRes(name: string): string {
    return `${name}: domain.record.${name},`;
  }

  src_data_mapper_from(name: string): string {
    return `entity.${name} = domain.${name};`;
  }

  src_data_mapper_imports(): ImportModel[] {
    return [];
  }

  src_data_mapper_to(name: string): string {
    return `data.${name},`;
  }

  src_data_model(name: string): string {
    return `@Property() ${name}!: string;`;
  }

  src_zod_import(): ImportModel[] {
    return [];
  }

  src_zod_model(name: string): string {
    return `${name}: z.string(),`;
  }

  src_domain_imports(): ImportModel[] {
    return [];
  }

  src_domain_model(name: string): string {
    return `readonly ${name}: string,`;
  }

  test_unit_api_fromCreateReq_pair(name: string): [string, string] {
    const val = faker.lorem.sentence();
    return [`${name}: '${val}',`, `${name}: '${val}',`];
  }

  test_unit_api_fromUpdateReq_pair(name: string): [string, string] {
    const val = faker.lorem.sentence();
    return [`${name}: '${val}',`, `${name}: '${val}',`];
  }

  test_unit_api_imports(): ImportModel[] {
    return [];
  }

  test_unit_api_toPrincipalRes_pair(name: string): [string, string] {
    const val = faker.lorem.sentence();
    return [`${name}: '${val}',`, `${name}: '${val}',`];
  }

  test_unit_api_toRes_pair(name: string): [string, string] {
    const val = faker.lorem.sentence();
    return [`${name}: '${val}',`, `${name}: '${val}',`];
  }

  test_unit_data_fromPrincipal_pair(name: string): [string, string] {
    const val = faker.lorem.sentence();
    return [`${name}: '${val}',`, `${name}: '${val}',`];
  }

  test_unit_data_fromRecord_pair(name: string): [string, string] {
    const val = faker.lorem.sentence();
    return [`${name}: '${val}',`, `${name}: '${val}',`];
  }

  test_unit_data_imports(): ImportModel[] {
    return [];
  }

  test_unit_data_toDomain_pair(name: string): [string, string] {
    const val = faker.lorem.sentence();
    return [`${name}: '${val}',`, `${name}: '${val}',`];
  }

  test_unit_data_toPrincipal_pair(name: string): [string, string] {
    const val = faker.lorem.sentence();
    return [`${name}: '${val}',`, `${name}: '${val}',`];
  }

  test_unit_data_toRecord_pair(name: string): [string, string] {
    const val = faker.lorem.sentence();
    return [`${name}: '${val}',`, `${name}: '${val}',`];
  }

  test_unit_service_create_model(name: string): string {
    return `${name}: '${faker.lorem.sentence()}',`;
  }

  test_unit_service_get_model(name: string): string {
    return `${name}: '${faker.lorem.sentence()}',`;
  }

  test_unit_service_imports(): ImportModel[] {
    return [];
  }

  test_unit_service_search(name: string, amt: number): string[] {
    return [...Array(amt)].map(() => `${name}: '${faker.lorem.sentence()}',`);
  }

  test_unit_service_update_model(name: string): string {
    return `${name}: '${faker.lorem.sentence()}',`;
  }
}
