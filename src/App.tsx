import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Authentication from './components/authentication/authentication';
import Dashboard from './components/dashboard/Dashboard';
import TemplateDashboard from './components/templateDashboard/TemplateDashboard';
import TemplateForm from './components/templateForm/TemplateForm';
import FormCreation from './components/formCreation/FormCreation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Authentication />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/templates" element={<TemplateDashboard />} />
        <Route path="/create-template" element={<TemplateForm />} />
        <Route path="/edit-template/:id" element={<TemplateForm />} />
        <Route path="/create-form" element={<FormCreation />} /> 
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
