export interface BaseDto<T> {
    id: T;
}

export interface BaseNameDto<T> extends BaseDto<T> {
    name: string;
}

export enum ProjectStatusEnum {
    Draft = 'draft',
    Published = 'published'
}

export interface ProjectDto extends BaseNameDto<number> {
    settings: any;
    previewImage: any;
    statusName: ProjectStatusEnum;
}