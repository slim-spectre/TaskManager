import {useState} from 'react'
import type { IAddTaskProps } from '../interfaces/IAddTaskProps';
import {validateTitle,validateDescription} from  '../utils/validation';


function AddTask({onAdd,t} : IAddTaskProps){
    const [title,setTitle] = useState<string>("");
    const [description,setDescription] = useState<string>("");
    const [priority,setPriority] = useState<string>("Low");
    const [titleError,setTitleError] = useState<string>(t.errors.titleError);
    const [descriptionError,setDescriptionError] = useState<string>("");

    const handleSubmit = () => {
        if(title.trim()){
            onAdd(title,description,priority);
            setTitle("");
            setDescription("");
            setPriority("Low");
        }
    }

    const handleTitle = (e : React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setTitle(title);
        const error = validateTitle(title,t.errors.titleError);
        setTitleError(error);
        }
    

    const handleDescription = (e : React.ChangeEvent<HTMLInputElement>) => {
        const description = e.target.value;
        setDescription(description);
        const error = validateDescription(description,t.errors.descriptionError);
        setDescriptionError(error);
        }
    

    const isInvalid = titleError.length > 0 || descriptionError.length > 0;



    return (
        <div className="add-task">
            <p>{t.addNewTask}</p>
            <input type="text" value={title} placeholder={t.title} onChange={handleTitle} className="add-task-input" />
            {titleError && <span className='error-text'>{titleError}</span>}
            <input type="text" value={description} placeholder={t.description} onChange={handleDescription} 
            className="add-task-input" />
            {descriptionError && <span className='error-text'>{descriptionError}</span>}
            <select 
                className={`select-priority ${priority}`}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
            >
                <option value="Low">{t.priorities.Low}</option>
                <option value="Medium">{t.priorities.Medium}</option>
                <option value="High">{t.priorities.High}</option>
            </select>
            <button className="add-task-button" onClick={handleSubmit} disabled={isInvalid}>{t.addTaskBtn}</button>
        </div>
    );
}


export default AddTask