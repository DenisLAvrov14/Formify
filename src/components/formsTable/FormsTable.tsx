import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { FormType } from '../../models/FormType';

const FormsTable = () => {
  const [forms, setForms] = useState<FormType[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'forms'));
        const formsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FormType[];
        setForms(formsData);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await deleteDoc(doc(db, 'forms', id));
        setForms(forms.filter((form) => form.id !== id));
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Title</th>
          <th>Questions</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {forms.length > 0 ? (
          forms.map((form) => (
            <tr key={form.id}>
              <td>{form.title}</td>
              <td>{form.questions.join(', ')}</td>
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
                  onClick={() => navigate(`/view-form/${form.id}`)}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="ms-2"
                  onClick={() => navigate(`/edit-form/${form.id}`)} // Кнопка для редактирования формы
                >
                  Edit
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
