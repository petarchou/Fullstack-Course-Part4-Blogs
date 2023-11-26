const dummy = require('../utils/list_helper').dummy;


test('dummy returns one', () => {
    const result = []

    expect(dummy(result)).toBe(1)
})