export interface IPagination {
    pageNumber: number,
    pageSize: number,
    totalPages: number
}

export interface IPagedList {
    items: Array<any>,
    pagination: IPagination
}

export class PagedList implements IPagedList {
    items: any[] = [];
    pagination: IPagination = { pageNumber: 1, pageSize: 20, totalPages: 0 };
}