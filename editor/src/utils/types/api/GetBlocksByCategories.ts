interface BaseDto<T> {
  id: T;
}

interface BaseNameDto<T> extends BaseDto<T> {
  name: string;
}

export interface FileDto {
  id: string;
  path: string;
  fullPath: string;
  originalFileName: string;

  fullPathWebP: string | null;
  fullPathJp2: string | null;

  dominantColor: string;
}

export interface GetBlocksByCategoriesDto extends BaseNameDto<number> {
  items: GetBlockByCategoriesItemDto[];
}

export interface GetBlockByCategoriesItemDto extends BaseNameDto<number> {
  parentId: number;
  files: Array<FileDto>;
}

export interface InterfaceElement {
  id: string;
  name: string;
  parents: Array<any>;
  files: Array<any>;
  children: Array<any>;
}

interface BlockConfig {
  dbId: number;
}

export interface BlockConfigDto {
  blockConfig?: BlockConfig;
}
