// App.tsx
import { Route, Routes } from 'react-router-dom'
import Header from './UI/Header/Header'
import Home from './UI/Home/HomePage.tsx'
import './UI/Styles/app.scss'
import { ThemeProvider } from './context/Theme.tsx'

import ProjectsPage from './UI/Projects/ProjectsPage.tsx'
import TaskPage from './UI/Tasks/TaskPage.tsx'
import UnderConstruction from './UI/UnderConstruction/UnderConstruction.tsx'
function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Projects" element={<ProjectsPage />} />
          <Route path="/Tasks" element={<TaskPage />} />
          <Route path="/Code" element={<UnderConstruction />} />
          <Route path="/Settings" element={<UnderConstruction />} />
          <Route path="/Ai" element={<UnderConstruction />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
