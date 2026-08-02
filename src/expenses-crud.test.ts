import request from 'supertest';
import app from './index';

describe('Expenses API - Additional CRUD', () => {
  describe('GET /expenses', () => {
    it('should return a list of expenses', async () => {
      const res = await request(app).get('/expenses');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('PUT /expenses/:id', () => {
    it('should update an existing expense', async () => {
      const created = await request(app)
        .post('/expenses')
        .send({ user_id: 1, title: 'Old title', amount: 20 });

      const res = await request(app)
        .put(`/expenses/${created.body.id}`)
        .send({ title: 'Updated title', amount: 99 });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated title');
    });

    it('should return 404 when updating a non-existent expense', async () => {
      const res = await request(app)
        .put('/expenses/999999')
        .send({ title: 'Nope' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /expenses/:id', () => {
    it('should delete an existing expense', async () => {
      const created = await request(app)
        .post('/expenses')
        .send({ user_id: 1, title: 'To delete', amount: 15 });

      const res = await request(app).delete(`/expenses/${created.body.id}`);
      expect(res.status).toBe(204);
    });

    it('should return 404 when deleting a non-existent expense', async () => {
      const res = await request(app).delete('/expenses/999999');
      expect(res.status).toBe(404);
    });
  });
});