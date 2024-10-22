import { Table, Button } from 'react-bootstrap';

const TemplatesTable = () => {
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
        <tr>
          <td>Sample Template</td>
          <td>This is a sample template description</td>
          <td>
            <Button variant="primary" size="sm" className="me-2">
              Edit
            </Button>
            <Button variant="danger" size="sm">
              Delete
            </Button>
          </td>
        </tr>
        {/* Динамически добавляйте строки таблицы здесь */}
      </tbody>
    </Table>
  );
};

export default TemplatesTable;
