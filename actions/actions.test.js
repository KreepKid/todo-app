import { describe, it, expect, vi } from 'vitest';
import { editTask } from './actions';
import { prisma } from '@/lib/prisma';

// 1. Mock Next.js cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// 2. Mock our Prisma database client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    task: {
      update: vi.fn(),
    },
  },
}));

describe('editTask', () => {
  it('should safely parse a string dueDate into a Date object', async () => {
    // Call the function
    await editTask(1, "My Task", "Desc", "2026-10-31", "Personal", "In-Progress");

    // Verify it sent the converted Date to Prisma
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        title: "My Task",
        description: "Desc",
        dueDate: new Date("2026-10-31"), 
        topic: "Personal",
        status: "In-Progress"
      }
    });
  });
});