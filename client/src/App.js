import { Routes, Route, BrowserRouter } from 'react-router-dom';
import About from './Components/About';
import Login from './Components/Login';
import Registration from './Components/Registration';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Registration/>}/>
        <Route path= "/about" element={<About/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
