import type { ITaskItemProps } from '../interfaces/ITaskItemProps';
import {useState} from 'react';
import {api} from '../services/api'
import type {ITask} from '../interfaces/ITask'
import {validateTitle,validateDescription} from  '../utils/validation';
import toast from 'react-hot-toast';

function TaskItem({task,onDelete,onUpdate,t,onEditTask}:ITaskItemProps){
    const [isEditing,setIsEditing] = useState<boolean>(false);
    const [editTitle,setEditTitle] = useState<string>(task.title);
    const [editDescription,setEditDescription] = useState<string>(task.description);
    const [editPriority,setEditPriority] = useState<"Low" | "Medium" | "High">(task.priority);
    const [titleError,setTitleError] = useState<string>("");
    const [descriptionError,setDescriptionError] = useState<string>("");


    const  handleSave = async () => {
        const updatedTask : ITask = {
            id:task.id,
            title:editTitle,
            description:editDescription,
            status:task.status,
            priority:editPriority as ITask['priority'],
            createdAt:task.createdAt
        };
        try{
            const response = await api.UpdateStatus(task.id,updatedTask);
            if(response.ok){
                onEditTask(updatedTask)
                setIsEditing(false);
                toast.success("Task was edited successfully");
            }
        }catch(error){
            toast.error("Could not update the tast :(");
            console.error("Your error: " + error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditPriority(task.priority);
        setTitleError("");
        setDescriptionError("");
    }

    const handleTitle = (e : React.ChangeEvent<HTMLInputElement>) => {
            const title = e.target.value;
            setEditTitle(title);
            const error = validateTitle(title,t.errors.titleError);
            setTitleError(error);
            }
        
    
    const handleDescription = (e : React.ChangeEvent<HTMLInputElement>) => {
            const description = e.target.value;
            setEditDescription(description);
            const error = validateDescription(description,t.errors.descriptionError);
            setDescriptionError(error);
            }

    const isInvalid = titleError.length > 0 || descriptionError.length > 0;



    return (
        <div>
            {isEditing ? (
                <div className={`task-card editing ${task.status}`}>
                    <input type="text" value={editTitle} placeholder={t.title}
                    className="add-task-input" onChange={handleTitle} />
                    {titleError && <span className='error-text'>{titleError}</span>}

                    <input type="text" value={editDescription} placeholder={t.description}
                    className="add-task-input" onChange={handleDescription} />
                    {descriptionError && <span className='error-text'>{descriptionError}</span>}

                    <select
                        value={editPriority}
                        className={`select-priority ${editPriority}`}
                        onChange={(e) => setEditPriority(e.target.value as "Low" | "Medium" | "High")}>
                            <option value="Low">{t.priorities.Low}</option>
                            <option value="Medium">{t.priorities.Medium}</option>
                            <option value="High">{t.priorities.High}</option>
                        </select>

                    <button onClick={() => handleSave()} disabled={isInvalid} className='save-button'>{t.editButtons.Save}</button>
                    <button onClick={() => handleCancel()} className='cancel-button'>{t.editButtons.Cancel}</button>
                </div>
            ) : (
                <div className={`task-card ${task.status}`}>
                    <div className="task-card-top">
                        <h3>{task.title}</h3>
                        <button onClick={() => setIsEditing(true)} className='editTaskButton'
                            ><img src="/images/edit-tools(1).png" alt="edit"/></button>
                    </div>
                    <p>{task.description}</p>
                    <span className={`priority-badge ${task.priority}`}>
                        {t.priorities[task.priority]}
                    </span>
                    <span>Status: {t.statuses[task.status]}</span>


                    <button onClick={() => onDelete(task.id)} className='delete-button'>{t.delete}</button>
                    <button onClick={() => onUpdate(task.id)} className='status-button'>{t.nextStatus}</button>
                </div>
            )}
        </div>
        
        
    );
}
export default TaskItem
