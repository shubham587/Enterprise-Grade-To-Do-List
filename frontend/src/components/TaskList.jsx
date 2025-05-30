import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { TaskCard } from './TaskCard'
import { setTasks } from '../store/taskSlice'
import { API_BASE_URL } from '../config'

export function TaskList() {
  const tasks = useSelector((state) => state.tasks.tasks)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tasks`)
        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }
        const data = await response.json()
        dispatch(setTasks(data))
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    fetchTasks()
  }, [dispatch])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-gray-500">No tasks yet. Add one above!</p>
        )}
      </div>
    </div>
  )
} 