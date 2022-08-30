/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ListInfo {
  id?: string
  name?: string
}

export interface ErrorDto {
  code: ErrorCode
  description?: string
}

export enum ErrorCode {
  UserDataIsNotFound = 'UserDataIsNotFound',
  UserEmailIsNotFound = 'UserEmailIsNotFound',
  AccessTokenFailed = 'AccessTokenFailed',
  AccessTokenIsNull = 'AccessTokenIsNull',
  DTOIsInvalid = 'DTOIsInvalid',
  UserIsBlocked = 'UserIsBlocked',
  EmailIsNotValid = 'EmailIsNotValid',
  TokenIsNotValid = 'TokenIsNotValid',
  IdentityError = 'IdentityError',
  IsExistSameAirtapDomain = 'IsExistSameAirtapDomain',
  IsExistSameCustomDomain = 'IsExistSameCustomDomain',
  NotFound = 'NotFound',
  Unavalable = 'Unavalable',
}

export interface MailchimpSettingsDto {
  apiKey?: string
}

export interface ZapierGeneratingApiKeyDto {
  /** @format guid */
  apiKey: string

  /** @format int32 */
  projectId: number
}

export interface ZapierMemberDto {
  email?: string
}

export interface ZapierSettingsDto {
  webHook?: string
}

export interface AccountDto {
  userName: string

  /** User's subscription plan ("Free", "Starter", "Pro" and etc.) */
  plan: UserPlanDto

  /**
   * User Id
   * @format guid
   */
  userId: string

  /** Username */
  fullName: string

  /** User e-mail */
  email: string
  avatar?: FileDto

  /** Roles assigned to user ("Admin", "RegularUser" and etc.) */
  roles: string[]

  /** @format date-time */
  registrationDate: string
  blocked: boolean
  owned: boolean
  isPublic: boolean
  isAdmin: boolean
}

export interface UserPlanDto {
  /** @format int32 */
  id: number
  category: PlanCategory
  name?: string

  /** @format int32 */
  months: number

  /** @format date-time */
  startUtcDateTime: string

  /** @format date-time */
  expirationUtcDateTime?: string

  /** @format int32 */
  currentProjects: number

  /** @format int32 */
  submissions: number
  features: PlanFeaturesDto

  /** @format int32 */
  unreadNotifications: number
}

export enum PlanCategory {
  Free = 'Free',
  Starter = 'Starter',
  Pro = 'Pro',
}

export interface PlanFeaturesDto {
  /** @format int32 */
  publishedProjects: number

  /** @format int32 */
  projectPages: number

  /** @format int32 */
  draftProjects: number

  /** @format int32 */
  storage: number

  /** @format int32 */
  submissions: number
  isAirtapHosting: boolean
  isCustomHosting: boolean
  isDisabledAirtapBranding: boolean
  isCustomFavicon: boolean
  isCustomShareImage: boolean
  isGoogleAnalytics: boolean
  isShortLinks: boolean
}

export interface FileDto {
  /** @format guid */
  id: string
  path?: string
  isImageFromSocial: boolean
  fullPath?: string
  originalFileName?: string
  fullPathWebP?: string
  fullPathJp2?: string
  dominantColor?: string
  type: FileType

  /** @format int32 */
  width: number

  /** @format int32 */
  height: number

  /** @format double */
  size: number
}

export enum FileType {
  Favicon = 'Favicon',
  SocialImage = 'SocialImage',
  Preview = 'Preview',
  TemplatePreview = 'TemplatePreview',
  TemplateFull = 'TemplateFull',
  ProfileAvatar = 'ProfileAvatar',
  ProfileCover = 'ProfileCover',
  Elements = 'Elements',
  Community = 'Community',
}

export interface ProblemDetails {
  type?: string
  title?: string

  /** @format int32 */
  status?: number
  detail?: string
  instance?: string
  extensions?: Record<string, any>
}

export interface GetProfileDto {
  fullName: string
  personalWebSite?: string
  alias: string
  isPublic: boolean
  bio?: string
  socialLinks?: EditedSocialLinkDto[]
  avatar?: FileDto
  cover?: FileDto
}

export interface EditedSocialLinkDto {
  type: SocialLinkType
  domain?: string
  link?: string
}

export enum SocialLinkType {
  Twitter = 'Twitter',
  Facebook = 'Facebook',
  Linkedin = 'Linkedin',
  Instagram = 'Instagram',
  Dribble = 'Dribble',
  Behance = 'Behance',
  Pinterest = 'Pinterest',
  Tumblr = 'Tumblr',
  Telegram = 'Telegram',
  Flickr = 'Flickr',
  Youtube = 'Youtube',
  Etsy = 'Etsy',
  Medium = 'Medium',
  FiveHundrendPixels = 'FiveHundrendPixels',
}

export interface EditedProfileDto {
  avatar?: FileDto
}

export interface UniqueAliasDto {
  isUniqued: boolean
}

export interface ChangePasswordDto {
  oldPassword?: string
  newPassword?: string
  repeatNewPassword?: string
}

export interface UserProfileDto {
  /** @format guid */
  id: string

  /** User's name */
  name?: string

  /** User's surname */
  surname?: string

  /** User's email */
  email?: string

  /** Flag indicating that user is subscribed to newsletter */
  isSubscribedToNewsletter: boolean

  /** Flag indicating that user confirmed email */
  isConfirmedEmail: boolean

  /** User logins in social */
  logins?: string[]
}

export interface CredentialsDto {
  userName?: string
  password?: string
  rememberMe: boolean
}

export interface WelcomeDto {
  email?: string
  token?: string
}

export interface RegistrationUserDto {
  /** User email */
  email: string
  userName?: string

  /** User password */
  password: string

  /** User firstName + LastName */
  fullName: string
}

export interface ExternalAuthDto {
  /** LoginProvider 'Google', 'Facebook', 'Twitter' */
  loginProvider: LoginProviderType

  /** User AccessToken */
  accessToken: string
}

export enum LoginProviderType {
  Unknown = 'Unknown',
  Facebook = 'Facebook',
  Google = 'Google',
  Twitter = 'Twitter',
}

export interface ForgotPasswordDto {
  /** Receiver email */
  email: string
}

export interface VerifyResetPasswordDto {
  email: string
  token: string
}

export interface ResetPasswordDto {
  newPassword: string
  confirmedPassword: string
  email: string
  token: string
}

export interface ConfirmationEmailDto {
  email: string
  token: string
}

export interface SendChangedEmailCodeDto {
  newEmail?: string
}

export interface VerifyChangedEmailDto {
  newEmail?: string
  newPassword?: string
  token?: string
  code?: string
}

export type PagedFeedProjectsDto = PagedListOfFeedProjectDto & {
  tags?: BaseNameDtoOfInteger
}

export type BaseNameDtoOfInteger = BaseDtoOfInteger & { name?: string }

export interface BaseDtoOfInteger {
  /** @format int32 */
  id: number
}

export interface PagedListOfFeedProjectDto {
  pagination: PaginationDto
  items: FeedProjectDto[]
}

export interface PaginationDto {
  /** @format int32 */
  pageNumber: number

  /** @format int32 */
  pageSize: number

  /** @format int32 */
  totalRecords: number

  /** @format int32 */
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface FeedProjectDto {
  /** @format int32 */
  id: number
  name: string
  url: string
  preview?: FileDto

  /** @format int32 */
  views: number

  /** @format int32 */
  likes: number
  hasLike: boolean

  /** Alias */
  authorUserName: string
  authorName: string
  authorAvatar?: FileDto
  authorPictureUrl?: string
  hasView: boolean
}

export enum FeedProjectFilterType {
  All = 'All',
  Following = 'Following',
}

export enum FeedProjectSort {
  Latest = 'Latest',
  MostAppreciated = 'MostAppreciated',
}

export type PagedFeedUsersDto = PagedListOfWelcomeProfileDto & {
  tags?: BaseNameDtoOfInteger
}

export interface PagedListOfWelcomeProfileDto {
  pagination: PaginationDto
  items: WelcomeProfileDto[]
}

export interface WelcomeProfileDto {
  userName: string
  fullName: string
  bio?: string
  avatar?: FileDto
  followed: boolean
  followsYou: boolean
  owned: boolean
  projects?: WelcomeProfileProjectDto[]
}

export interface WelcomeProfileProjectDto {
  name?: string
  preview?: FileDto
  url?: string
}

export enum FileCategory {
  Templates = 'Templates',
  Projects = 'Projects',
  InterfaceElements = 'InterfaceElements',
  Pages = 'Pages',
  Profiles = 'Profiles',
  Notion = 'Notion',
  ProjectCategories = 'ProjectCategories',
  HelpPages = 'HelpPages',
}

export interface PagedListOfHelpPageDto {
  pagination: PaginationDto
  items: HelpPageDto[]
}

export interface HelpPageDto {
  /** @format int32 */
  id: number
  title: string
  description: string
  link: string

  /** @format date-time */
  createdUtcDateTime: string
  image: FileDto
}

export interface PaginationFilter {
  /** @format int32 */
  pageNumber: number

  /** @format int32 */
  pageSize: number
}

export interface NotPagedListOfInterfaceElementDto {
  items: InterfaceElementDto[]
}

export interface InterfaceElementDto {
  /** @format int32 */
  id: number
  name?: string
  description?: string

  /** @format guid */
  whoCreatedId: string
  whoCreated?: string
  data?: string
  config?: string

  /** @format date-time */
  createdUtcDateTime: string

  /** @format date-time */
  hidedUtcDateTime?: string

  /** @format int32 */
  orderNumber: number
  children: InterfaceElementRelationDto[]
  parents: InterfaceElementRelationDto[]
  files: FileDto[]

  /** @format double */
  filesSize: number

  /** @format date-time */
  lastChangedDateTime: string
}

export type InterfaceElementRelationDto = BaseNameDtoOfInteger & {
  type: InterfaceElementType
}

export enum InterfaceElementType {
  StyleElement = 'StyleElement',
  Block = 'Block',
  BlockCategory = 'BlockCategory',
  Templates = 'Templates',
  UserFavorites = 'UserFavorites',
}

export interface PagedListOfInterfaceElementDto {
  pagination: PaginationDto
  items: InterfaceElementDto[]
}

export type InterfaceElementHistoryItemDto = BaseDtoOfInteger & {
  whoCreated?: string
  createdUtcDateTime: string
  config?: string
}

export interface SaveInterfaceElementConfigDto {
  config?: string
}

export type GetBlocksByCategoriesDto = BaseNameDtoOfInteger & {
  items?: GetBlockByCategoriesItemDto[]
}

export type GetBlockByCategoriesItemDto = BaseNameDtoOfInteger & {
  parentId: number
  orderNumber: number
  files?: FileDto[]
}

export enum UserFavoriteType {
  Font = 'Font',
  Block = 'Block',
  ProfileFollow = 'ProfileFollow',
  ProfileProjectLike = 'ProfileProjectLike',
  ProfileProjectView = 'ProfileProjectView',
}

export interface EditorLogDto {
  /** @format int32 */
  projectId?: number

  /** @format int32 */
  pageId?: number

  /** @format int32 */
  templateId?: number

  /** @format int32 */
  blockId?: number
  message?: string
}

export type PagedNotifications = PagedListOfNotificationDto & {
  unreadCount: number
}

export interface PagedListOfNotificationDto {
  pagination: PaginationDto
  items: NotificationDto[]
}

export interface NotificationDto {
  /** @format int32 */
  id: number
  whoMade: WhoMadeDto
  project?: NotificationProjectDto
  isRead: boolean
  action: NotificationAction

  /** @format date-time */
  createdUtcDateTime: string
}

export interface WhoMadeDto {
  fullName?: string
  avatar?: FileDto
  alias?: string
}

export interface NotificationProjectDto {
  /** @format int32 */
  id: number
  name?: string
  url?: string
  preview?: FileDto
}

export enum NotificationAction {
  ProfileFollow = 'ProfileFollow',
  ProjectLike = 'ProjectLike',
}

export interface PlanDto {
  /** @format int32 */
  id: number
  name?: string
  category: PlanCategory

  /** @format int32 */
  months: number

  /** @format int32 */
  pricePerMonth: number
  isPlus: boolean

  /** @format int32 */
  paddlePlanId: number
  features: PlanFeaturesDto
}

export interface CheckCouponDto {
  /** @format decimal */
  oldPrice: number

  /** @format decimal */
  price: number
}

export interface PagedListOfProfileDto {
  pagination: PaginationDto
  items: ProfileDto[]
}

export interface ProfileDto {
  /** @format int32 */
  profileNumber: number
  userName: string
  fullName: string
  personalWebsite?: string
  bio?: string
  socialLinks?: SocialLinkDto[]
  avatar?: FileDto
  cover?: FileDto

  /** @format int32 */
  projects: number

  /** @format int32 */
  likes: number

  /** @format int32 */
  views: number

  /** @format int32 */
  following: number

  /** @format int32 */
  followers: number

  /** Current user has subscribed */
  followed: boolean
  followsYou: boolean
  owned: boolean
}

export interface SocialLinkDto {
  type: SocialLinkType
  url?: string
}

export interface PagedListOfProfileFollowerDto {
  pagination: PaginationDto
  items: ProfileFollowerDto[]
}

export interface ProfileFollowerDto {
  fullName: string
  userName: string
  bio?: string

  /** @format int32 */
  followers: number

  /** @format int32 */
  following: number

  /** @format int32 */
  likes: number
  avatar?: FileDto

  /** Current user has subcribed to profile */
  followed: boolean

  /** 3 first projects */
  projects?: ProfileFollowerProjectDto[]
  owned: boolean
  followsYou: boolean
}

export interface ProfileFollowerProjectDto {
  name?: string
  preview?: FileDto

  /** @format int32 */
  likes: number
  hasLike: boolean

  /** @format int32 */
  views: number
  hasView: boolean
  url?: string
}

export interface PagedListOfErrorDto {
  pagination: PaginationDto
  items: ErrorDto[]
}

export interface PagedListOfProfileProjectDto {
  pagination: PaginationDto
  items: ProfileProjectDto[]
}

export interface ProfileProjectDto {
  /** @format int32 */
  id: number
  name: string
  url: string

  /** @format int32 */
  views: number
  hasView: boolean

  /** @format int32 */
  likes: number
  hasLike: boolean
  preview?: FileDto
  published: boolean
}

export type OwnedProfileProjects = PagedListOfProfileProjectDto & {
  all: number
  published: number
  drafts: number
}

export enum OwnedProfileProjectsFilterType {
  All = 'All',
  Published = 'Published',
  Drafts = 'Drafts',
}

export interface PagedListOfSubcribedProfileProjectDto {
  pagination: PaginationDto
  items: SubcribedProfileProjectDto[]
}

export type SubcribedProfileProjectDto = ProfileProjectDto & {
  profileAlias?: string
}

export type ProjectCategoriesDto = BaseNameDtoOfInteger & {
  description?: string
  projectsCount: number
  icon?: FileDto
  tags?: number[]
}

export type ProjectCategoryWithTagsDto = BaseNameDtoOfInteger & {
  icon?: FileDto
  tags?: BaseNameDtoOfInteger[]
}

export type ProjectCategoryDto = BaseNameDtoOfInteger & {
  description?: string
  projectsCount: number
  tags?: ProjectTagDto[]
  icon?: FileDto
}

export type ProjectTagDto = BaseNameDtoOfInteger & { projectsCount: number }

export interface BaseProjectPageDto {
  /**
   * Page identifier. For save changes in subsequent queries
   * @format int32
   */
  id: number

  /**
   * Project identifier. Make for future if user will have several projects with one template
   * @format int32
   */
  projectId: number

  /** Page name */
  name?: string

  /** Mark page like homePage */
  isHomePage: boolean
  url?: string

  /** Open graph images */
  socialImage?: FileDto
  previewImage?: FileDto
  title?: string
  description?: string
  keywords?: string

  /** Is not index page by Google, Yandex robots */
  isNoIndex: boolean

  /**
   * Last edit date
   * @format date-time
   */
  lastUpdateUtcDateTime?: string
  isPublished: boolean

  /** @format date-time */
  lastPublishedUtcDateTime?: string
  isHasUnPublishedChanges: boolean
}

export type ProjectPageDto = BaseProjectPageDto & { settings?: string }

export interface CreateProjectPageDto {
  /** @format int32 */
  templateId: number
}

export interface SaveProjectPageDto {
  title?: string
  description?: string
  keywords?: string

  /** Is not index page by Google, Yandex robots */
  isNoIndex: boolean

  /** Mark page like homePage */
  isHomePage: boolean
  url?: string
}

export interface ChangePageNameDto {
  name?: string
}

export interface PageSettingsDto {
  attachedTemplates?: AttachedTemplateDto[]
  settings?: string
}

export interface AttachedTemplateDto {
  /** @format int32 */
  templateId: number

  /** @format int32 */
  interfaceElementId: number
}

export interface ProjectPagePublishDto {
  page?: BaseProjectPageDto
}

export interface PagedListOfProjectPagePublishedHistoryDto {
  pagination: PaginationDto
  items: ProjectPagePublishedHistoryDto[]
}

export interface ProjectPagePublishedHistoryDto {
  /** @format date-time */
  publishedDate: string
  pageSettings?: string
}

export interface BaseProjectDto {
  /** @format int32 */
  id: number
  name?: string

  /** @format int32 */
  templateId: number
  status?: ProjectStatus
  statusName?: string
  projectUrl?: string
  settings: ProjectSettingsDto

  /** @format date-time */
  lastUpdateUtcDateTime?: string
  previewImage?: FileDto
  isPublishedInCommunity: boolean
}

export enum ProjectStatus {
  Draft = 'Draft',
  Published = 'Published',
}

export type ProjectSettingsDto = BaseProjectSettingsDto & {
  faviconImage?: FileDto
}

export type BaseProjectSettingsDto = DomainSettings & {
  title?: string
  description?: string
  shortUrlLink?: string
  googleAnalyticsId?: string
  googleTagManagerId?: string
  hotjarId?: string
  facebookPixelId?: string
  isAirtapBranding: boolean
  brandingTheme: BrandingThemeType
  brandingPosition: BrandingPositionType
  projectUrl?: string
}

export enum BrandingThemeType {
  White = 'White',
  Black = 'Black',
}

export enum BrandingPositionType {
  BottomRight = 'BottomRight',
  BottomLeft = 'BottomLeft',
}

export interface DomainSettings {
  /** @format int32 */
  projectId: number
  airtapDomain?: string
  customDomain?: string
  customDomainStatus: CustomDomainStatus
}

export enum CustomDomainStatus {
  NotPublished = 'NotPublished',
  Published = 'Published',
  Disabled = 'Disabled',
}

export type PagedProjectsDto = PagedListOfPagedProjectDto & { all: number }

export interface PagedListOfPagedProjectDto {
  pagination: PaginationDto
  items: PagedProjectDto[]
}

export type PagedProjectDto = BaseProjectDto & {
  likes: number
  views: number
  hasLike: boolean
  homePage?: BaseProjectPageDto
  hasAnotherPublishedPage: boolean
  pagesCount: number
  categoryId?: number
  tags?: number[]
}

export enum ProjectFilterType {
  All = 'All',
  Community = 'Community',
  Custom = 'Custom',
  Drafts = 'Drafts',
}

export interface CreatedProjectDto {
  /** @format int32 */
  projectId: number

  /** @format int32 */
  pageId: number
}

export interface CreateProjectDto {
  /** @format int32 */
  templateId?: number
  isWithBlankPage: boolean
}

export type SaveProjectSettingsDto = BaseProjectSettingsDto & object

export interface ChangeProjectNameDto {
  projectName?: string
}

export interface CheckCustomDomainStatusResultDto {
  isResolved: boolean

  /** Is Socket error? */
  isSocket: boolean

  /** Is ssl error? */
  isSSL: boolean

  /** Is HTTP error? */
  isHTTP: boolean

  /** Timeout error, throws if http request has timeout in 30 seconds  */
  isTimeout: boolean

  /** DNS Error, if IP address doesn't equal server IP address  */
  isDNS: boolean
}

export interface MovedProjectDto {
  /**
   * Customer email whom user move a project
   * We don't get access of user to all users yet, because it will not be secure
   * + customer may not register yet
   */
  whomEmail?: string

  /** @format int32 */
  projectId: number
}

export interface PublishedProjectDto {
  page?: BaseProjectPageDto
  preview?: FileDto
}

export interface CommunityProjectDto {
  name: string
  preview?: FileDto

  /** @format int32 */
  categoryId?: number
  tags: number[]
  pages: number[]

  /** @format int32 */
  likes: number

  /** @format int32 */
  views: number
  hasLike: boolean
  actionButton: CommunityProjectActionButtonDto

  /** @format date-time */
  publishedDate?: string
}

export interface CommunityProjectActionButtonDto {
  title?: string
  type: CommunityActionButtonType
  integrationType: CommunityIntegrationType
  file?: FileDto
  enabled: boolean
  link?: string
}

export enum CommunityActionButtonType {
  Form = 'Form',
  File = 'File',
  Link = 'Link',
}

export enum CommunityIntegrationType {
  Submissions = 'Submissions',
}

export interface PublishedProjectInCommunityDto {
  preview?: FileDto
}

export interface PublishedProjectPageDto {
  communityProject?: PublishedCommunityProjectDto
  profileProject?: PublishProfileProjectDto
  account?: AccountDto
  projectSettings?: PublishedProjectPageSettingsDto

  /** Object from page settings aka user config */
  pageSettings?: any
  title?: string
  description?: string
  keywords?: string
  redirectedCustomDomainLink?: string
}

export interface PublishedCommunityProjectDto {
  /** @format int32 */
  projectId: number
  name: string
  author: PublishedCommunityProjectAuthorDto
  followed: boolean
  hasLike: boolean
  owned: boolean
  currentUserAuthorized: boolean
  previousPageUrl?: string
  nextPageUrl?: string
  actionButton: PublishedCommunityProjectActionButtonDto
}

export interface PublishedCommunityProjectAuthorDto {
  fullName: string
  userName: string
  avatar?: FileDto
}

export interface PublishedCommunityProjectActionButtonDto {
  enabled: boolean
  title?: string
  type: CommunityActionButtonType
  fileName?: string

  /** @format double */
  fileSize: number
  link?: string
}

export interface PublishProfileProjectDto {
  /** @format int32 */
  id: number
  name: string
  authorFullName: string
  authorUserName: string
  authorAvatar?: FileDto
  followed: boolean
  hasLike: boolean
  owned: boolean
  currentUserAuthorized: boolean
}

export type PublishedProjectPageSettingsDto = ProjectSettingsDto & {
  socialImage?: FileDto
}

export interface PublishedSubscriptionDto {
  name?: string
  email?: string
}

export interface MemberDto {
  listId: string
  email: string
}

export type PagedSubmissions = PagedListOfSubmissionDto & { all: number }

export interface PagedListOfSubmissionDto {
  pagination: PaginationDto
  items: SubmissionDto[]
}

export interface SubmissionDto {
  /** @format int32 */
  id: number
  subscriber: SubmissionSubscriberDto
  project: SubmissionProjectDto
  action: CommunityActionButtonType
  fileName?: string
  isFavorite: boolean

  /** @format date-time */
  createdUtcDateTime: string
}

export interface SubmissionSubscriberDto {
  email: string
  alias: string
  fullName: string
  avatar?: FileDto
  pictureUrl?: string
}

export interface SubmissionProjectDto {
  /** @format int32 */
  id: number
  name?: string
  preview?: FileDto
}

export enum SubmissionsSort {
  Default = 'Default',
  Name = 'Name',
  Email = 'Email',
  ProjectsName = 'ProjectsName',
  Action = 'Action',
  DateAdded = 'DateAdded',
}

export enum SortingDirection {
  Asc = 'Asc',
  Desc = 'Desc',
}

export interface FavoriteSubmissionDto {
  isFavorite: boolean
}

export interface ExportToCSVDto {
  submissions?: number[]
}

export type PagedTemplatesDto = PagedListOfPagedTemplateDto & {
  randomId?: string
}

export interface PagedListOfPagedTemplateDto {
  pagination: PaginationDto
  items: PagedTemplateDto[]
}

export type PagedTemplateDto = BaseDto & {
  planName?: string
  files?: FileDto[]
  categories: BaseDto[]
}

export type BaseDto = BaseNameDtoOfInteger & object

export enum PageType {
  Home = 'Home',
  Inner = 'Inner',
}

export type TemplateDto = PagedTemplateDto & { description?: string }

export interface CreatedSimplyTemplateDto {
  /** @format int32 */
  id: number

  /** @format int32 */
  orderNumber: number
}

export interface CreateSimpliedTemplateDto {
  name: string
}

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  ResponseType,
} from 'axios'

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType
  /** request body */
  body?: unknown
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
  secure?: boolean
  format?: ResponseType
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private secure?: boolean
  private format?: ResponseType

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || 'https://apidev.airtap.io',
    })
    this.secure = secure
    this.format = format
    this.securityWorker = securityWorker
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  private mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.instance.defaults.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  private createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key]
      formData.append(
        key,
        property instanceof Blob
          ? property
          : typeof property === 'object' && property !== null
          ? JSON.stringify(property)
          : `${property}`
      )
      return formData
    }, new FormData())
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const responseFormat = (format && this.format) || void 0

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === 'object'
    ) {
      requestParams.headers.common = { Accept: '*/*' }
      requestParams.headers.post = {}
      requestParams.headers.put = {}

      body = this.createFormData(body as Record<string, unknown>)
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData
          ? { 'Content-Type': type }
          : {}),
        ...(requestParams.headers || {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    })
  }
}

/**
 * @title API Airtap
 * @version v1
 * @baseUrl https://apidev.airtap.io
 */
export class Api<
  SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {
  mailchimp = {
    /**
     * No description
     *
     * @tags Mailchimp
     * @name MailchimpGetLists
     * @summary Gets lists from Mailchimp.
     * @request GET:/api/integration/mailchimp/{projectId}/getLists
     */
    mailchimpGetLists: (projectId: number, params: RequestParams = {}) =>
      this.request<ListInfo[], ErrorDto[]>({
        path: `/api/integration/mailchimp/${projectId}/getLists`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mailchimp
     * @name MailchimpSetUpSettings
     * @summary Set up Mailchimp integration settings
     * @request POST:/api/integration/mailchimp/{projectId}/setUpSettings
     */
    mailchimpSetUpSettings: (
      projectId: number,
      dto: MailchimpSettingsDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/integration/mailchimp/${projectId}/setUpSettings`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mailchimp
     * @name MailchimpGetSettings
     * @summary Gets Mailchimp integration settings
     * @request POST:/api/integration/mailchimp/{projectId}/getSettings
     */
    mailchimpGetSettings: (projectId: number, params: RequestParams = {}) =>
      this.request<MailchimpSettingsDto, ErrorDto[]>({
        path: `/api/integration/mailchimp/${projectId}/getSettings`,
        method: 'POST',
        format: 'json',
        ...params,
      }),
  }
  zapier = {
    /**
     * No description
     *
     * @tags Zapier
     * @name ZapierExistedApiKey
     * @summary Check Api Key for zapier
     * @request GET:/api/integration/zapier/apikey
     */
    zapierExistedApiKey: (
      query?: { apiKey?: string },
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/integration/zapier/apikey`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zapier
     * @name ZapierGenerateApiKey
     * @summary Generate Api Key for zapier
     * @request POST:/api/integration/zapier/{projectId}/apikey
     */
    zapierGenerateApiKey: (projectId: number, params: RequestParams = {}) =>
      this.request<ZapierGeneratingApiKeyDto, ErrorDto[]>({
        path: `/api/integration/zapier/${projectId}/apikey`,
        method: 'POST',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zapier
     * @name ZapierCreateMember
     * @summary Create member via Zapier.
     * @request POST:/api/integration/zapier/{projectId}/createMember
     */
    zapierCreateMember: (
      projectId: number,
      member: ZapierMemberDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/integration/zapier/${projectId}/createMember`,
        method: 'POST',
        body: member,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zapier
     * @name ZapierSendField
     * @summary Send fields for Zapier.
     * @request POST:/api/integration/zapier/{projectId}/sendFields
     */
    zapierSendField: (projectId: number, params: RequestParams = {}) =>
      this.request<void, ErrorDto[]>({
        path: `/api/integration/zapier/${projectId}/sendFields`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zapier
     * @name ZapierSetUpSettings
     * @summary Set up  Zapier integration settings
     * @request POST:/api/integration/zapier/{projectId}/setUpSettings
     */
    zapierSetUpSettings: (
      projectId: number,
      dto: ZapierSettingsDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/integration/zapier/${projectId}/setUpSettings`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zapier
     * @name ZapierGetSettings
     * @summary Gets Zapier integration settings.
     * @request GET:/api/integration/zapier/{projectId}/getSettings
     */
    zapierGetSettings: (projectId: number, params: RequestParams = {}) =>
      this.request<ZapierSettingsDto, ErrorDto[]>({
        path: `/api/integration/zapier/${projectId}/getSettings`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  accounts = {
    /**
     * No description
     *
     * @tags Accounts
     * @name AccountsGet
     * @summary Gets the user info.
     * @request GET:/api/accounts
     */
    accountsGet: (params: RequestParams = {}) =>
      this.request<AccountDto, ErrorDto[] | ProblemDetails>({
        path: `/api/accounts`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Accounts
     * @name AccountsGetProfile
     * @summary Gets the profile for editing.
     * @request GET:/api/accounts/profiles
     */
    accountsGetProfile: (params: RequestParams = {}) =>
      this.request<GetProfileDto, ErrorDto[] | ProblemDetails>({
        path: `/api/accounts/profiles`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Accounts
     * @name AccountsEditProfile
     * @summary Edit the profile
     * @request PUT:/api/accounts/profiles
     */
    accountsEditProfile: (
      data: {
        FullName?: string | null
        PersonalWebSite?: string | null
        Alias?: string | null
        IsPublic?: boolean
        Bio?: string | null
        SocialLinks?: EditedSocialLinkDto[] | null
        AvatarId?: string | null
        Avatar?: File | null
        CoverId?: string | null
        Cover?: File | null
      },
      params: RequestParams = {}
    ) =>
      this.request<EditedProfileDto, ErrorDto[] | ProblemDetails>({
        path: `/api/accounts/profiles`,
        method: 'PUT',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Accounts
     * @name AccountsWelcome
     * @summary Edit the profile
     * @request PUT:/api/accounts/welcome
     */
    accountsWelcome: (
      data: {
        FullName?: string | null
        Bio?: string | null
        AvatarId?: string | null
        Avatar?: File | null
      },
      params: RequestParams = {}
    ) =>
      this.request<EditedProfileDto, ErrorDto[] | ProblemDetails>({
        path: `/api/accounts/welcome`,
        method: 'PUT',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Accounts
     * @name AccountsCheckAlias
     * @summary Check alias is unique
     * @request GET:/api/accounts/profiles/alias
     */
    accountsCheckAlias: (
      query?: { alias?: string | null },
      params: RequestParams = {}
    ) =>
      this.request<UniqueAliasDto, ErrorDto[] | ProblemDetails>({
        path: `/api/accounts/profiles/alias`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Accounts
     * @name AccountsChangePassword
     * @summary Change password
     * @request PATCH:/api/accounts/password
     */
    accountsChangePassword: (
      dto: ChangePasswordDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[] | ProblemDetails>({
        path: `/api/accounts/password`,
        method: 'PATCH',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),
  }
  auth = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthLogin
     * @summary Login
     * @request POST:/api/auth/login
     */
    authLogin: (dto: CredentialsDto, params: RequestParams = {}) =>
      this.request<UserProfileDto, ErrorDto[]>({
        path: `/api/auth/login`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthWelcome
     * @summary Login
     * @request POST:/api/auth/welcome
     */
    authWelcome: (dto: WelcomeDto, params: RequestParams = {}) =>
      this.request<UserProfileDto, ErrorDto[]>({
        path: `/api/auth/welcome`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthRegister
     * @summary Register the user
     * @request POST:/api/auth/register
     */
    authRegister: (dto: RegistrationUserDto, params: RequestParams = {}) =>
      this.request<UserProfileDto, ErrorDto[]>({
        path: `/api/auth/register`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthExternal
     * @summary External login by facebook, google, twitter
     * @request POST:/api/auth/external
     */
    authExternal: (dto: ExternalAuthDto, params: RequestParams = {}) =>
      this.request<UserProfileDto, ErrorDto[]>({
        path: `/api/auth/external`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthForgotPassword
     * @summary Creates a link for password reset and sends an email containing that link to a specified address
     * @request POST:/api/auth/forgot-password
     */
    authForgotPassword: (dto: ForgotPasswordDto, params: RequestParams = {}) =>
      this.request<void, ErrorDto[] | void>({
        path: `/api/auth/forgot-password`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthVerifyResetPassword
     * @summary Verified token for reseting password
     * @request POST:/api/auth/reset-password/token/verified
     */
    authVerifyResetPassword: (
      dto: VerifyResetPasswordDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/auth/reset-password/token/verified`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthResetPassword
     * @summary Changes user password
     * @request POST:/api/auth/reset-password
     */
    authResetPassword: (dto: ResetPasswordDto, params: RequestParams = {}) =>
      this.request<void, ErrorDto[]>({
        path: `/api/auth/reset-password`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthIsValidToken
     * @summary Check user is authorized
     * @request GET:/api/auth/authorized
     */
    authIsValidToken: (params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/api/auth/authorized`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthLogout
     * @summary Log user out
     * @request GET:/api/auth/logout
     */
    authLogout: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/logout`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthConfirmEmail
     * @summary Confirmation email by token
     * @request PATCH:/api/auth/email/confirmation
     */
    authConfirmEmail: (dto: ConfirmationEmailDto, params: RequestParams = {}) =>
      this.request<void, ErrorDto[]>({
        path: `/api/auth/email/confirmation`,
        method: 'PATCH',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthSendChangingEmail
     * @summary Send email for changing email
     * @request POST:/api/auth/email
     */
    authSendChangingEmail: (params: RequestParams = {}) =>
      this.request<void, ErrorDto[]>({
        path: `/api/auth/email`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthChangedEmail
     * @summary Change email
     * @request PUT:/api/auth/email
     */
    authChangedEmail: (
      dto: VerifyChangedEmailDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/auth/email`,
        method: 'PUT',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthSendChangedEmailCode
     * @summary Send verify code for changing email
     * @request POST:/api/auth/email/code
     */
    authSendChangedEmailCode: (
      dto: SendChangedEmailCodeDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/auth/email/code`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),
  }
  feedback = {
    /**
     * No description
     *
     * @tags Feedback
     * @name FeedbackSubmit
     * @summary Submit feedback
     * @request POST:/api/feedback
     */
    feedbackSubmit: (
      data: {
        Email?: string | null
        Subject?: string | null
        Description?: string | null
        Attachment?: File | null
      },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/api/feedback`,
        method: 'POST',
        body: data,
        type: ContentType.FormData,
        ...params,
      }),
  }
  feed = {
    /**
     * No description
     *
     * @tags Feed
     * @name FeedGetProjects
     * @summary Get projects for feed by filter
     * @request GET:/api/feed/projects
     */
    feedGetProjects: (
      query?: {
        Show?: 'All' | 'Following'
        SortBy?: 'Latest' | 'MostAppreciated'
        ProjectCategoryId?: number | null
        TagId?: number | null
        Search?: string | null
        PageNumber?: number
        PageSize?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<PagedFeedProjectsDto, any>({
        path: `/api/feed/projects`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Feed
     * @name FeedGetUsers
     * @summary Get users for feed by filter
     * @request GET:/api/feed/users
     */
    feedGetUsers: (
      query?: {
        Search?: string | null
        SortBy?: 'Latest' | 'MostAppreciated'
        PageNumber?: number
        PageSize?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<PagedFeedUsersDto, any>({
        path: `/api/feed/users`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  files = {
    /**
 * No description
 * 
 * @tags Files
 * @name FilesUpload
 * @summary Upload file for Notion  
/api/upload/files/Notion/0
 * @request POST:/api/upload/files/{fileCategory}/{fileCategoryId}
 */
    filesUpload: (
      fileCategory:
        | 'Templates'
        | 'Projects'
        | 'InterfaceElements'
        | 'Pages'
        | 'Profiles'
        | 'Notion'
        | 'ProjectCategories'
        | 'HelpPages',
      fileCategoryId: number,
      fileType:
        | 'Favicon'
        | 'SocialImage'
        | 'Preview'
        | 'TemplatePreview'
        | 'TemplateFull'
        | 'ProfileAvatar'
        | 'ProfileCover'
        | 'Elements'
        | 'Community',
      data: { files?: File | null },
      params: RequestParams = {}
    ) =>
      this.request<FileDto[], any>({
        path: `/api/upload/files/${fileCategory}/${fileCategoryId}`,
        method: 'POST',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
 * No description
 * 
 * @tags Files
 * @name FilesUpload2
 * @summary Upload file for Notion  
/api/upload/files/Notion/0
 * @request POST:/api/upload/files/{fileCategory}/{fileCategoryId}/{fileType}
 */
    filesUpload2: (
      fileCategory:
        | 'Templates'
        | 'Projects'
        | 'InterfaceElements'
        | 'Pages'
        | 'Profiles'
        | 'Notion'
        | 'ProjectCategories'
        | 'HelpPages',
      fileCategoryId: number,
      fileType:
        | 'Favicon'
        | 'SocialImage'
        | 'Preview'
        | 'TemplatePreview'
        | 'TemplateFull'
        | 'ProfileAvatar'
        | 'ProfileCover'
        | 'Elements'
        | 'Community',
      data: { files?: File | null },
      params: RequestParams = {}
    ) =>
      this.request<FileDto[], any>({
        path: `/api/upload/files/${fileCategory}/${fileCategoryId}/${fileType}`,
        method: 'POST',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Files
     * @name FilesSavePagePreview
     * @summary Save Page Preview
     * @request POST:/api/files/projects/{projectId}/pages/{pageId}/preview
     */
    filesSavePagePreview: (
      projectId: number,
      pageId: number,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/files/projects/${projectId}/pages/${pageId}/preview`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Files
     * @name FilesSaveProjectPreview
     * @summary Save Project Preview
     * @request POST:/api/files/projects/{projectId}/preview
     */
    filesSaveProjectPreview: (
      projectId: number,
      data: { files?: File | null },
      params: RequestParams = {}
    ) =>
      this.request<FileDto[], ErrorDto[]>({
        path: `/api/files/projects/${projectId}/preview`,
        method: 'POST',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),
  }
  helpPages = {
    /**
     * No description
     *
     * @tags HelpPages
     * @name HelpPagesGet
     * @summary Get
     * @request POST:/api/helpPages
     */
    helpPagesGet: (filter: PaginationFilter, params: RequestParams = {}) =>
      this.request<PagedListOfHelpPageDto, ErrorDto[]>({
        path: `/api/helpPages`,
        method: 'POST',
        body: filter,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  }
  interfaceElements = {
    /**
 * No description
 * 
 * @tags InterfaceElements
 * @name InterfaceElementsGet
 * @summary Get elements by type 
for blocks - /api/interface/block
for style elements - /api/interface/styleElement
 * @request GET:/api/interface/{elementType}
 */
    interfaceElementsGet: (
      elementType:
        | 'StyleElement'
        | 'Block'
        | 'BlockCategory'
        | 'Templates'
        | 'UserFavorites',
      query?: { isOrderByNumber?: boolean },
      params: RequestParams = {}
    ) =>
      this.request<NotPagedListOfInterfaceElementDto, any>({
        path: `/api/interface/${elementType}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
 * No description
 * 
 * @tags InterfaceElements
 * @name InterfaceElementsAdd
 * @summary Add element by type 
for blocks - /api/interface/block
for style elements - /api/interface/styleElement
 * @request POST:/api/interface/{elementType}
 */
    interfaceElementsAdd: (
      elementType:
        | 'StyleElement'
        | 'Block'
        | 'BlockCategory'
        | 'Templates'
        | 'UserFavorites',
      data: {
        Name?: string | null
        Config?: string | null
        Data?: string | null
        Children?: any[] | null
        Parents?: any[] | null
        OrderNumber?: number
        Description?: string | null
        PreviewImage?: File | null
      },
      params: RequestParams = {}
    ) =>
      this.request<number, ErrorDto[]>({
        path: `/api/interface/${elementType}`,
        method: 'POST',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
 * No description
 * 
 * @tags InterfaceElements
 * @name InterfaceElementsGetPaged
 * @summary Get elements paged by type 
for blocks - /api/interface/block
for style elements - /api/interface/styleElement
 * @request GET:/api/interface/{elementType}/paged
 */
    interfaceElementsGetPaged: (
      elementType:
        | 'StyleElement'
        | 'Block'
        | 'BlockCategory'
        | 'Templates'
        | 'UserFavorites',
      query?: {
        Id?: number
        Search?: string | null
        IsOrderByNumber?: boolean
        Parents?: number[] | null
        IsOnlyVisible?: boolean
        PageNumber?: number
        PageSize?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<PagedListOfInterfaceElementDto, any>({
        path: `/api/interface/${elementType}/paged`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
 * No description
 * 
 * @tags InterfaceElements
 * @name InterfaceElementsGetSimplied
 * @summary Get simplied elements by type 
for blocks - /api/interface/block
for style elements - /api/interface/styleElement
 * @request GET:/api/interface/{elementType}/simplied
 */
    interfaceElementsGetSimplied: (
      elementType:
        | 'StyleElement'
        | 'Block'
        | 'BlockCategory'
        | 'Templates'
        | 'UserFavorites',
      query?: { isOrderByNumber?: boolean },
      params: RequestParams = {}
    ) =>
      this.request<BaseNameDtoOfInteger[], any>({
        path: `/api/interface/${elementType}/simplied`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags InterfaceElements
     * @name InterfaceElementsGetById
     * @summary Get interfaceElement by id
     * @request GET:/api/interface/{elementType}/{id}
     */
    interfaceElementsGetById: (
      elementType:
        | 'StyleElement'
        | 'Block'
        | 'BlockCategory'
        | 'Templates'
        | 'UserFavorites',
      id: number,
      params: RequestParams = {}
    ) =>
      this.request<InterfaceElementDto, ErrorDto[]>({
        path: `/api/interface/${elementType}/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
 * No description
 * 
 * @tags InterfaceElements
 * @name InterfaceElementsUpdate
 * @summary Update elements by type 
for blocks - /api/interface/block/{id}
for style elements - /api/interface/styleElement/{id}
 * @request PUT:/api/interface/{elementType}/{id}
 */
    interfaceElementsUpdate: (
      elementType:
        | 'StyleElement'
        | 'Block'
        | 'BlockCategory'
        | 'Templates'
        | 'UserFavorites',
      id: number,
      data: {
        PreviewImageId?: string | null
        Name?: string | null
        Config?: string | null
        Data?: string | null
        Children?: any[] | null
        Parents?: any[] | null
        OrderNumber?: number
        Description?: string | null
        PreviewImage?: File | null
      },
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/interface/${elementType}/${id}`,
        method: 'PUT',
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
 * No description
 * 
 * @tags InterfaceElements
 * @name InterfaceElementsDelete
 * @summary Delete elements by type
for blocks - /api/interface/block/{id}
for style elements - /api/interface/styleElement/{id}
 * @request DELETE:/api/interface/{elementType}/{id}
 */
    interfaceElementsDelete: (
      elementType:
        | 'StyleElement'
        | 'Block'
        | 'BlockCategory'
        | 'Templates'
        | 'UserFavorites',
      id: number,
      params: RequestParams = {}
    ) =>
      this.request<number, ErrorDto[]>({
        path: `/api/interface/${elementType}/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags InterfaceElements
     * @name InterfaceElementsChangeElementImage
     * @summary Change element image for blocks
     * @request PUT:/api/interface/{elementType}/{id}/elementImage
     */
    interfaceElementsChangeElementImage: (
      elementType:
        | 'StyleElement'
        | 'Block'
        | 'BlockCategory'
        | 'Templates'
        | 'UserFavorites',
      id: number,
      data: { FileId?: string | null; Image?: File | null },
      params: RequestParams = {}
    ) =>
      this.request<FileDto, ErrorDto[]>({
        path: `/api/interface/${elementType}/${id}/elementImage`,
        method: 'PUT',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags InterfaceElements
     * @name InterfaceElementsGetHistories
     * @summary Get history for interface elements: block, styleElement, etc
     * @request GET:/api/interface/{elementType}/{id}/histories
     */
    interfaceElementsGetHistories: (
      elementType:
        | 'StyleElement'
        | 'Block'
        | 'BlockCategory'
        | 'Templates'
        | 'UserFavorites',
      id: number,
      params: RequestParams = {}
    ) =>
      this.request<InterfaceElementHistoryItemDto[], any>({
        path: `/api/interface/${elementType}/${id}/histories`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags InterfaceElements
     * @name InterfaceElementsGetByFilters
     * @summary Get element by filters
     * @request GET:/api/interface/{elementType}/filtered
     */
    interfaceElementsGetByFilters: (
      elementType:
        | 'StyleElement'
        | 'Block'
        | 'BlockCategory'
        | 'Templates'
        | 'UserFavorites',
      params: RequestParams = {}
    ) =>
      this.request<number, ErrorDto[] | ProblemDetails>({
        path: `/api/interface/${elementType}/filtered`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags InterfaceElements
     * @name InterfaceElementsGetConfigByFilters
     * @summary Get config by filters
     * @request GET:/api/interface/{elementType}/config
     */
    interfaceElementsGetConfigByFilters: (
      elementType:
        | 'StyleElement'
        | 'Block'
        | 'BlockCategory'
        | 'Templates'
        | 'UserFavorites',
      params: RequestParams = {}
    ) =>
      this.request<string, ErrorDto[] | ProblemDetails>({
        path: `/api/interface/${elementType}/config`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags InterfaceElements
     * @name InterfaceElementsGetConfig
     * @summary Get config by interface element id
     * @request GET:/api/interface/{elementType}/{id}/config
     */
    interfaceElementsGetConfig: (
      elementType:
        | 'StyleElement'
        | 'Block'
        | 'BlockCategory'
        | 'Templates'
        | 'UserFavorites',
      id: number,
      params: RequestParams = {}
    ) =>
      this.request<string, ProblemDetails>({
        path: `/api/interface/${elementType}/${id}/config`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags InterfaceElements
     * @name InterfaceElementsSaveConfig
     * @summary Save interface element config
     * @request PATCH:/api/interface/{elementType}/{id}/config
     */
    interfaceElementsSaveConfig: (
      elementType:
        | 'StyleElement'
        | 'Block'
        | 'BlockCategory'
        | 'Templates'
        | 'UserFavorites',
      id: number,
      dto: SaveInterfaceElementConfigDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[] | ProblemDetails>({
        path: `/api/interface/${elementType}/${id}/config`,
        method: 'PATCH',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags InterfaceElements
     * @name InterfaceElementsGetBlocksByCategories
     * @summary Get blocks by categories
     * @request GET:/api/interface/blocks/byCategories
     */
    interfaceElementsGetBlocksByCategories: (params: RequestParams = {}) =>
      this.request<GetBlocksByCategoriesDto[], any>({
        path: `/api/interface/blocks/byCategories`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags InterfaceElements
     * @name InterfaceElementsGetUserFavorites
     * @summary Get favorites by type
     * @request GET:/api/interface/favorites/{type}
     */
    interfaceElementsGetUserFavorites: (
      type:
        | 'Font'
        | 'Block'
        | 'ProfileFollow'
        | 'ProfileProjectLike'
        | 'ProfileProjectView',
      params: RequestParams = {}
    ) =>
      this.request<string[], ErrorDto[]>({
        path: `/api/interface/favorites/${type}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags InterfaceElements
     * @name InterfaceElementsAddUserFavorite
     * @summary Add favorite
     * @request POST:/api/interface/favorites/{type}/{uniqueId}
     */
    interfaceElementsAddUserFavorite: (
      type:
        | 'Font'
        | 'Block'
        | 'ProfileFollow'
        | 'ProfileProjectLike'
        | 'ProfileProjectView',
      uniqueId: string,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/interface/favorites/${type}/${uniqueId}`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags InterfaceElements
     * @name InterfaceElementsDeleteUserFavorite
     * @summary Delete favorite
     * @request DELETE:/api/interface/favorites/{type}/{uniqueId}
     */
    interfaceElementsDeleteUserFavorite: (
      type:
        | 'Font'
        | 'Block'
        | 'ProfileFollow'
        | 'ProfileProjectLike'
        | 'ProfileProjectView',
      uniqueId: string,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/interface/favorites/${type}/${uniqueId}`,
        method: 'DELETE',
        ...params,
      }),
  }
  logs = {
    /**
     * No description
     *
     * @tags Logs
     * @name LogsSave
     * @summary Log editor errors
     * @request POST:/api/logs
     */
    logsSave: (dto: EditorLogDto, params: RequestParams = {}) =>
      this.request<void, ErrorDto[]>({
        path: `/api/logs`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),
  }
  notifications = {
    /**
     * No description
     *
     * @tags Notifications
     * @name NotificationsGet
     * @summary Get all notifications
     * @request GET:/api/notifications
     */
    notificationsGet: (
      query?: { PageNumber?: number; PageSize?: number },
      params: RequestParams = {}
    ) =>
      this.request<PagedNotifications, ErrorDto[]>({
        path: `/api/notifications`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notifications
     * @name NotificationsReadAll
     * @summary Read all unread notifications
     * @request POST:/api/notifications/unread
     */
    notificationsReadAll: (params: RequestParams = {}) =>
      this.request<void, ErrorDto[]>({
        path: `/api/notifications/unread`,
        method: 'POST',
        ...params,
      }),
  }
  plans = {
    /**
     * No description
     *
     * @tags Plans
     * @name PlansGet
     * @summary Get Plans
     * @request GET:/api/plans
     */
    plansGet: (params: RequestParams = {}) =>
      this.request<PlanDto[], any>({
        path: `/api/plans`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Plans
     * @name PlansCreatePaylink
     * @summary Creates pay link to purchase specified plan
     * @request GET:/api/checkout/plans/{planId}
     */
    plansCreatePaylink: (
      planId: number,
      query?: { coupon?: string | null },
      params: RequestParams = {}
    ) =>
      this.request<string, ErrorDto[]>({
        path: `/api/checkout/plans/${planId}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Plans
     * @name PlansApplyCoupon
     * @summary Apply coupon
     * @request GET:/api/checkout/plans/{productPaddleId}/coupons/{coupon}
     */
    plansApplyCoupon: (
      productPaddleId: number,
      coupon: string,
      params: RequestParams = {}
    ) =>
      this.request<CheckCouponDto, ErrorDto[]>({
        path: `/api/checkout/plans/${productPaddleId}/coupons/${coupon}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
 * No description
 * 
 * @tags Plans
 * @name PlansHandlePaddleWebhookRequest
 * @summary Validates and saves paddle products after purchase
actual handler for paddle webhook
 * @request POST:/api/paddle/webhook
 */
    plansHandlePaddleWebhookRequest: (
      data: {
        'Subscription.UserId'?: string
        'Subscription.Token'?: string | null
        'Subscription.SubscriptionId'?: number
        'Product.UserId'?: string
        'Product.Token'?: string | null
        'Product.ProductId'?: number
        Token?: string | null
        UserId?: string | null
        IsSubscriptionDeleted?: boolean
        IsPurchase?: boolean
        Passthrough?: string | null
        subscription_id?: number | null
        subscription_plan_id?: number | null
        email?: string | null
        product_id?: number | null
        quantity?: number | null
        status?: string | null
        p_signature?: string | null
      },
      params: RequestParams = {}
    ) =>
      this.request<File | null, any>({
        path: `/api/paddle/webhook`,
        method: 'POST',
        body: data,
        type: ContentType.UrlEncoded,
        ...params,
      }),
  }
  profiles = {
    /**
     * No description
     *
     * @tags Profiles
     * @name ProfilesGet
     * @summary Get profiles by filter
     * @request GET:/api/profiles
     */
    profilesGet: (
      query?: { PageNumber?: number; PageSize?: number },
      params: RequestParams = {}
    ) =>
      this.request<PagedListOfProfileDto, any>({
        path: `/api/profiles`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name ProfilesGetWelcome
     * @summary Get most popular profiles by filter
     * @request GET:/api/profiles/welcome
     */
    profilesGetWelcome: (
      query?: { PageNumber?: number; PageSize?: number },
      params: RequestParams = {}
    ) =>
      this.request<PagedListOfWelcomeProfileDto, any>({
        path: `/api/profiles/welcome`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name ProfilesGetByAlias
     * @summary Get profiles by alias
     * @request GET:/api/profiles/{alias}
     */
    profilesGetByAlias: (alias: string, params: RequestParams = {}) =>
      this.request<ProfileDto, any>({
        path: `/api/profiles/${alias}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name ProfilesGetFollowers
     * @summary Get followers for profile
     * @request GET:/api/profiles/{alias}/followers
     */
    profilesGetFollowers: (
      alias: string,
      query?: { PageNumber?: number; PageSize?: number },
      params: RequestParams = {}
    ) =>
      this.request<
        PagedListOfProfileFollowerDto,
        PagedListOfErrorDto | ProblemDetails
      >({
        path: `/api/profiles/${alias}/followers`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name ProfilesGetFollowing
     * @summary Get following for profile
     * @request GET:/api/profiles/{alias}/following
     */
    profilesGetFollowing: (
      alias: string,
      query?: { PageNumber?: number; PageSize?: number },
      params: RequestParams = {}
    ) =>
      this.request<
        PagedListOfProfileFollowerDto,
        PagedListOfErrorDto | ProblemDetails
      >({
        path: `/api/profiles/${alias}/following`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name ProfilesGetProjects
     * @summary Get projects for profile
     * @request GET:/api/profiles/{alias}/projects
     */
    profilesGetProjects: (
      alias: string,
      query?: { PageNumber?: number; PageSize?: number },
      params: RequestParams = {}
    ) =>
      this.request<PagedListOfProfileProjectDto, any>({
        path: `/api/profiles/${alias}/projects`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name ProfilesGetOwnedProjects
     * @summary Get owned projects for profile
     * @request GET:/api/profiles/projects
     */
    profilesGetOwnedProjects: (
      query?: {
        Type?: 'All' | 'Published' | 'Drafts'
        PageNumber?: number
        PageSize?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<OwnedProfileProjects, ProblemDetails>({
        path: `/api/profiles/projects`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name ProfilesGetSubcribedProjects
     * @summary Get subcribed projects
     * @request GET:/api/profiles/{alias}/projects/subcribed
     */
    profilesGetSubcribedProjects: (
      alias: string,
      query?: { PageNumber?: number; PageSize?: number },
      params: RequestParams = {}
    ) =>
      this.request<PagedListOfSubcribedProfileProjectDto, any>({
        path: `/api/profiles/${alias}/projects/subcribed`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name ProfilesToggleProjectLike
     * @summary Set/Unset like to project
     * @request GET:/api/profiles/{alias}/projects/{projectId}/like
     */
    profilesToggleProjectLike: (
      projectId: number,
      alias: string,
      params: RequestParams = {}
    ) =>
      this.request<void, ProblemDetails>({
        path: `/api/profiles/${alias}/projects/${projectId}/like`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name ProfilesToggleProjectView
     * @summary Set view to project
     * @request GET:/api/profiles/{alias}/projects/{projectId}/view
     */
    profilesToggleProjectView: (
      projectId: number,
      alias: string,
      params: RequestParams = {}
    ) =>
      this.request<void, ProblemDetails>({
        path: `/api/profiles/${alias}/projects/${projectId}/view`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name ProfilesToggleProfileFollow
     * @summary Set/Unset follow to profile
     * @request GET:/api/profiles/{alias}/follow
     */
    profilesToggleProfileFollow: (alias: string, params: RequestParams = {}) =>
      this.request<void, ProblemDetails>({
        path: `/api/profiles/${alias}/follow`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Profiles
     * @name ProfilesTogglePublishedProject
     * @summary Set/Unset published project to profile
     * @request PATCH:/api/profiles/{alias}/projects/{projectId}/feed
     */
    profilesTogglePublishedProject: (
      alias: string,
      projectId: number,
      params: RequestParams = {}
    ) =>
      this.request<void, ProblemDetails>({
        path: `/api/profiles/${alias}/projects/${projectId}/feed`,
        method: 'PATCH',
        ...params,
      }),
  }
  projectCategories = {
    /**
     * No description
     *
     * @tags ProjectCategories
     * @name ProjectCategoriesGet
     * @summary Get all project categories
     * @request GET:/api/projectCategories
     */
    projectCategoriesGet: (params: RequestParams = {}) =>
      this.request<ProjectCategoriesDto[], ErrorDto[]>({
        path: `/api/projectCategories`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectCategories
     * @name ProjectCategoriesGetWithTags
     * @request GET:/api/projectCategories/withTags
     */
    projectCategoriesGetWithTags: (params: RequestParams = {}) =>
      this.request<ProjectCategoryWithTagsDto[], ErrorDto[]>({
        path: `/api/projectCategories/withTags`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectCategories
     * @name ProjectCategoriesGetByName
     * @summary Get project category by name
     * @request GET:/api/projectCategories/name
     */
    projectCategoriesGetByName: (
      query?: { Name?: string | null },
      params: RequestParams = {}
    ) =>
      this.request<ProjectCategoryDto, ErrorDto[]>({
        path: `/api/projectCategories/name`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  }
  projectPages = {
    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesGet
     * @summary Gets the project pages
     * @request GET:/api/projects/{projectId}/pages
     */
    projectPagesGet: (projectId: number, params: RequestParams = {}) =>
      this.request<BaseProjectPageDto[], any>({
        path: `/api/projects/${projectId}/pages`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesCreate
     * @summary Create the page
     * @request POST:/api/projects/{projectId}/pages
     */
    projectPagesCreate: (
      projectId: number,
      dto: CreateProjectPageDto,
      params: RequestParams = {}
    ) =>
      this.request<number, ErrorDto[] | ProblemDetails>({
        path: `/api/projects/${projectId}/pages`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesGetById
     * @summary Get the project page
     * @request GET:/api/projects/{projectId}/pages/{pageId}
     */
    projectPagesGetById: (
      projectId: number,
      pageId: number,
      params: RequestParams = {}
    ) =>
      this.request<ProjectPageDto, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesSave
     * @summary Saves the page
     * @request PUT:/api/projects/{projectId}/pages/{pageId}
     */
    projectPagesSave: (
      projectId: number,
      pageId: number,
      dto: SaveProjectPageDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}`,
        method: 'PUT',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesRestore
     * @summary Restore the page
     * @request PATCH:/api/projects/{projectId}/pages/{pageId}
     */
    projectPagesRestore: (
      projectId: number,
      pageId: number,
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/api/projects/${projectId}/pages/${pageId}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesDelete
     * @summary Delete the project page.
     * @request DELETE:/api/projects/{projectId}/pages/{pageId}
     */
    projectPagesDelete: (
      projectId: number,
      pageId: number,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesChangeName
     * @summary Change the project page name.
     * @request PUT:/api/projects/{projectId}/pages/{pageId}/name
     */
    projectPagesChangeName: (
      projectId: number,
      pageId: number,
      dto: ChangePageNameDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}/name`,
        method: 'PUT',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesChangeSocialImage
     * @request PUT:/api/projects/{projectId}/pages/{pageId}/socialImage
     */
    projectPagesChangeSocialImage: (
      projectId: number,
      pageId: number,
      data: { Image?: File | null },
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}/socialImage`,
        method: 'PUT',
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesChangeElementImage
     * @summary Change element image in project pages in editor
     * @request PUT:/api/projects/{projectId}/pages/{pageId}/elementImage
     */
    projectPagesChangeElementImage: (
      projectId: number,
      pageId: number,
      data: { FileId?: string | null; Image?: File | null },
      params: RequestParams = {}
    ) =>
      this.request<FileDto, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}/elementImage`,
        method: 'PUT',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesSetAsHomePage
     * @summary Set the project page as home page.
     * @request PUT:/api/projects/{projectId}/pages/{pageId}/setAsHomePage
     */
    projectPagesSetAsHomePage: (
      projectId: number,
      pageId: number,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}/setAsHomePage`,
        method: 'PUT',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesDuplicate
     * @summary Set the project page as home page.
     * @request POST:/api/projects/{projectId}/pages/{pageId}/duplicate
     */
    projectPagesDuplicate: (
      projectId: number,
      pageId: number,
      params: RequestParams = {}
    ) =>
      this.request<BaseProjectPageDto, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}/duplicate`,
        method: 'POST',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesGetSettings
     * @summary Get page settings for current page
     * @request GET:/api/projects/{projectId}/pages/{pageId}/settings
     */
    projectPagesGetSettings: (
      projectId: number,
      pageId: number,
      params: RequestParams = {}
    ) =>
      this.request<PageSettingsDto, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}/settings`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesSaveSettings
     * @summary Save page settings for current page
     * @request POST:/api/projects/{projectId}/pages/{pageId}/settings
     */
    projectPagesSaveSettings: (
      projectId: number,
      pageId: number,
      dto: PageSettingsDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}/settings`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesPublish
     * @summary Publish a project page
     * @request POST:/api/projects/{projectId}/pages/{pageId}/publish
     */
    projectPagesPublish: (
      projectId: number,
      pageId: number,
      params: RequestParams = {}
    ) =>
      this.request<ProjectPagePublishDto, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}/publish`,
        method: 'POST',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesUnpublished
     * @summary Unpublish a project page
     * @request POST:/api/projects/{projectId}/pages/{pageId}/unpublished
     */
    projectPagesUnpublished: (
      projectId: number,
      pageId: number,
      params: RequestParams = {}
    ) =>
      this.request<any, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}/unpublished`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesPublishedHistory
     * @summary Publish a project page
     * @request GET:/api/projects/{projectId}/pages/{pageId}/publishedhistory
     */
    projectPagesPublishedHistory: (
      projectId: number,
      pageId: number,
      query?: { PageNumber?: number; PageSize?: number },
      params: RequestParams = {}
    ) =>
      this.request<PagedListOfProjectPagePublishedHistoryDto, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}/publishedhistory`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProjectPages
     * @name ProjectPagesAttachedTemplate
     * @summary Attach a project page to a template for editing the template
     * @request PATCH:/api/projects/{projectId}/pages/{pageId}/attached/{templateId}
     */
    projectPagesAttachedTemplate: (
      projectId: number,
      pageId: number,
      templateId: number,
      params: RequestParams = {}
    ) =>
      this.request<any, ErrorDto[]>({
        path: `/api/projects/${projectId}/pages/${pageId}/attached/${templateId}`,
        method: 'PATCH',
        ...params,
      }),
  }
  projects = {
    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsGet
     * @summary Get User Projects
     * @request GET:/api/projects
     */
    projectsGet: (params: RequestParams = {}) =>
      this.request<BaseProjectDto[], any>({
        path: `/api/projects`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsCreate
     * @summary Create the project
     * @request POST:/api/projects
     */
    projectsCreate: (dto: CreateProjectDto, params: RequestParams = {}) =>
      this.request<CreatedProjectDto, ErrorDto[] | ProblemDetails>({
        path: `/api/projects`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsDeleteAll
     * @summary Delete all user projects.
     * @request DELETE:/api/projects
     */
    projectsDeleteAll: (params: RequestParams = {}) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsGetPaged
     * @request GET:/api/projects/paged
     */
    projectsGetPaged: (
      query?: {
        Type?: 'All' | 'Community' | 'Custom' | 'Drafts'
        PageNumber?: number
        PageSize?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<PagedProjectsDto, any>({
        path: `/api/projects/paged`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsGetById
     * @summary Get User Project by Id
     * @request GET:/api/projects/{projectId}
     */
    projectsGetById: (projectId: number, params: RequestParams = {}) =>
      this.request<BaseProjectDto, ErrorDto[]>({
        path: `/api/projects/${projectId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsRestore
     * @summary Restore the project.
     * @request PUT:/api/projects/{id}/restore
     */
    projectsRestore: (id: number, params: RequestParams = {}) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${id}/restore`,
        method: 'PUT',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsDuplicate
     * @summary Duplicate the project.
     * @request POST:/api/projects/{id}/duplicate
     */
    projectsDuplicate: (id: number, params: RequestParams = {}) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${id}/duplicate`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsSaveSettings
     * @summary Save project settings
     * @request POST:/api/projects/{id}/settings
     */
    projectsSaveSettings: (
      id: number,
      dto: SaveProjectSettingsDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${id}/settings`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsChangeName
     * @summary Change project name
     * @request POST:/api/projects/{projectId}/name
     */
    projectsChangeName: (
      projectId: number,
      dto: ChangeProjectNameDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${projectId}/name`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsChangeFavicon
     * @summary Change project favicon
     * @request PUT:/api/projects/{projectId}/favicon
     */
    projectsChangeFavicon: (
      projectId: number,
      data: { Favicon?: File | null },
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${projectId}/favicon`,
        method: 'PUT',
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsCheckCustomDomainStatus
     * @summary Change project name
     * @request GET:/api/projects/{projectId}/customdomain/status
     */
    projectsCheckCustomDomainStatus: (
      projectId: number,
      params: RequestParams = {}
    ) =>
      this.request<CheckCustomDomainStatusResultDto, ErrorDto[]>({
        path: `/api/projects/${projectId}/customdomain/status`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsGetAdditionalFile
     * @summary Get favicon or social images
     * @request GET:/api/projects/{id}/files/{type}
     */
    projectsGetAdditionalFile: (
      id: number,
      type:
        | 'Favicon'
        | 'SocialImage'
        | 'Preview'
        | 'TemplatePreview'
        | 'TemplateFull'
        | 'ProfileAvatar'
        | 'ProfileCover'
        | 'Elements'
        | 'Community',
      params: RequestParams = {}
    ) =>
      this.request<FileDto, ErrorDto[]>({
        path: `/api/projects/${id}/files/${type}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsMoved
     * @summary Move project to another user
     * @request PATCH:/api/projects/{id}/moved
     */
    projectsMoved: (
      id: string,
      dto: MovedProjectDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${id}/moved`,
        method: 'PATCH',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsDelete
     * @summary Delete the project.
     * @request DELETE:/api/projects/{id}
     */
    projectsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${id}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsPublish
     * @summary Publish the project.
     * @request PUT:/api/projects/{id}/published
     * @deprecated
     */
    projectsPublish: (
      id: number,
      data: {
        Name?: string | null
        PublishedInCommunity?: boolean
        PreviewId?: string | null
        Preview?: File | null
        CategoryId?: number
        Tags?: number[] | null
      },
      params: RequestParams = {}
    ) =>
      this.request<PublishedProjectDto, ErrorDto[]>({
        path: `/api/projects/${id}/published`,
        method: 'PUT',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsGetCommunity
     * @summary Get published project in the community
     * @request GET:/api/projects/{id}/community
     */
    projectsGetCommunity: (id: number, params: RequestParams = {}) =>
      this.request<CommunityProjectDto, ErrorDto[]>({
        path: `/api/projects/${id}/community`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsPublishInCommunity
     * @summary Publish the project in community
     * @request PUT:/api/projects/{id}/community/published
     */
    projectsPublishInCommunity: (
      id: number,
      data: {
        Name?: string | null
        PreviewId?: string | null
        Preview?: File | null
        CategoryId?: number
        Tags?: number[] | null
        Pages?: number[] | null
        'ActionButton.Title'?: string | null
        'ActionButton.Type'?: 'Form' | 'File' | 'Link'
        'ActionButton.IntegrationType'?: 'Submissions'
        'ActionButton.File'?: File | null
        'ActionButton.FileId'?: string | null
        'ActionButton.Link'?: string | null
      },
      params: RequestParams = {}
    ) =>
      this.request<PublishedProjectInCommunityDto, ErrorDto[]>({
        path: `/api/projects/${id}/community/published`,
        method: 'PUT',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Projects
     * @name ProjectsUpdatePagesInCommunity
     * @summary Update published project pages in the community
     * @request PATCH:/api/projects/{id}/community/published
     */
    projectsUpdatePagesInCommunity: (id: number, params: RequestParams = {}) =>
      this.request<void, ErrorDto[]>({
        path: `/api/projects/${id}/community/published`,
        method: 'PATCH',
        ...params,
      }),
  }
  projectTags = {
    /**
     * No description
     *
     * @tags ProjectTags
     * @name ProjectTagsGet
     * @summary Get all project tags
     * @request GET:/api/projectTags
     */
    projectTagsGet: (params: RequestParams = {}) =>
      this.request<BaseNameDtoOfInteger[], ErrorDto[]>({
        path: `/api/projectTags`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
  publish = {
    /**
     * No description
     *
     * @tags Publish
     * @name PublishGetPage
     * @summary Get settings of published page
     * @request GET:/api/publish/page
     */
    publishGetPage: (
      query?: {
        Domain?: string | null
        Url?: string | null
        IsScreenshot?: boolean
        ProjectId?: number
        PageId?: number
        IsAirtapDomain?: boolean
        AirtapDomain?: string | null
        PageUrl?: string | null
        IsHomePage?: boolean
      },
      params: RequestParams = {}
    ) =>
      this.request<PublishedProjectPageDto, ProblemDetails>({
        path: `/api/publish/page`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Publish
     * @name PublishGetDisallowUrls
     * @summary Get page urls for robots.txt
     * @request GET:/api/publish/page/disallowUrls
     */
    publishGetDisallowUrls: (
      query?: {
        Domain?: string | null
        IsScreenshotDomain?: boolean
        IsAirtapDomain?: boolean
      },
      params: RequestParams = {}
    ) =>
      this.request<string[], ProblemDetails>({
        path: `/api/publish/page/disallowUrls`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Publish
     * @name PublishGetUrls
     * @summary Get page urls for sitemap
     * @request GET:/api/publish/page/urls
     */
    publishGetUrls: (
      query?: {
        Domain?: string | null
        IsScreenshotDomain?: boolean
        IsAirtapDomain?: boolean
      },
      params: RequestParams = {}
    ) =>
      this.request<string[], ProblemDetails>({
        path: `/api/publish/page/urls`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Publish
     * @name PublishSubscribe
     * @request POST:/api/publish/{projectId}/subscribe
     */
    publishSubscribe: (
      projectId: number,
      dto: PublishedSubscriptionDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/publish/${projectId}/subscribe`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Publish
     * @name PublishMailchimpSubscribe
     * @summary Create member in mailchimp list.
     * @request POST:/api/publish/{projectId}/mailchimp/subscribe
     */
    publishMailchimpSubscribe: (
      projectId: number,
      member: MemberDto,
      params: RequestParams = {}
    ) =>
      this.request<void, ErrorDto[]>({
        path: `/api/publish/${projectId}/mailchimp/subscribe`,
        method: 'POST',
        body: member,
        type: ContentType.Json,
        ...params,
      }),
  }
  submissions = {
    /**
     * No description
     *
     * @tags Submissions
     * @name SubmissionsGet
     * @summary Get submissions
     * @request GET:/api/submissions
     */
    submissionsGet: (
      query?: {
        Action?: 'Form' | 'File' | 'Link'
        Projects?: number[] | null
        'Sorting.SortBy'?:
          | 'Default'
          | 'Name'
          | 'Email'
          | 'ProjectsName'
          | 'Action'
          | 'DateAdded'
        'Sorting.Direction'?: 'Asc' | 'Desc'
        Search?: string | null
        PageNumber?: number
        PageSize?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<PagedSubmissions, any>({
        path: `/api/submissions`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Submissions
     * @name SubmissionsToggleFavorite
     * @summary Toggle submissions favorite
     * @request PATCH:/api/submissions/{id}/favorite
     */
    submissionsToggleFavorite: (
      id: number,
      dto: FavoriteSubmissionDto,
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/api/submissions/${id}/favorite`,
        method: 'PATCH',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Submissions
     * @name SubmissionsExportToCsv
     * @summary Export to CSV
     * @request POST:/api/submissions/export
     */
    submissionsExportToCsv: (dto: ExportToCSVDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/submissions/export`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Submissions
     * @name SubmissionsDeleteSelected
     * @summary Delete selecting submisssions
     * @request DELETE:/api/submissions/selected
     */
    submissionsDeleteSelected: (
      query?: { Submissions?: number[] | null },
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/api/submissions/selected`,
        method: 'DELETE',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Submissions
     * @name SubmissionsDeleteAll
     * @summary Delete all submisssions
     * @request DELETE:/api/submissions/all
     */
    submissionsDeleteAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/submissions/all`,
        method: 'DELETE',
        ...params,
      }),
  }
  templates = {
    /**
     * No description
     *
     * @tags Templates
     * @name TemplatesGet
     * @summary Get templates by filter
     * @request GET:/api/templates
     */
    templatesGet: (
      query?: {
        Search?: string | null
        Categories?: number[] | null
        PageTypes?: PageType[] | null
        IsOnlyPopular?: boolean
        RandomId?: string | null
        PageNumber?: number
        PageSize?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<PagedTemplatesDto, ErrorDto[]>({
        path: `/api/templates`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplatesCreate
     * @summary Create new template
     * @request POST:/api/templates
     */
    templatesCreate: (
      dto: CreateSimpliedTemplateDto,
      params: RequestParams = {}
    ) =>
      this.request<CreatedSimplyTemplateDto, ErrorDto[]>({
        path: `/api/templates`,
        method: 'POST',
        body: dto,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplatesGetById
     * @summary Get template by id
     * @request GET:/api/templates/{id}
     */
    templatesGetById: (id: number, params: RequestParams = {}) =>
      this.request<TemplateDto, ProblemDetails>({
        path: `/api/templates/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplatesChangeElementImage
     * @summary Change element image for blocks
     * @request PUT:/api/templates/{id}/elementImage
     */
    templatesChangeElementImage: (
      id: number,
      data: { FileId?: string | null; Image?: File | null },
      params: RequestParams = {}
    ) =>
      this.request<FileDto, ErrorDto[]>({
        path: `/api/templates/${id}/elementImage`,
        method: 'PUT',
        body: data,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplatesGetTemplateCategories
     * @summary Get Template Categories
     * @request GET:/api/templates/categories
     */
    templatesGetTemplateCategories: (params: RequestParams = {}) =>
      this.request<BaseNameDtoOfInteger[], any>({
        path: `/api/templates/categories`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Templates
     * @name TemplatesGetPageTypes
     * @summary Get template page types
     * @request GET:/api/templates/pageTypes
     */
    templatesGetPageTypes: (params: RequestParams = {}) =>
      this.request<BaseNameDtoOfInteger[], any>({
        path: `/api/templates/pageTypes`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  }
}
