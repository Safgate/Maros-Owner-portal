import { Routes, Route } from 'react-router-dom'
import OwnerPortal from './pages/OwnerPortal'

function App() {
  return (
    <Routes>
      <Route path="/" element={<OwnerPortal />} />
      <Route path="*" element={<OwnerPortal />} />
    </Routes>
  )
}

export default App
