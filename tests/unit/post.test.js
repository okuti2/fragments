// tests/unit/post.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
    // If the request is missing the Authorization header, it should be forbidden
    test('unauthenticated requests are denied', () => 
      request(app).post('/v1/fragments').expect(401));
  

    // If the wrong username/password pair are used (no such user), it should be forbidden
    test('incorrect credentials are denied', () =>
      request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  
    // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users can create a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain; charset=utf-8')
      .auth('user1@email.com', 'password1')
      .send('This is a fragment')
      .expect(201);

    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment.type).toBe('text/plain; charset=utf-8');
  });
  
  });
