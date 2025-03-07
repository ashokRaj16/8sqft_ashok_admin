
export const allowedRole = {
    SUPER_ADMIN : {
        EDIT : true,
        ADD : true,
        DELETE : true,
        EXPORT : true,
        STATUS : true
    },
    ADMIN : {
        EDIT : true,
        ADD : true,
        DELETE : false,
        EXPORT : true,
        STATUS : true
    },
    SUB_ADMIN : {
        EDIT : true,
        ADD : true,
        DELETE : false,
        EXPORT : true,
        STATUS : true
    },
    AREA_HEAD_LIST: {
        EDIT : true,
        ADD : true,
        DELETE : false,
        EXPORT : true,
        STATUS : true
    },
    AREA_HEAD_SITE: {
        EDIT : false,
        ADD : false,
        DELETE : false,
        EXPORT : false,
        STATUS : false
    },
    SITE_PERSON : {
        EDIT : false,
        ADD : false,
        DELETE : false,
        EXPORT : false,
        STATUS : false
    },
}