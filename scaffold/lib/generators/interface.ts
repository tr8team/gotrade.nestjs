import { Type } from '../fields';

export interface ImportModel {
  from: string;
  name: string;
  mode: 'multi' | '*' | 'default';
}

export interface IFieldGenerator {
  type: Type;

  src_api_model(name: string): string;

  src_api_mapper_imports(): ImportModel[];

  src_api_mapper_fromReq(name: string): string;

  src_api_mapper_toRes(name: string): string;

  src_zod_import(): ImportModel[];

  src_zod_model(name: string): string;

  src_data_model(name: string): string;

  src_data_mapper_imports(): ImportModel[];

  src_data_mapper_from(name: string): string;

  src_data_mapper_to(name: string): string;

  src_domain_imports(): ImportModel[];

  src_domain_model(name: string): string;

  test_unit_api_imports(): ImportModel[];

  test_unit_api_fromCreateReq_pair(name: string): [string, string];

  test_unit_api_fromUpdateReq_pair(name: string): [string, string];

  test_unit_api_toPrincipalRes_pair(name: string): [string, string];

  test_unit_api_toRes_pair(name: string): [string, string];

  test_unit_data_imports(): ImportModel[];

  test_unit_data_toDomain_pair(name: string): [string, string];

  test_unit_data_toPrincipal_pair(name: string): [string, string];

  test_unit_data_toRecord_pair(name: string): [string, string];

  test_unit_data_fromRecord_pair(name: string): [string, string];

  test_unit_data_fromPrincipal_pair(name: string): [string, string];

  test_unit_service_imports(): ImportModel[];

  test_unit_service_search(name: string, amt: number): string[];

  test_unit_service_get_model(name: string): string;

  test_unit_service_create_model(name: string): string;

  test_unit_service_update_model(name: string): string;
}
