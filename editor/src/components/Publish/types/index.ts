import ObjectKeys from '../../../utils/types/ObjectKeys';

export enum ServiceInterfaceType {
  PublishAPI = 'PublishAPI'
}

interface ServiceInterface {
  type: ServiceInterfaceType;
}

export interface MemberDto {
  email: string;
  listId: string;
}

export interface PublishedSubscriptionDto {
  name?: string;
  email?: string;
}
/**
 * publish API for airtap-publish-ruler
 */
export interface IPublishAPI extends ServiceInterface {
  postMailchimpMember(projectId: number, payload: MemberDto): void;
  profilesToggleProjectLike(userName: string, id: number): void;
  profilesToggleProfileFollow(userName: string): void;
  profilesToggleProjectView(userName: string, id: number): void;
  publishSubscribe(projectId: number, dto: PublishedSubscriptionDto): void;
}

class ServiceCollection {
  private _collection: ObjectKeys<any> = {};

  public get<TInterface extends ServiceInterface>(type: ServiceInterfaceType): TInterface {
    const implementation = <TInterface>this._collection[type];

    if (!implementation) throw new Error('[ServiceCollection]: not found implementation for type' + type);

    if (implementation.type != type)
      throw new Error('[ServiceCollection]: failed type ' + implementation.type + '!=' + type);

    return implementation;
  }

  public register<TInterface extends ServiceInterface, TImplementation extends TInterface>(creation: TImplementation) {
    this._collection[creation.type] = creation;
  }
}

/**
 * for tie airtap-frontend and airtap-publish-ruler
 * it must be static
 */
export const serviceCollection = new ServiceCollection();
