import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Правильный импорт Firestore
import { FormType } from '../../models/FormType';
import { Button, Container, Card, Spinner, Alert } from 'react-bootstrap';

const FormDetails = () => {
  const { id } = useParams<{ id: string }>(); // Получаем id формы из URL
  const [form, setForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Для кнопки "Назад"

  useEffect(() => {
    if (!id) {
      console.error('Form ID is missing');
      setLoading(false);
      return;
    }

    const fetchForm = async () => {
      try {
        const docRef = doc(db, 'forms', id); // Ссылка на документ
        const docSnap = await getDoc(docRef); // Получаем документ

        if (docSnap.exists()) {
          setForm(docSnap.data() as FormType); // Присваиваем данные
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching form:', error);
      }
      setLoading(false);
    };

    fetchForm();
  }, [id]);

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!form) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Form not found.</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Form Details: {form.title}</h2>

      <h4>Questions</h4>
      {form.questions.map((question, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>{question}</Card.Body>
        </Card>
      ))}

      <div className="text-center">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </Container>
  );
};

export default FormDetails;
