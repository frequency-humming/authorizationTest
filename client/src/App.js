import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import LinkPage from './components/LinkPage';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import Users from './components/Users';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />      
        <Route path="unauthorized" element={<Unauthorized />} />
        
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="linkpage" element={<LinkPage />} />
        </Route>
        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;