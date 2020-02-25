export const errorName = {
    UNAUTHORIZED: "UNAUTHORIZED",
    INVALID_POST_ID: "INVALID_POST_ID",
    INVALID_COMMENT_ID: "INVALID_COMMENT_ID",
    POST_DELETE_ERROR: "POST_DELETE_ERROR",
    POST_NOT_FOUND: "POST_NOT_FOUND",
    COMMENT_DELETE_NOT_ALLOWED: "COMMENT_DELETE_NOT_ALLOWED",
    COMMENT_NOT_FOUND: "COMMENT_NOT_FOUND",
    PUBLISH_NOT_ALLOWED: "PUBLISH_NOT_ALLOWED",
    POST_DELETE_NOT_ALLOWED: "POST_DELETE_NOT_ALLOWED",
    INVALID_USER: "INVALID_USER",
    INVALID_PASSWORD: "INVALID_PASSWORD",
    EXPIRED_TOKEN: "EXPIRED_TOKEN",
    USER_NOT_FOUND: "USER_NOT_FOUND",

}

export const errorDetails = {
    INVALID_USER: {
        message: "User not found.",
        statusCode: 400
    }, INVALID_PASSWORD: {
        message: "Invalid password.",
        statusCode: 400
    },
    POST_DELETE_NOT_ALLOWED: {
        message: "Only author can delete a post.",
        statusCode: 403
    },
    COMMENT_DELETE_NOT_ALLOWED: {
        message: "Only author can delete a comment.",
        statusCode: 403
    },
    PUBLISH_NOT_ALLOWED: {
        message: "Only author can publish a post.",
        statusCode: 403
    }, POST_NOT_FOUND: {
        message: "Post not found.",
        statusCode: 404
    },
    COMMENT_NOT_FOUND: {
        message: "Comment not found.",
        statusCode: 404
    },
    POST_DELETE_ERROR: {
        message: "Error while deleting Post.",
        statusCode: 500
    },
    INVALID_POST_ID: {
        message: "Post ID is not valid.",
        statusCode: 400
    },
    INVALID_COMMENT_ID: {
        message: "Comment ID is not valid.",
        statusCode: 400
    },
    UNAUTHORIZED: {
        message: "Authentication is needed.",
        statusCode: 401
    },
    EXPIRED_TOKEN: {
        message: "Token has expired",
        statusCode: 401
    },
    USER_NOT_FOUND: {
        message: "User not found",
        statusCode: 400
    }
}