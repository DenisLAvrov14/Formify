import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getAuth } from 'firebase/auth';
import { Button, Container, Form, Alert } from 'react-bootstrap';

const FormAnswer = () => {
  const { id } = useParams<{ id: string }>(); // Get template ID from URL
  const [questions, setQuestions] = useState<string[]>([]); // Questions from template
  const [answers, setAnswers] = useState<string[]>([]); // User's answers
  const [error, setError] = useState<string | null>(null); // Error handling
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, 'templates', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const templateData = docSnap.data();
          console.log('Template data:', templateData); // Log template data
          setQuestions(templateData.questions || []); // Set template questions
        } else {
          console.error('Template not found');
        }
      } catch (error) {
        console.error('Error fetching template:', error);
        setError('Error fetching template.');
      }
    };

    fetchTemplate();
  }, [id]);

  // Handle answer change
  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError('Please log in to submit answers.');
      return;
    }

    // Check if all questions are answered
    if (answers.length !== questions.length || answers.some(answer => !answer)) {
      setError('Please fill out all fields.');
      return;
    }

    const formAnswerData = {
      templateId: id, // Reference to the template
      userId: user.uid,
      answers,
      submittedAt: new Date(),
    };

    try {
      // Save the user's answers in the form_answers collection
      await addDoc(collection(db, 'form_answers'), formAnswerData);
      alert('Your answers have been submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting answers:', error);
      setError('Error submitting answers.');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Fill Out Form</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <Form.Group
              controlId={`question-${index}`}
              key={index}
              className="mb-3"
            >
              <Form.Label>{question}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your answer"
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            </Form.Group>
          ))
        ) : (
          <p>Loading questions...</p>
        )}
        <Button variant="primary" type="submit">
          Submit Answers
        </Button>
      </Form>
    </Container>
  );
};

export default FormAnswer;
