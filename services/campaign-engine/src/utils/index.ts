

export function isShortVideo(videoLength: number) {
    return videoLength <= 60; // video is shorter than 60 seconds
}

export function isLongVideo(videoLength: number) {
    return videoLength > 60; // video is longer than 60 seconds
}
