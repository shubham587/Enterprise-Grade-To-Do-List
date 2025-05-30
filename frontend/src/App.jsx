import { Provider } from 'react-redux'
import { store } from './store/store'
import { TaskInput } from './components/TaskInput'
import { TaskList } from './components/TaskList'

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Natural Language Task Manager
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <TaskInput />
            <TaskList />
          </div>
        </main>
      </div>
    </Provider>
  )
}

export default App
