import { Container, Card } from 'react-bootstrap';
import useAuthForm from '../../hooks/useAuthForm';
import InputField from '../InputField/InputField';
import LoadingButton from '../loadingButton/LoadingButton';
import Notification from '../notification/Notification';
import useNotification from '../../hooks/useNotification';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isRegister,
    toggleMode,
    handleSubmit,
    error,
    loading,
  } = useAuthForm();

  const { message, variant, showNotification, clearNotification } =
    useNotification();

  const navigate = useNavigate();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearNotification();

    try {
      await handleSubmit(e);
      showNotification(
        isRegister ? 'Registration successful!' : 'Login successful!',
        'success'
      );
      navigate('/dashboard'); // Перенаправление на личную страницу
    } catch (error) {
      showNotification('Authentication error. Please try again.', 'danger');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <Card className="p-4 mx-auto">
          <h2 className="text-center mb-4">
            {isRegister ? 'Register' : 'Login'}
          </h2>
          {error && <Notification message={error} variant="danger" />}
          {message && <Notification message={message} variant={variant} />}
          <form onSubmit={handleFormSubmit}>
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              controlId="email"
            />
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              controlId="password"
            />
            <LoadingButton
              isLoading={loading}
              text={isRegister ? 'Register' : 'Login'}
              type="submit"
            />
          </form>
          <LoadingButton
            isLoading={false}
            text={
              isRegister
                ? 'Already have an account? Login'
                : "Don't have an account? Register"
            }
            onClick={toggleMode}
            variant="link"
          />
        </Card>
      </div>
    </Container>
  );
};

export default Authentication;
