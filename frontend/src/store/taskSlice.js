import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tasks: [],
  status: 'idle',
  error: null,
}

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload)
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task._id === action.payload._id)
      if (index !== -1) {
        state.tasks[index] = action.payload
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task._id !== action.payload)
    },
    setTasks: (state, action) => {
      state.tasks = action.payload
    },
  },
})

export const { addTask, updateTask, deleteTask, setTasks } = taskSlice.actions

export default taskSlice.reducer 