import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getServerSession } from 'next-auth';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';


// Define the type for your authOptions, adjust if needed
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  // Your authOptions configuration here...
};

/**
 * Middleware function for checking authentication on the server-side.
 * It checks if the user is authenticated and redirects if not.
 */
export async function loginIsRequiredServer(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

/**
 * Middleware function for checking authentication on the client-side.
 * It checks if the user is authenticated and pushes a route if not.
 */
export function loginIsRequiredClient(): void {
  const session = useSession();
  const router = useRouter();

  if (!session) {
    router.push('/');
  }
}
