const average = require('../utils/for_testing').average

describe('average', () => {
    test('of {1,2,3,4,5}', () => {
        const arr = [1, 2, 3, 4, 5]
        const result = average(arr)

        expect(result).toBe(3)
    })

    test('of empty array is 0', () => {
        expect(average([])).toBe(0)
    })

    test('of one value is the value itself', () => {
        expect(average[1]).toBe(1)
    })
})