import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc, where, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getAuth } from 'firebase/auth';

const FormsTable = () => {
  const [forms, setForms] = useState<any[]>([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchForms = async () => {
      try {
        if (!user) {
          console.error("No user is logged in");
          return;
        }

        // Получаем формы, которые заполнил текущий пользователь
        const q = query(collection(db, 'form_answers'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const formsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setForms(formsData);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, [user]);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await deleteDoc(doc(db, 'form_answers', id)); // Удаляем форму из form_answers
        setForms(forms.filter((form) => form.id !== id));
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
  }, [forms]);

  const handleNavigate = useCallback((templateId: string) => {
    navigate(`/template-results/${templateId}`);
  }, [navigate]);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Template ID</th>
          <th>Submitted At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {forms.length > 0 ? (
          forms.map((form) => (
            <tr key={form.id}>
              <td>{form.templateId}</td>
              <td>
                {form.submittedAt?.seconds
                  ? new Date(form.submittedAt.seconds * 1000).toLocaleString()
                  : 'No date available'}
              </td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(form.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="info"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleNavigate(form.templateId)}
                >
                  View Results
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="text-center">
              No forms available.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default FormsTable;
