// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /unknownpath', () => {
    //If the resources can't be found
    test('non existent path should give 404', async () => {
      const res = await request(app).get('/unknownpath');
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        status: 'error',
        error: {
          message: 'not found',
          code: 404,
        },
      });
    });
  });