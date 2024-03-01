// tests/unit/get[id].test.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {

    // Using a valid username/password to get the fragment by id should give a success result with a .fragments array
    test('authenticated users get a fragments array by id', async () => {
      const body = 'This is a fragment';
      const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain; charset=utf-8')
      .auth('user1@email.com', 'password1')
      .send(body)
      .expect(201);

      const fragmentId = res.body.fragment.id;
      const res2 = await request(app).get(`/v1/fragments/${fragmentId}/info`).auth('user1@email.com', 'password1');
      expect(res2.body.status).toBe('ok');
      expect(res2.body.fragment).toHaveProperty('id');
      expect(res2.body.fragment.type).toBe('text/plain; charset=utf-8');
      
    });

    // If the fragment does not exist, it should be rejected
    test('non-existent fragment should be rejected', async () => {
      const fragmentId = 'non-existent-id';
     const res = await request(app).get(`/v1/fragments/${fragmentId}/info`).auth('user1@email.com', 'password1');
     expect(res.statusCode).toBe(500);
    });

  });