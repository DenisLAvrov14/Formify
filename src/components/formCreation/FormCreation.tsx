import { useState, useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../services/firebase'; 

const FormCreation = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Для отслеживания состояния авторизации
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleAddQuestion = () => {
    if (newQuestion.trim() !== '') {
      setQuestions([...questions, newQuestion]);
      setNewQuestion('');
    }
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

    const newForm = {
      title,
      questions,
      userId: user.uid, 
    };

    try {
      await addDoc(collection(db, 'forms'), newForm);
      console.log('Form submitted:', newForm);
      setLoading(false);
      navigate('/forms'); 
    } catch (error) {
      console.error('Error creating form:', error);
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Create New Form</h2>
      {!isLoggedIn && <p>You are not logged in!</p>} {/* Проверка состояния авторизации */}
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
              <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                <span>{question}</span>
                <Button variant="danger" size="sm" onClick={() => handleRemoveQuestion(index)}>
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

        <Button variant="primary" type="submit" className="mt-4" disabled={loading}>
          {loading ? 'Processing...' : 'Create Form'}
        </Button>
      </Form>
    </Container>
  );
};

export default FormCreation;
