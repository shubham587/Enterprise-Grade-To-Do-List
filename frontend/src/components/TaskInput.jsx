import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { addTask } from '../store/taskSlice'
import { API_BASE_URL } from '../config'

export function TaskInput() {
  const [input, setInput] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/parse-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to parse task')
      }

      const parsedTask = await response.json()
      
      // Create a new task in the database
      const createResponse = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedTask),
      })

      if (!createResponse.ok) {
        throw new Error('Failed to create task')
      }

      const newTask = await createResponse.json()
      dispatch(addTask(newTask))
      setInput('')
    } catch (error) {
      console.error('Error adding task:', error)
      // TODO: Add proper error handling UI
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a task... (e.g., 'Call John tomorrow at 2pm')"
        className="flex-1"
      />
      <Button type="submit">Add Task</Button>
    </form>
  )
} 