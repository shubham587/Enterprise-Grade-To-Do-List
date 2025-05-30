import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { deleteTask } from '../store/taskSlice'
import { format, parseISO } from 'date-fns'
import { API_BASE_URL } from '../config'

const priorityColors = {
  P1: 'bg-red-100 text-red-800',
  P2: 'bg-orange-100 text-orange-800',
  P3: 'bg-blue-100 text-blue-800',
  P4: 'bg-gray-100 text-gray-800',
}

const priorityOptions = ['P1', 'P2', 'P3', 'P4']

export function TaskCard({ task }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)
  const dispatch = useDispatch()

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${task._id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      dispatch(deleteTask(task._id))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleEdit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedTask),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const updatedTask = await response.json()
      // Update the local state with the response from the server
      setEditedTask(updatedTask)
      setIsEditing(false)
      // Refresh the page to update the task list
      window.location.reload()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date'
    
    try {
      // Try to parse as ISO date string
      const date = parseISO(dateString)
      return format(date, 'PPp')
    } catch (error) {
      console.error('Error formatting date:', error)
      // If parsing fails, return the original string
      return dateString
    }
  }

  if (isEditing) {
    return (
      <div className="flex flex-col p-4 mb-2 bg-white rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Name</label>
            <Input
              value={editedTask.task_name}
              onChange={(e) => setEditedTask({ ...editedTask, task_name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assignee</label>
            <Input
              value={editedTask.assignee}
              onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date/Time</label>
            <Input
              value={editedTask.due_date_time}
              onChange={(e) => setEditedTask({ ...editedTask, due_date_time: e.target.value })}
              className="mt-1"
              placeholder="e.g., tomorrow at 2pm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={editedTask.priority}
              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleEdit}>
            Save
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 mb-2 bg-white rounded-lg shadow">
      <div className="flex-1">
        <h3 className="text-lg font-medium">{task.task_name}</h3>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <span>Assigned to: {task.assignee}</span>
          <span>•</span>
          <span>Due: {formatDate(task.due_date_time)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 text-xs font-medium rounded ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  )
} 