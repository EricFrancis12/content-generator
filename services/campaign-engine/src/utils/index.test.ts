import { isLongVideo, isShortVideo } from '.';

test('Checking isLongVideo', () => {
    expect(isLongVideo(59)).toEqual(false);
    expect(isLongVideo(60)).toEqual(false);
    expect(isLongVideo(61)).toEqual(true);
});

test('Checking isShortVideo', () => {
    expect(isShortVideo(59)).toEqual(true);
    expect(isShortVideo(60)).toEqual(true);
    expect(isShortVideo(61)).toEqual(false);
});
