import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import LinkPages from './components/LinkPages';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import Users from './components/Users';

function App() {

  return ( 
        <Routes>
          <Route path="/" element={<Layout />}>

            <Route path="register" element={<Register />} />      
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="login" element={<Login />} />
            
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Home />} />
              <Route path="users" element={<Users />} />
              <Route path="linkpages" element={<LinkPages />} />
            </Route>
            {/* catch all */}
            <Route path="*" element={<Missing />} />
          </Route>
        </Routes>
  );
}

export default App;