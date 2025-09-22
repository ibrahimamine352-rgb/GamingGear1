
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { HandMetal } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const Navbar = async (props:any) => {
const session = props.session

  return (
    <div className=' bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
      <div className='container flex items-center justify-between'>
        <Link href='/'>
          <HandMetal />
        </Link>
        {session ? (
          <>{session.username}</>
        ) : <Link className={buttonVariants()} href='/sign-in'>
        Sign in
      </Link>}
      
      </div>
    </div>
  );
};

export default Navbar;
