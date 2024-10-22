import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Authentication from './components/authentication/authentication';
import Dashboard from './components/dashboard/Dashboard';
import TemplateDashboard from './components/templateDashboard/TemplateDashboard';
import TemplateForm from './components/templateForm/TemplateForm';
import FormCreation from './components/formCreation/FormCreation';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import FormDetails from './components/formDatails/FormDetails';
import FormEdit from './components/formEdit/FormEdit ';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Authentication />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <TemplateDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-template"
          element={
            <ProtectedRoute>
              <TemplateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-template/:id"
          element={
            <ProtectedRoute>
              <TemplateForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-form"
          element={
            <ProtectedRoute>
              <FormCreation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-form/:id"
          element={
            <ProtectedRoute>
              <FormDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-form/:id"
          element={
            <ProtectedRoute>
              <FormEdit />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
