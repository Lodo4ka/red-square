import { useLoginMutation } from '@/enteties/User/api/login';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { PageLoader } from '@/shared/ui/page-loader';
import { ROUTES_PATH_CLIENT } from '@/shared/constants';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    await login({ name, password });
    navigate(ROUTES_PATH_CLIENT.HOME);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      <div className="space-y-2">
        <label className="block text-lg font-semibold">Имя пользователя:</label>
        <Input name="name" placeholder="введите имя пользователя" required />
      </div>
      <div className="space-y-2 mb-4">
        <label className="block text-lg font-semibold">Пароль:</label>
        <Input
          type="password"
          name="password"
          placeholder="введите пароль"
          required
        />
      </div>
      <Button
        className="w-full h-12 text-lg"
        variant="ghost"
        type="submit"
        disabled={isLoading}
      >
        Войти
      </Button>
    </form>
  );
};
