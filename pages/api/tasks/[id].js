import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

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
      res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.task.delete({
        where: { id: parseInt(id) },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar la tarea' });
      res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
