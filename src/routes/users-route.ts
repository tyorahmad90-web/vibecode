import { Elysia, t } from 'elysia';
import { registerUserService } from '../services/users-services';

export const usersRoute = new Elysia({ prefix: '/api/users' })
  .post(
    '/',
    async ({ body, set }) => {
      const result = await registerUserService(body);

      if (result.error) {
        set.status = 400;
        return { error: result.error };
      }

      return { data: result.data };
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        password: t.String(),
      }),
    }
  );
