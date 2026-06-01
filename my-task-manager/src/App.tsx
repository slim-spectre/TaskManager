import { useState,useEffect } from 'react';
import type { ITask } from './interfaces/ITask';
import AddTask from './components/AddTask'
import TaskItem from './components/TaskItem'
import './styles/App.css';
import FilterMenu from './components/FilterMenu'
import {api} from './services/api'
import {uk} from './locales/uk'
import {en} from './locales/en'
import {Route,Routes} from 'react-router-dom'
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage  from "./pages/RegisterPage"
import { Toaster,toast } from 'react-hot-toast';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Header';
import ProtectedRoutes from './hoc/ProtectedRoutes';


function App() {
  const [tasks,setTasks] = useState<ITask[]>([]);
  const [filter,setFilter] = useState<"All" | "Active" | "Completed">("All");
  const [lang,setLang] = useState<"uk" | "en">("en");
  const t = lang === "uk" ? uk.translation : en.translation;
  const filteredTasks = tasks.filter(t => {
    if(filter == "Active") return t.status !== 'Done';
    if(filter == 'Completed') return t.status == 'Done';
    return true;
  })

  const [token, setToken] = useState<string | null>(() => localStorage.getItem("accessToken"));

useEffect(() => {
    if (!token) {
        setTasks([]); 
        return;
    }

    let isMounted = true;

    const loadTasks = async () => {
      try {
        const data = await api.GetTasks();
        if (isMounted) {
            const formattedData = data.map((t: ITask) => ({
              ...t,
              createdAt: new Date(t.createdAt)
            }));
            setTasks(formattedData);
        }
      } catch(error) {
        console.error("Your error: " + error);
      }
    };

    loadTasks();

    return () => {
        isMounted = false;
    };
}, [token]); 


  const handleUpdateStatus = async (id : number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    let newStatus : ITask['status'] = task.status;
    if(task.status == 'Todo') newStatus = 'InProgress';
    else if(task.status == 'InProgress' ) newStatus = 'Done';

    const updatedTask = {...task, status: newStatus};

    try {
      const response = await api.UpdateStatus(id, updatedTask);
      if (response && response.ok) {
        setTasks(prevTasks => prevTasks.map(t => t.id === id ? {...t, status: newStatus} : t));
        toast.success("Task status was updated successfully")
      }
    } catch(error) {
      toast.error("Could not update task status :(")
      console.error(error);
    }
  }

  const handleAddTask = async (title : string, description : string, priorityTask: string) => {
    const newObject : ITask = {
      id: 0,
      title: title,
      description: description,
      status: 'Todo',
      priority: priorityTask as ITask['priority'],
      createdAt: new Date()
    };
    try {
        const data = await api.AddTask(newObject);
        const formattedTask = { ...newObject, ...data, createdAt: new Date(data.createdAt || newObject.createdAt) };
        setTasks(prev => [formattedTask, ...prev]);
        toast.success("Task was added successfully")
    } catch(error) {
        toast.error("Could not add task :(")
        console.error(error);
    }
  }

  const handleDeleteTask = async (id : number) => {
    try {
      const response = await api.DeleteTask(id);
      if (response && response.ok) {
        setTasks(prev => prev.filter(t => t.id != id));
        toast.success("Task was deleted successfully")
      }
    } catch(error) {
      toast.error("Could not delete task :(")
      console.error(error);
    }
  }

  const handleEditTask = async (updatedTask : ITask) => {
      setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
  }

  return (
    <div className='allBlock'>
      <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
      <Route path='/' element={<WelcomePage />} />
      
      <Route path='/register' element={<RegisterPage
       t={t}
       onRegisterSuccess={(newToken) => setToken(newToken)}
        />} />
      
      <Route path='/login' element={<LoginPage
       t={t}
      onLoginSuccess={(newToken) => setToken(newToken)}
       />} />

      <Route path='/tasks' element={
        <ProtectedRoutes>
          <div className='main'>
          <Header onLogout={handleLogout} setLang={setLang} lang={lang} />
          <AddTask onAdd={handleAddTask} t={t} />
          <FilterMenu currentFilter={filter} t={t} onFilterChanged={setFilter} />
          <div className='items'>
            {tasks.length > 0 && filteredTasks.map(taskItem => (
              <TaskItem 
                key={taskItem.id} 
                task={taskItem} 
                t={t} 
                onDelete={handleDeleteTask} 
                onEditTask={handleEditTask} 
                onUpdate={handleUpdateStatus} 
              />
            ))}
            {tasks.length === 0 && <p className='NoItemsInfo'>{t.noTasks}</p>}
          </div>
        </div>
        </ProtectedRoutes>
       
      } />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
      </>
    </div>
  );


 
}

export default App
