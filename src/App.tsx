import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Authentication from './components/authentication/authentication';
import Dashboard from './components/dashboard/Dashboard';
import TemplateForm from './components/templateForm/TemplateForm';
import FormCreation from './components/formCreation/FormCreation';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import FormDetails from './components/formDatails/FormDetails';
import FormEdit from './components/formEdit/FormEdit ';
import FormAnswer from './components/formAnswer/FormAnswer';
import TemplateResults from './components/templateResults/TemplateResults';

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
        <Route
          path="/fill-form/:id"
          element={
            <ProtectedRoute>
              <FormAnswer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/template-results/:templateId"
          element={
            <ProtectedRoute>
              <TemplateResults />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
