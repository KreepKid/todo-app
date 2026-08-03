"use server";

import { prisma } from "@/lib/prisma";

export async function createTask(title, description, dueDate, topic){
    await prisma.task.create({
        data: {
            title: title, //can also be written as just title, if the key and value are the same
            description, //example of shorthand property names mentioned above
            dueDate: dueDate !== "" ? new Date(dueDate) : new Date(),
            topic: topic, 
            status: "Todo"
        }
    });
}

export async function getTasks() {
    return await prisma.task.findMany();
}

export async function archiveTask(id) {
    await prisma.task.update({
        where: { id: id },
        data: { archived: true }
    });
}

export async function editTask(id, title, description, dueDate, topic, status) {
    await prisma.task.update({
        where: { id: id },
        data: {
            title: title,
            description: description,
            dueDate: dueDate,
            topic: topic,
            status: status
        }
    });
}