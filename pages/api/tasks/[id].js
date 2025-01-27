import { PrismaClient } from '@prisma/client';
import Cors from 'cors';

const cors = Cors({
  methods: ['PUT', 'DELETE', 'HEAD'],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  await runMiddleware(req, res, cors);

  if (req.method === 'PUT') {
    const { title, description, completed } = req.body;

    try {
      const updatedTask = await prisma.task.update({
        where: { id: parseInt(id) },
        data: { title, description, completed },
      });
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating task' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.task.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting task' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}