import { useState, useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createTemplate,
  updateTemplate,
  getTemplateById,
} from '../services/templateService';
import { Template } from '../../models/Template';

const TemplateForm = () => {
  const { id } = useParams(); // Получаем ID из URL
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null); // Хранение шаблона для редактирования
  const navigate = useNavigate();

  // Загружаем данные шаблона по ID при монтировании компонента
  useEffect(() => {
    const loadTemplate = async () => {
      if (id) {
        setLoading(true); // Начало загрузки
        const fetchedTemplate = await getTemplateById(id);
        if (fetchedTemplate) {
          setTemplate(fetchedTemplate);
          setTitle(fetchedTemplate.title);
          setDescription(fetchedTemplate.description);
          setQuestions(fetchedTemplate.questions);
        }
        setLoading(false); // Окончание загрузки
      }
    };
    loadTemplate();
  }, [id]);

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
    setLoading(true); // Устанавливаем состояние загрузки
    const newTemplate: Template = { title, description, questions };

    try {
      if (template) {
        // Обновление существующего шаблона
        await updateTemplate(template.id, newTemplate);
      } else {
        // Создание нового шаблона
        await createTemplate(newTemplate);
      }
      setLoading(false);
      navigate('/templates'); // Переход на страницу списка шаблонов
    } catch (error) {
      setLoading(false);
      console.error('Error saving template:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Можно добавить индикатор загрузки
  }

  return (
    <Container>
      <h2>{template ? 'Edit Template' : 'Create Template'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="description" className="mt-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="questions" className="mt-3">
          <Form.Label>Questions</Form.Label>
          <div>
            {questions.map((question, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center"
              >
                <span>{question}</span>
                <Button
                  variant="danger"
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
          {loading
            ? 'Processing...'
            : template
              ? 'Update Template'
              : 'Create Template'}
        </Button>
      </Form>
    </Container>
  );
};

export default TemplateForm;
