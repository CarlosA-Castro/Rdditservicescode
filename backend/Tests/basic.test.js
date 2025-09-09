describe('Basic Test Suite', () => {
  test('1 + 1 should equal 2', () => {
    expect(1 + 1).toBe(2);
  });

  test('Should have basic arithmetic working', () => {
    expect(5 * 5).toBe(25);
    expect(10 - 3).toBe(7);
  });

  test('Should handle string operations', () => {
    expect('Hello' + ' World').toBe('Hello World');
  });
});