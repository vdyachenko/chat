const expect = require('expect');

const {generateMessageObject} = require('../messageHelper');

describe('generateMessageObject', () => {
    it('Should generate correct message object', () => {
        const from = 'Test';
        const message = 'Test message';
        const response = generateMessageObject(from, message);
        expect(response.createdAt).toBeA('number');
        expect(response).toInclude({
            from,
            message
        });
    });
});