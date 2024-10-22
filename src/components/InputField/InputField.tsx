import { Form } from 'react-bootstrap';
import { InputFieldProps } from '../../models/InputFieldProps';

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  controlId,
}) => (
  <Form.Group className="mb-3" controlId={controlId}>
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
    />
  </Form.Group>
);

export default InputField;
