import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const tasks = await prisma.task.findMany();
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener las tareas' });
    }
  } else if (req.method === 'POST') {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'El título y la descripción son obligatorios' });
    }

    try {
      const newTask = await prisma.task.create({
        data: { title, description },
      });
      res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la tarea' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
