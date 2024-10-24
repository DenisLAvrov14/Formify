import { useState } from 'react';
import { Container, Nav, Tab, Button, Row, Col } from 'react-bootstrap';
import FormsTable from '../formsTable/FormsTable';
import TemplatesTable from '../templatesTable/TemplatesTable'; // Подключаем TemplatesTable
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeKey, setActiveKey] = useState<string>('templates');
  const navigate = useNavigate();

  const handleTemplateSelect = (templateId: string) => {
    // Логика для обработки выбранного шаблона
    console.log(`Selected template ID: ${templateId}`);
    navigate(`/template-results/${templateId}`); // Переход на страницу с результатами
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Dashboard</h1>
      <Tab.Container
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k || 'templates')}
      >
        <Nav variant="tabs" className="justify-content-center mb-3">
          <Nav.Item>
            <Nav.Link eventKey="templates">My Templates</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="forms">My Forms</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="templates">
            <Row className="mb-3">
              <Col className="text-end">
                <Button
                  variant="success"
                  onClick={() => navigate('/create-template')}
                >
                  Create New Template
                </Button>
              </Col>
            </Row>
            <TemplatesTable onSelectTemplate={handleTemplateSelect} />
          </Tab.Pane>
          <Tab.Pane eventKey="forms">
            <FormsTable />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default Dashboard;
