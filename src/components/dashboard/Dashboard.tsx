import { useState } from 'react';
import { Container, Nav, Tab } from 'react-bootstrap';
import TemplatesTable from '../templatesTable/TemplatesTable';
import FormsTable from '../formsTable/FormsTable';

const Dashboard = () => {
  const [activeKey, setActiveKey] = useState<string>('templates');

  return (
    <Container className="mt-4">
      <h1 className="text-center">Dashboard</h1>
      <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k || 'templates')}>
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
            <TemplatesTable />
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
