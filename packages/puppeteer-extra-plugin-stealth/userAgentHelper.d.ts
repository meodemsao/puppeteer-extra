export type OSTypes =
  | 'Windows'
  | 'macOS'
  | 'Linux'
  | 'iPhone'
  | 'iPod'
  | 'iPad'
  | 'Android'
  | 'Unknown'

export type BrowserTypes =
  | 'IE'
  | 'Chrome'
  | 'Firefox'
  | 'Opera'
  | 'Safari'
  | 'Edge'
  | 'QQBrowser'
  | 'WeixinBrowser'
  | 'Unknown'

declare function isMobile(ua: string): boolean

declare function browserType(userAgent: string): BrowserTypes

declare function chromeMajorVersion(userAgent: string): number | null

declare function chromeVersion(userAgent: string): string | null

declare function os(userAgent: string): OSTypes
