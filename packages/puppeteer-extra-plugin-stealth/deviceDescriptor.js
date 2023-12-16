/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
// noinspection JSUnusedGlobalSymbols

const crypto = require('crypto')
const assert = require('assert/strict')
const { arrShuffle, _rd, _arrRd } = require('./helper.js')
const { extraFonts } = require('./evasions/font.fingerprint/extraFont.js')
const { UserAgentHelper } = require('./userAgentHelper.js')

export function checkLegal(deviceDescriptor) {
  if (!deviceDescriptor) {
    throw new Error('DeviceDescriptor empty')
  }

  if (!deviceDescriptor.navigator) {
    throw new Error('navigator empty')
  }

  if (!UserAgentHelper.isMobile(deviceDescriptor.navigator.userAgent)) {
    // If not mobile phone, but screen is too small, filter it out
    if (
      deviceDescriptor.window.innerWidth < 900 ||
      deviceDescriptor.window.innerHeight < 450
    ) {
      throw new Error('width and height of windows is too small')
    }

    // Screen height greater than width, remove it
    if (
      deviceDescriptor.window.innerHeight > deviceDescriptor.window.innerWidth
    ) {
      throw new Error(
        'Height of window is greater than width of window, non-normal browser'
      )
    }

    if (
      deviceDescriptor.window.innerHeight >
        deviceDescriptor.screen.availHeight ||
      deviceDescriptor.window.innerWidth > deviceDescriptor.screen.availWidth
    ) {
      throw new Error(
        'Width of browser window cannot be greater than width of screen and height cannot be greater than height of screen'
      )
    }

    // No plugins and mineType information, remove
    // noinspection RedundantIfStatementJS
    if (
      !deviceDescriptor.plugins ||
      !deviceDescriptor.plugins.mimeTypes.length ||
      !deviceDescriptor.plugins.plugins.length
    ) {
      throw new Error('Plugins of desktop browser cannot be empty')
    }

    // Ordinary PC computers should not have touch screens
    if (deviceDescriptor.navigator.maxTouchPoints != 0) {
      throw new Error('Desktop browsers cannot have touchscreens')
    }

    // mimeTypes
    if (!deviceDescriptor.mimeTypes || !deviceDescriptor.mimeTypes.length) {
      throw new Error('mimeTypes cannot be empty')
    }

    // permissions
    if (
      !deviceDescriptor.permissions ||
      Object.keys(deviceDescriptor.permissions).length === 0
    ) {
      throw new Error('permissions cannot be empty')
    }
  } else {
    if (deviceDescriptor.navigator.maxTouchPoints === 0) {
      throw new Error('Mobile devices must have touch screen')
    }
  }

  assert(deviceDescriptor.navigator.userAgent, 'userAgent cannot be empty')
  const lowerCaseUserAgent = deviceDescriptor.navigator.userAgent.toLowerCase()

  if (
    !deviceDescriptor.navigator.language ||
    !deviceDescriptor.navigator.languages ||
    !deviceDescriptor.navigator.languages.length
  ) {
    throw new Error('language cannot be empty')
  }

  // if (e.window.screenX != 0 || e.window.screenY != 0) {
  //     return false
  // }

  // Only chrome browser is allowed
  if (
    !lowerCaseUserAgent.includes('chrome') &&
    !lowerCaseUserAgent.includes('crios')
  ) {
    throw new Error('Only chrome kernel browsers are supported')
  }

  // chrome os
  if (lowerCaseUserAgent.includes('cros')) {
    throw new Error('ChromeOS is not supported')
  }

  // Googlebot
  if (lowerCaseUserAgent.includes('googlebot')) {
    throw new Error('google bot')
  }
  if (lowerCaseUserAgent.includes('adsbot-google')) {
    throw new Error('google bot')
  }

  if (lowerCaseUserAgent.includes('mediapartners')) {
    throw new Error('google bot')
  }

  // Chrome-Lighthouse
  if (lowerCaseUserAgent.includes('chrome-lighthouse')) {
    throw new Error('google bot')
  }

  // voices
  if (!deviceDescriptor.voices || !deviceDescriptor.voices.length) {
    throw new Error('voices cannot be empty')
  }

  return true
}

export function deviceUUID(e) {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(e))
    .digest('hex')
}

export function buildAcceptLanguage(deviceDesc) {
  // referer: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept-Language
  // https://developer.mozilla.org/zh-CN/docs/Glossary/Quality_values

  assert(deviceDesc.navigator)
  assert(deviceDesc.navigator.languages)

  const langs = deviceDesc.navigator.languages
  let result = ''
  let counter = 9
  for (const lang of langs) {
    if (result) {
      result += ','
    }

    result += lang

    if (langs.length > 1) {
      result += `;q=0.${counter}`

      // Extreme situations: en,zh;q=0.9,fr;q=0.8,es;q=0.7,zh-CN;q=0.6,pt-BR;q=0.5,pt;q=0.4,sq;q=0.3,ar;q=0.2,an;q=0.1,am;q=0.1,az;q=0.1,ast;q=0.1,ga;q=0.1,et;q=0.1,oc;q=0.1,or;q=0.1,om;q=0.1,eu;q=0.1,be;q=0.1,bg;q=0.1
      // with the test, q must >= 0.1
      // so MDN is wrong:
      // The importance of a value is marked by the suffix ';q=' immediately followed by a value between 0 and 1 included, with up to three decimal digits
      counter = Math.max(--counter, 1)
    }
  }

  return result
}

export function buildFontSalt() {
  // Handling font correspondence
  const fonts = {}

  let fontEntries = []

  // Find the remaining fonts that have not been added

  const existsFonts = fontEntries.map(e => e.name)
  const nonexistentFonts = extraFonts.filter(e => !existsFonts.includes(e))

  for (const font of nonexistentFonts) {
    fontEntries.push({
      name: font,
      exists: 0
    })
  }

  // disrupt them
  fontEntries = arrShuffle(fontEntries)

  let fontSizeIncreasement = 1
  let fontStyleKeywordIndex = 0

  const fontWeightKeywords = [
    'normal',
    'bold',
    'bolder',
    'lighter',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900'
  ]

  const fontStyleKeywords = ['normal', 'italic', 'oblique']

  for (const { name, exists } of fontEntries) {
    // e:
    // 0 Not Exist
    // 1 Exist
    // 2 Base Font

    // Random Number
    fonts[name] =
      exists === FontExistTypes.FontExists
        ? {
            // textMetrics salting
            // actualBoundingBoxAscent: -1.4033203125
            // actualBoundingBoxDescent: 43.126953125
            // actualBoundingBoxLeft: -4.8095703125
            // actualBoundingBoxRight: 240.3076171875
            // fontBoundingBoxAscent: 5.65625
            // fontBoundingBoxDescent: 51.34375
            // width

            exists: true,
            offsetWidth: _rd(5, 10),
            offsetHeight: _rd(1, 4),
            style: _arrRd(fontStyleKeywords),
            weight: fontWeightKeywords[fontStyleKeywordIndex],
            size: fontSizeIncreasement
          }
        : {
            exists: exists !== FontExistTypes.FontNotExists, // Possible base font = 2
            offsetWidth: 0,
            offsetHeight: 0,
            style: 'normal',
            weight: 'normal',
            size: 0
          }

    if (exists === FontExistTypes.FontExists) {
      ++fontStyleKeywordIndex
      ++fontSizeIncreasement

      // The emoji may only have one type of italic, only up to 2 is fine.
      if (fontStyleKeywordIndex >= 2) {
        fontStyleKeywordIndex = 0
        // ++fontSizeIncreasement
      }
    }
  }

  return fontSalt
}
