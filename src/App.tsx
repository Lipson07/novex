
import './App.scss'
import {Route, Routes} from 'react-router-dom';
import Registration from './Components/Form/Registration';
function App() {


  return (
    <>
<Routes>
<Route path="/" element={<Registration/>}/>        
</Routes>
    </>
  )
}

export default App
