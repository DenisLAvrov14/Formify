import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Template } from '../../models/Template';
import { getTemplates } from '../services/templateService'; // Пример импорта для получения списка шаблонов
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

const TemplatesTable: React.FC<{
  onSelectTemplate: (templateId: string) => void;
}> = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const fetchedTemplates = await getTemplates(); // Пример вызова сервиса для получения данных
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteDoc(doc(db, 'templates', templateId)); // Удаляем шаблон из Firestore
        setTemplates(
          templates.filter((template) => template.id !== templateId)
        ); // Обновляем состояние
        console.log('Template deleted:', templateId);
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {templates.map((template) => (
          <tr key={template.id}>
            <td>{template.title}</td>
            <td>{template.description}</td>
            <td>
                <Button
                variant="primary"
                onClick={() => onSelectTemplate(template.id)}
              >
                View Results
              </Button>
              <Button
                variant="secondary"
                className="ms-2"
                onClick={() => navigate(`/edit-template/${template.id}`)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                className="ms-2"
                onClick={() => handleDelete(template.id)}
              >
                Delete
              </Button>
              <Button
                variant="success"
                className="ms-2"
                onClick={() => navigate(`/fill-form/${template.id}`)}
              >
                Fill Out Form
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TemplatesTable;
