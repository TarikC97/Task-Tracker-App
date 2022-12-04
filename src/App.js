import { useEffect, useState }  from 'react';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Header from "./components/Header";
import Footer from './components/Footer';
import Tasks from "./components/Tasks";
import AddTask from './components/AddTask';
import About from './components/About';

const App = () => {

  const [showTask, setShowTask ]= useState (false)
  const[tasks, setTasks] = useState([])
  
useEffect(()=>{
    const getTasks = async () =>{
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  },[])

//Fetch data from Json server  
const fetchTasks = async () =>{
    const result = await fetch('http://localhost:5000/tasks')
    const data = await result.json()

    return data
  }

//Fetch single data from JSON server
const fetchTask = async (id) =>{
    const result = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await result.json()

    return data
}

//Add Task
const addTask = async (task)=>{
  const result = await fetch('http://localhost:5000/tasks',{
    method: 'POST',
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify(task)
  })
  //adding new Task
  const data = await result.json()

  setTasks([...tasks,data])

  // const id = Math.floor(Math.random()*10000)+1
  // const newTask = {id, ...task}
  // setTasks([...tasks, newTask])
}


 // Delete Task
 const deleteTask =async (id)=>{
    //Deleting from jsonServer
    await fetch(`http://localhost:5000/tasks/${id}`,
    {
      method: 'DELETE',
    })

    setTasks(tasks.filter((task)=> task.id !== id))
    console.log('delete',id)
 }
//Toggle Reminder
const toggleReminder =async (id)=>{
const taskToggle = await fetchTask(id)
const updatedTask ={...taskToggle,reminder: !taskToggle.reminder}

const result= await fetch(`http://localhost:5000/tasks/${id}`,{
  method: 'PUT',
  headers: {
    'Content-type': 'application/json'
  },
  body: JSON.stringify(updatedTask)
})
const data = await result.json()

setTasks(
  tasks.map((task)=> 
  task.id === id ? {...task,reminder: !data.reminder} : task))
  console.log('Change')
}
return (
  <Router>
   <div className="container">
     <Header onAdd={()=> setShowTask
      (!showTask)} 
      showAdd={showTask} 
      />
  <Routes>
    <Route path='/about' element={<About/>} />
    <Route path='/' exact 
    element={(
      <>
       {showTask &&  <AddTask onAdd=
       {addTask}/>}

    {tasks.length > 0 ?(
    <Tasks tasks={tasks} 
          onDelete={deleteTask} 
          onToggle={toggleReminder}  
        />
      ) :(
        'No Tasks to show'
      )}
      </>
    )} />
  </Routes>
   <Footer />
     </div>
  </Router>
   )
 }

export default App
