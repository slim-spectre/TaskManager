export interface ITask {
  id:number;
  title:string;
  description:string;
  status: 'Todo' | 'InProgress' | "Done";
  priority: 'Low' | 'Medium' | 'High';
  createdAt:Date;
}

