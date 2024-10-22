import { Button, Spinner } from 'react-bootstrap';
import { LoadingButtonProps } from '../../models/LoadingButtonProps';

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  text,
  onClick,
  type = 'button',
  variant = 'primary',
}) => {
  return (
    <Button
      variant={variant}
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className="w-100"
    >
      {isLoading ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : (
        text
      )}
    </Button>
  );
};

export default LoadingButton;
