import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { FormType } from '../../models/FormType';
import { Button, Container, Form, Alert } from 'react-bootstrap';

const FormEdit = () => {
  const { id } = useParams<{ id: string }>(); // Получаем id формы из URL
  const [form, setForm] = useState<FormType | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false); // Для отображения успешного обновления
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      console.error('Form ID is missing');
      setLoading(false);
      return;
    }

    const fetchForm = async () => {
      try {
        const docRef = doc(db, 'forms', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const formData = docSnap.data() as FormType;
          setForm(formData);
          setTitle(formData.title);
          setQuestions(formData.questions);
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

  const handleQuestionChange = (index: number, newValue: string) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? newValue : q
    );
    setQuestions(updatedQuestions);
  };

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
    if (!form) return;

    const updatedForm = {
      title,
      questions,
    };

    // Проверяем, изменились ли данные
    if (
      title === form.title &&
      questions.join(',') === form.questions.join(',')
    ) {
      alert('No changes detected to update.');
      return;
    }

    console.log('Attempting to update form:', updatedForm);

    try {
      await updateDoc(doc(db, 'forms', id!), updatedForm);
      console.log('Form updated:', updatedForm);
      setUpdateSuccess(true); // Показываем сообщение об успешном обновлении
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Edit Form</h2>
      {updateSuccess && (
        <Alert variant="success">Form updated successfully!</Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter form title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="questions" className="mb-3">
          <Form.Label>Questions</Form.Label>
          <div>
            {questions.map((question, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <Form.Control
                  type="text"
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="me-2"
                />
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

        <Button variant="primary" type="submit" className="mt-4 w-100">
          Update Form
        </Button>
      </Form>
    </Container>
  );
};

export default FormEdit;
