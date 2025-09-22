import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { HandMetal } from 'lucide-react';
import { Session } from 'next-auth';


const Navbar = async () => {
  return (
    <div className='bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
      <div className='container flex items-cen justify-between'>
        <Link href='/'>
          <HandMetal />  </Link>
      
          <Link className={buttonVariants()} href='/sign-in'>
            Sign in
          </Link>
    
      </div>
    </div>
  );
};

export default Navbar;
