import type {ITask} from './ITask'
import type { TranslationType } from './IFilterMenuProps';

export interface ITaskItemProps {
    task: ITask;
    onDelete: (id : number) => void;
    onUpdate: (id : number) => void;
    onEditTask: (task : ITask) => void;
    t:TranslationType;
}