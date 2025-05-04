
import { useAppSelector } from './useAppSelector';

export const useSession = () => {
  const session = useAppSelector((state) => state.session);
  return {
    token: session.token,
    employee: session.employee,
  };
};
