import { useState, useEffect } from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'; // useParams для получения ID формы
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, doc, updateDoc, getDoc, collection } from 'firebase/firestore';
import { db } from '../services/firebase';

const FormCreation = () => {
  const { id } = useParams<{ id: string }>(); // Получаем id из URL для редактирования
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Проверка авторизации пользователя
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Если форма редактируется, загружаем данные формы по id
  useEffect(() => {
    if (id) {
      const fetchForm = async () => {
        try {
          const docRef = doc(db, 'forms', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const formData = docSnap.data();
            setTitle(formData.title);
            setQuestions(formData.questions || []);
          } else {
            console.error('Form not found');
            setError('Form not found');
          }
        } catch (error) {
          console.error('Error fetching form:', error);
          setError('Error fetching form');
        }
      };

      fetchForm();
    }
  }, [id]);

  const handleAddQuestion = () => {
    if (newQuestion.trim() === '') {
      setError('Question cannot be empty.');
      return;
    }

    setQuestions([...questions, newQuestion]);
    setNewQuestion('');
    setError(null);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('User is not authenticated.');
      setLoading(false);
      navigate('/login');
      return;
    }

    if (questions.length === 0) {
      setError('At least one question is required.');
      setLoading(false);
      return;
    }

    const form = {
      title,
      questions,
      userId: user.uid,
    };

    try {
      if (id) {
        // Если редактирование, обновляем документ
        const docRef = doc(db, 'forms', id);
        await updateDoc(docRef, form);
        console.log('Form updated:', form);
      } else {
        // Если создание новой формы, создаем документ
        await addDoc(collection(db, 'forms'), form);
        console.log('Form created:', form);
      }

      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving form:', error);
      setLoading(false);
      setError('Failed to save form. Please try again.');
    }
  };

  return (
    <Container className="mt-4">
      <h2>{id ? 'Edit Form' : 'Create New Form'}</h2>
      {!isLoggedIn && <p>You are not logged in!</p>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter form title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="questions" className="mt-3">
          <Form.Label>Questions</Form.Label>
          <div>
            {questions.map((question, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <span>{question}</span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          <Form.Control
            type="text"
            placeholder="Add a new question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="mt-2"
          />
          <Button className="mt-2" onClick={handleAddQuestion}>
            Add Question
          </Button>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="mt-4"
          disabled={loading}
        >
          {loading ? 'Processing...' : id ? 'Update Form' : 'Create Form'}
        </Button>
      </Form>
    </Container>
  );
};

export default FormCreation;
