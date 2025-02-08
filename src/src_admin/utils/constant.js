export const constant = {
  // access key
  X_API_KEY: 'A8SQFT7767',

  // base url
  // SERVER_BASE_URL: "https://api.8sqft.com/api/v1",
  SERVER_BASE_URL: 'http://localhost:5000/api/v1',
  FRONT_BASE_URL: 'https://8sqft.com',
  CURRENCY_SYMBOL : '₹',

  // user roles
  PROPERTY_STATUS: {
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    PENDING: 'PENDING',
    DELISTED: 'DELISTED',
    RENT_OUT: 'RENT OUT',
    SOLD_OUT: 'SOLD OUT',
  },
  USER_ROLES: {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    AREA_HEAD_LIST: 'AREA_HEAD_LIST',
    AREA_HEAD_SITE: 'AREA_HEAD_SITE',
    SITE_PERSON: 'SITE_PERSON',
  },
  USER_STATUS: {
    BLOCK: 'BLOCK',
    ENABLE: 'ENABLE',
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    REJECTED: 'REJECTED',
    SUSPENDED: 'SUSPENDED',
    DISABLED: 'DISABLED',
  },

  PROPERTY_USER_TYPE: {
    BUILDER: 'BUILDER',
    OWNER: 'OWNER'
  },

  PROPERTY_TYPE: {
    RESIDENTIAL: 'RESIDENTIAL',
    COMMERCIAL: 'COMMERCIAL',
    PLOT: 'PLOT',
    OPEN_LAND: 'OPEN LAND'    
  },

  PROJECT_ATTR : {
    RENT: 'RENT',
    BUY: 'BUY',
    PROJECT: 'PROJECT',
    PG : 'PG'
  },

  FILE_TYPE: {
    // Images
    IMAGE_PNG: 'image/jpeg',
    IMAGE_JPG: 'image/png',
    IMAGE_GIF: 'image/gif',
    IMAGE_BMP: 'image/bmp',
    IMAGE_WEBP: 'image/webp',
    IMAGE_SVG: 'image/svg+xml',
    IMAGE_TIFF: 'image/tiff',

    // Documents
    PDF: 'application/pdf',
    DOC: 'application/msword',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    XLS: 'application/vnd.ms-excel',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    PPT: 'application/vnd.ms-powerpoint',
    PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    TXT: 'text/plain',
    CSV: 'text/csv',
    RTF: 'application/rtf',
    ODT: 'application/vnd.oasis.opendocument.text',
    ODS: 'application/vnd.oasis.opendocument.spreadsheet',
    ODP: 'application/vnd.oasis.opendocument.presentation',

    // Audio
    AUDIO_MP3: 'audio/mpeg',
    AUDIO_WAV: 'audio/wav',
    AUDIO_OGG: 'audio/ogg',
    AUDIO_FLAC: 'audio/flac',
    AUDIO_AAC: 'audio/aac',
    AUDIO_M4A: 'audio/mp4',

    // Video
    VIDEO_MP4: 'video/mp4',
    VIDEO_WEBM: 'video/webm',
    VIDEO_MKV: 'video/x-matroska',
    VIDEO_AVI: 'video/x-msvideo',
    VIDEO_MOV: 'video/quicktime',
    VIDEO_FLV: 'video/x-flv',
    VIDEO_WMV: 'video/x-ms-wmv',

    // Archives
    ZIP: 'application/zip',
    RAR: 'application/vnd.rar',
    TAR: 'application/x-tar',
    GZ: 'application/gzip',
    SEVEN_ZIP: 'application/x-7z-compressed',

    // Code & Markup
    HTML: 'text/html',
    CSS: 'text/css',
    JS: 'application/javascript',
    JSON: 'application/json',
    XML: 'application/xml',
    YAML: 'application/x-yaml',
    MD: 'text/markdown',
  },
}
