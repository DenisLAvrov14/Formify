import { Alert } from 'react-bootstrap';
import { NotificationProps } from '../../models/NotificationProps';

const Notification: React.FC<NotificationProps> = ({ message, variant }) => {
  return <Alert variant={variant}>{message}</Alert>;
};

export default Notification;
