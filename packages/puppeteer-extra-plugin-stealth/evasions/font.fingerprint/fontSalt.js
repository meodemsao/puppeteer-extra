const { extraFonts } = require('./extraFont.js')
const { arrShuffle, _rd, _arrRd } = require('./helper.js')

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
      exists === 1
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
            exists: exists !== 0, // Possible base font = 2
            offsetWidth: 0,
            offsetHeight: 0,
            style: 'normal',
            weight: 'normal',
            size: 0
          }

    if (exists === 1) {
      ++fontStyleKeywordIndex
      ++fontSizeIncreasement

      // The emoji may only have one type of italic, only up to 2 is fine.
      if (fontStyleKeywordIndex >= 2) {
        fontStyleKeywordIndex = 0
        // ++fontSizeIncreasement
      }
    }
  }

  return fonts
}
