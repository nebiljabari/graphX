const { foo } = require('../src/foo');

describe('foo', () => {
  it('should be foo', () => {
    expect(foo).toBe('foo');
  });
});
