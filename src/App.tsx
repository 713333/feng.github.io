import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Practice from './pages/Practice';
import PracticeDetail from './pages/PracticeDetail';
import Assessment from './pages/Assessment';
import AssessmentDetail from './pages/AssessmentDetail';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="practice" element={<Practice />} />
          <Route path="practice/:id" element={<PracticeDetail />} />
          <Route path="assessment" element={<Assessment />} />
          <Route path="assessment/:id" element={<AssessmentDetail />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
