import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { HandMetal } from 'lucide-react';
import { Session, getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';


const Navbar = async () => {
  const session = await getServerSession(authOptions)
  console.log(session)
  return (
    <div className='bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
      <div className='container flex items-cen justify-between'>
        <Link href='/'>
          <HandMetal />  </Link>
           {session ? (<Button className={buttonVariants()}>
            Sing Out
          </Button>):<Link className={buttonVariants()} href='/sign-in'>
            Sign in
          </Link>}
          
    
      </div>
    </div>
  );
};

export default Navbar;
