// tests/routes/api/get.test.js
const request = require('supertest');
const express = require('express');
const getFragment = require('../../src/routes/api/get');
const Fragment = require('../../src/model/fragment');

const app = express();
app.get('/v1/fragments/:id', (req, res) => getFragment(req, res));

jest.mock('../../src/model/fragment');

describe('GET /v1/fragments/:id', () => {
  test('should respond with a list of fragments', async () => {
    const mockFragments = [{ id: 1, name: 'Fragment 1' }, { id: 2, name: 'Fragment 2' }];
    Fragment.Fragment.byId.mockResolvedValue(mockFragments);

    const res = await request(app).get('/v1/fragments/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: 'ok',
      fragments: mockFragments,
    });
  });

  test('should respond with a 500 status code on error', async () => {
    Fragment.Fragment.byId.mockRejectedValue(new Error('Test error'));

    const res = await request(app).get('/v1/fragments/1');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      status: 'error',
      error: {
        message: 'Test error',
        code: 500,
      },
    });
  });
});