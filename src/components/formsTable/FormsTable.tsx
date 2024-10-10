import { Table, Button } from 'react-bootstrap';

const FormsTable = () => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Template</th>
          <th>Submission Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Sample Form</td>
          <td>2024-10-10</td>
          <td>
            <Button variant="danger" size="sm">Delete</Button>
          </td>
        </tr>
        {/* Динамически добавляйте строки таблицы здесь */}
      </tbody>
    </Table>
  );
};

export default FormsTable;
