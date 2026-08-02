import express, { Request, Response } from 'express';
import pool from './db';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.post('/expenses', async (req: Request, res: Response) => {
  const { user_id, category_id, title, amount, description, date } = req.body;

  if (!user_id || !title || amount == null) {
    return res.status(400).json({
      error: 'user_id, title and amount are required'
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO expenses
      (user_id, category_id, title, amount, description, date)
      VALUES ($1,$2,$3,$4,$5,COALESCE($6,CURRENT_DATE))
      RETURNING *`,
      [
        user_id,
        category_id || null,
        title,
        amount,
        description || null,
        date || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to create expense'
    });
  }
});

app.get('/expenses', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM expenses ORDER BY id DESC'
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch expenses'
    });
  }
});

app.get('/expenses/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM expenses WHERE id=$1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch expense'
    });
  }
});

app.put('/expenses/:id', async (req: Request, res: Response) => {
  const { title, amount, description, category_id, date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE expenses
       SET
       title = COALESCE($1,title),
       amount = COALESCE($2,amount),
       description = COALESCE($3,description),
       category_id = COALESCE($4,category_id),
       date = COALESCE($5,date)
       WHERE id=$6
       RETURNING *`,
      [
        title,
        amount,
        description,
        category_id,
        date,
        req.params.id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to update expense'
    });
  }
});

app.delete('/expenses/:id', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id=$1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      error: 'Failed to delete expense'
    });
  }
});
if (process.env.NODE_ENV !== 'test') {
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
}
export default app;