export interface OpenmrsResource {
  uuid: string
  display?: string
  [anythingElse: string]: any
}

export interface SessionUser {
  allowedLocales: Array<string>
  authenticated: boolean
  locale: string
  sessionId: string
  user: User
  currentProvider: {uuid: string; identifier: string}
  sessionLocation: any | null
}

export interface User {
  display: string
  link: Array<string>
  person: any
  priviliges: any
  resourceVersion: any
  roles: Array<any>
  userProperties: any
  username: string
  uuid: string
}
