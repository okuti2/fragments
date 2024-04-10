const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments:id', () => {
  // PUT /fragments/:id updates an existing fragment's data.
  test('PUT /fragments/:id', async () => {
        const body = 'This is a fragment';
        const resPost = await request(app)
        .post('/v1/fragments')
        .set('Content-Type', 'text/plain; charset=utf-8')
        .auth('user1@email.com', 'password1')
        .send(body)
        .expect(201);

        const postId = resPost.body.fragment.id;
        console.log(postId);

        const updatedBody = 'This is an updated fragment';
        await request(app)
        .put(`/v1/fragments/${postId}`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain; charset=utf-8')
        .send(updatedBody)
        .expect(200);

        const res = await request(app)
        .get(`/v1/fragments/${postId}`)
        .auth('user1@email.com', 'password1');

        expect(res.statusCode).toBe(200);
        expect(res.text).toBe(updatedBody);
  });

  // PUT /fragments/:id cannot change fragment's content-type.
  test('PUT /fragments/:id', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain')
      .send('This is a fragment')
      .expect(201);
    const arrPost = resPost.body.fragment;
    await request(app)
      .put(`/v1/fragments/${arrPost.id}`)
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/html')
      .send('This is an updated fragment')
      .expect(404);
  });

  // PUT /fragments/:id cannot find invalid id.
  test('PUT /fragments/:id', async () => {
    await request(app)
      .put(`/v1/fragments/invalid`)
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/html')
      .send('This is an updated fragment')
      .expect(404);
  });

//   // PUT /fragments/:id return 415 fro invalid content-type.
  // test('PUT /fragments/:id', async () => {
  //   const resPost = await request(app)
  //     .post('/v1/fragments')
  //     .auth('user1@email.com', 'password1')
  //     .set('content-type', 'text/plain')
  //     .send('This is a fragment')
  //     .expect(201);
  //   const arrPost = resPost.body.fragment;
  //   await request(app)
  //     .put(`/v1/fragments/${arrPost.id}`)
  //     .auth('user1@email.com', 'password1')
  //     .set('content-type', 'application/xml')
  //     .send('This is an updated fragment')
  //     .expect(415);
  // });
});
