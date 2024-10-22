export interface LoadingButtonProps {
  isLoading: boolean;
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: string;
}
