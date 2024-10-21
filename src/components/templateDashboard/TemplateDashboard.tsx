import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Table } from 'react-bootstrap';
import { getTemplates, deleteTemplate } from '../services/templateService';
import { Template } from '../../models/Template';

const TemplateDashboard = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      const fetchedTemplates: Template[] = await getTemplates();
      setTemplates(fetchedTemplates);
    };

    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteTemplate(id);
    setTemplates(templates.filter((template) => template.id !== id));
  };

  return (
    <Container>
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
                  onClick={() => navigate(`/edit-template/${template.id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(template.id)}
                  className="ms-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TemplateDashboard;
