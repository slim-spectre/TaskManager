const BASE_URL = "http://localhost:5208/tasks";
import type { ITask } from '../interfaces/ITask';
import { authenticatedFetch } from '../utils/AuthenticatedFetch';

export const api = {
    async GetTasks() {
        const response = await authenticatedFetch(BASE_URL, { method: "GET" });
        return response.json();
    },

    async AddTask(task: ITask) {
        const response = await authenticatedFetch(BASE_URL, { 
            method: "POST", 
            body: JSON.stringify(task) 
        });
        
        if (response.status === 204 || response.headers.get("content-length") === "0") {
            return task;
        }
        
        return response.json();
    },

    async DeleteTask(id: number) {
        return await authenticatedFetch(BASE_URL + `/${id}`, { method: "DELETE" });
    },

    async UpdateStatus(id: number, newTask: ITask) {
        return await authenticatedFetch(BASE_URL + `/${id}`, { 
            method: "PUT", 
            body: JSON.stringify(newTask) 
        });
    }
};