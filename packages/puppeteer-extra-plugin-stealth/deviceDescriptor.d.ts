// noinspection JSUnusedGlobalSymbols

declare enum FontExistTypes {
    FontNotExists,
    FontExists,
    BaseFont,
}

/**
 * Source information for browser fingerprint.
 * Includes plugins, gpu, fonts, webgl, etc.
 *
 * Q: How do we get this information?
 * A: Use dumpDD.js to collect fingerprints.
 */
interface DeviceDescriptor {
    plugins: {
        mimeTypes: Array<{
            type: string,
            suffixes: string,
            description: string,
            __pluginName: string,
        }>,
        plugins: Array<{
            name: string,
            filename: string,
            description: string,
            __mimeTypes: string[],
        }>
    },
    allFonts: Array<{
        name: string,
        exists: FontExistTypes,
    }>,
    gpu: {
        vendor: string,
        renderer: string,
    },
    navigator: {
        languages: string[],
        userAgent: string,
        'appCodeName': string,
        'appMinorVersion': string,
        'appName': string,
        'appVersion': string,
        'buildID': string,
        'platform': string,
        'product': string,
        'productSub': string,
        'hardwareConcurrency': number,
        'cpuClass': string,
        'maxTouchPoints': number,
        'oscpu': string,
        'vendor': string,
        'vendorSub': string,
        'deviceMemory': number,
        'doNotTrack': string,
        'msDoNotTrack': string,
        'vibrate': string,
        'credentials': string,
        'storage': string,
        'requestMediaKeySystemAccess': string,
        'bluetooth': string,
        'language': string,
        'systemLanguage': string,
        'userLanguage': string,
        webdriver: boolean,
    },
    'window': {
        'innerWidth': number,
        'innerHeight': number,
        'outerWidth': number,
        'outerHeight': number,
        'screenX': number,
        'screenY': number,
        'pageXOffset': number,
        'pageYOffset': number,
        'Image': string,
        'isSecureContext': boolean,
        'devicePixelRatio': number,
        'toolbar': string,
        'locationbar': string,
        'ActiveXObject': string,
        'external': string,
        'mozRTCPeerConnection': string,
        'postMessage': string,
        'webkitRequestAnimationFrame': string,
        'BluetoothUUID': string,
        'netscape': string,
        'localStorage': string,
        'sessionStorage': string,
        'indexDB': string,
    },
    'document': {
        'characterSet': string,
        'compatMode': string,
        'documentMode': string,
        'layers': string,
        'images': string,
    },
    'screen': {
        'availWidth': number,
        'availHeight': number,
        'availLeft': number,
        'availTop': number,
        'width': number,
        'height': number,
        'colorDepth': number,
        'pixelDepth': number
    },
    'body': {
        'clientWidth': number,
        'clientHeight': number
    },
    'webgl': WebGLDescriptor,
    'webgl2': WebGLDescriptor,
    mimeTypes: Array<{
        mimeType: string,
        audioPlayType: string,
        videoPlayType: string,
        mediaSource: boolean,
        mediaRecorder: boolean,
    }>,
    'mediaDevices': Array<{
        'deviceId': string,
        'kind': string,
        'label': string,
        'groupId': string
    }>,
    'battery': {
        charging: boolean,
        chargingTime: number,
        dischargingTime: number,
        level: number,
    },
    'voices': Array<{
        default: boolean,
        lang: string,
        localService: boolean,
        name: string,
        voiceURI: string,
    }>,
    'windowVersion': string[],
    'htmlElementVersion': string[],
    'keyboard': Record<string, string>,
    'permissions': Record<string, {
        'state'?: string,
        'exType'?: string,
        'msg'?: string,
    }>,
}

interface WebGLDescriptor {
    'supportedExtensions': string[],
    'contextAttributes': {
        'alpha': boolean,
        'antialias': boolean,
        'depth': boolean,
        'desynchronized': boolean,
        'failIfMajorPerformanceCaveat': boolean,
        'powerPreference': string,
        'premultipliedAlpha': boolean,
        'preserveDrawingBuffer': boolean,
        'stencil': boolean,
        'xrCompatible': boolean
    },
    'maxAnisotropy': number,
    'params': Record<string, {
        'type': string,
        'value': null | string | number | number[] | Record<string, number>
    }>,
    'shaderPrecisionFormats': Array<{
        'shaderType': number,
        'precisionType': number,
        'r': {
            'rangeMin': number,
            'rangeMax': number,
            'precision': number,
        }
    }>
}

type ChromeUACHHeaders = {
    'Accept-Language'?: string,
    // 'referer': referers[sh.rd(0, referers.length - 1)],
    'sec-ch-ua'?: string,
    'sec-ch-ua-mobile'?: string,
    'sec-ch-ua-platform'?: string,
}

/**
 * Simplify the font information into family, style, weight, size
 */
interface FontDescriptor {
    fontFamily: string,
    fontStyle: string,
    fontWeight: string,
    fontSize: number,
}

interface FakeFont {
    exists: boolean,
    originalFontFamily: string,
    fakeFont: FontDescriptor,
}

type IFontSalt = {
    exists: boolean,
    offsetWidth: number,
    offsetHeight: number,
    style: string,
    weight: string,
    size: number,
}

interface FakeDeviceDescriptor extends DeviceDescriptor {
    canvasSalt?: number[],
    // TODO: I should make a correspondence between user's existing fonts and required fonts,
    //  but I don't have time to do it for now.
    // fakeFonts: Array<FakeFont>,
    fontSalt?: {
        [key: string]: IFontSalt
    },
    acceptLanguage?: string,
}

declare function checkLegal(dd: DeviceDescriptor): boolean;

declare function deviceUUID(e: DeviceDescriptor): string;

declare function buildAcceptLanguage(deviceDesc: DeviceDescriptor): string;

declare function buildFontSalt(): number;

declare function buildCanvasSalt(): number;
