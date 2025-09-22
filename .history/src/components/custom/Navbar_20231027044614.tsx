
import Link from 'next/link';
import { Button, buttonVariants } from '../ui/button';
import { HandMetal } from 'lucide-react';
import { Session, getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { signOut } from 'next-auth/react';
import UserAccountNav from './UserAccountNav';


const Navbar = async () => {
  const session =  await getServerSession(authOptions)
console.log(session)
  return (
   <>
   {session?.user.role==="admin" ? (<Link href={"/admin"}><Button >Admin Panel</Button></Link>):<></>}
           {session ? (<UserAccountNav/>):<Link className={buttonVariants()} href='/sign-in'>
            Sign in
          </Link>}</>
  );
};

export default Navbar;
