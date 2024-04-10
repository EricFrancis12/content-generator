import { generateInternalId } from '.';

test('Checking generateInternalId', () => {
    expect(typeof generateInternalId()).toEqual('string');
});
