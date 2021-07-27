import * as assert from 'power-assert';

import { Framework } from '@midwayjs/web';
import { createApp, close, createHttpRequest } from '@midwayjs/mock';

import { Application } from '../../../src/interface';

describe('test/controller/admin/user.test.ts', () => {
  let app: Application;
  let currentUser: any;
  let currentAdminUser: any;
  beforeAll(async () => {
    app = await createApp<Framework>();

    const response = await createHttpRequest(app)
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200);
    currentUser = response.body.data;
  });

  afterAll(async () => {
    await close(app);
  });

  it('should get /admin/user/query ', async () => {
    const response = await createHttpRequest(app)
      .get('/admin/user/query')
      .query({
        sorter: 'id_descend',
        id: '1',
        name: 'Admin',
        username: 'admin',
      })
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert.ok(response.body.data.total);
  });

  it('should get /admin/user/show ', async () => {
    const response = await createHttpRequest(app)
      .get('/admin/user/query')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);
    assert.ok(response.body.data.total);
    const { list } = response.body.data;
    const response2 = await createHttpRequest(app)
      .get('/admin/user/show')
      .query({
        id: list[0].id,
      })
      .set('Authorization', `Bearer ${currentUser.token}`);
    assert.deepEqual(response2.body.data.id, list[0].id);
  });

  it('should post /admin/user/create ', async () => {
    const params = {
      name: 'fakeName',
      username: 'fakeUserName',
      password: '123456',
      roles: ['1'],
      permissions: ['1'],
    };
    const response = await createHttpRequest(app)
      .post('/admin/user/create')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(201);
    assert.ok(response.body.data);
    currentAdminUser = response.body.data;
  });

  it('should patch /admin/user/update ', async () => {
    const params = {
      id: currentAdminUser.id,
      name: 'fakeName2',
      username: 'fakeUserName2',
      password: '1234567',
      roles: ['1'],
      permissions: ['1'],
    };
    const response = await createHttpRequest(app)
      .patch('/admin/user/update')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });

  it('should delete /admin/user/remove ', async () => {
    const params = {
      ids: [currentAdminUser.id],
    };
    const response = await createHttpRequest(app)
      .del('/admin/user/remove')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .type('form')
      .send(params)
      .expect(204);
    assert.deepEqual(response.status, 204);
  });
});
