import request from 'supertest';
import app from './index';

describe('Expenses API', () => {
  describe('POST /expenses', () => {
    it('should reject creating an expense without amount', async () => {
      const res = await request(app)
        .post('/expenses')
        .send({ user_id: 1, title: 'Test' });

      expect(res.status).toBe(400);
    });

    it('should reject creating an expense without user_id', async () => {
      const res = await request(app)
        .post('/expenses')
        .send({ amount: 100, title: 'Test' });

      expect(res.status).toBe(400);
    });

    it('should create an expense with valid data', async () => {
      const res = await request(app)
        .post('/expenses')
        .send({
          user_id: 1,
          title: 'Test expense',
          amount: 100,
          description: 'Testing',
          date: '2026-07-30',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });
  });

  describe('GET /expenses/:id', () => {
    it('should return 404 for a non-existent expense', async () => {
      const res = await request(app).get('/expenses/999999');
      expect(res.status).toBe(404);
    });

    it('should return the expense for a valid id', async () => {
      const created = await request(app)
        .post('/expenses')
        .send({
          user_id: 1,
          title: 'Lunch',
          amount: 50,
          date: '2026-07-30',
        });

      const res = await request(app).get(`/expenses/${created.body.id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(created.body.id);
    });
  });
});