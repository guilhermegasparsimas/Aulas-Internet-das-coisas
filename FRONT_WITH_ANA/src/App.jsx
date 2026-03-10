import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cadastro from './components/Cadastro';
import Login from './components/Login';

function App() {


  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route  path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
      </Routes>
     </BrowserRouter>
    </>
  )
};

export default App;
