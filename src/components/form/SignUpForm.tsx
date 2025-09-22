'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import GoogleSignInButton from '../custom/GoogleSignInButton';
import { useRouter } from 'next/navigation';

const FormSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match',
  });

  type Props = { asModal?: boolean; onSwitch?: () => void; onSuccess?: () => void }
  const SignUpForm = ({ asModal = false, onSwitch, onSuccess}: Props) => {
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch('api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
      }),
    });
    if (response.ok) {
      if (asModal && onSuccess) {
        onSuccess();           // Header can switch to signin or just close
      } else {
      router.push('/sign-in');
    }
    } else {
      console.error('Registration failed');
    }
  };

  const Body = (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-4">
            {/* username / email / password / confirmPassword — keep same fields, just token classes */}
            {/* USERNAME */}
            <FormField control={form.control} name="username" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="johndoe"
                    className="bg-[hsl(var(--card)/0.40)] text-foreground placeholder-muted-foreground border border-border focus:border-[hsl(var(--accent))] focus-visible:ring-0 outline-none" />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}/>
            {/* EMAIL */}
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="mail@example.com"
                    className="bg-[hsl(var(--card)/0.40)] text-foreground placeholder-muted-foreground border border-border focus:border-[hsl(var(--accent))] focus-visible:ring-0 outline-none" />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}/>
            {/* PASSWORD */}
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="Enter your password"
                    className="bg-[hsl(var(--card)/0.40)] text-foreground placeholder-muted-foreground border border-border focus:border-[hsl(var(--accent))] focus-visible:ring-0 outline-none" />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}/>
            {/* CONFIRM */}
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Re-Enter your password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} placeholder="Re-Enter your password"
                    className="bg-[hsl(var(--card)/0.40)] text-foreground placeholder-muted-foreground border border-border focus:border-[hsl(var(--accent))] focus-visible:ring-0 outline-none" />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}/>
          </div>
  
          <Button className="w-full mt-6 rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-black font-semibold hover:shadow-[0_0_20px_rgba(56,189,248,0.35)]" type="submit">
            Sign up
          </Button>
        </form>
      </Form>
  
      <div className="mx-auto my-4 flex w-full items-center justify-evenly text-muted-foreground before:mr-4 before:block before:h-px before:flex-grow before:bg-border after:ml-4 after:block after:h-px after:flex-grow after:bg-border">
        or
      </div>
  
      <GoogleSignInButton>Sign up with Google</GoogleSignInButton>
  
      <p className="text-center text-sm text-muted-foreground mt-2">
        Already have an account?{" "}
        {onSwitch ? (
          <button type="button" onClick={onSwitch} className="text-[hsl(var(--accent))] underline underline-offset-4">
            Sign in
          </button>
        ) : (
          <Link className="text-[hsl(var(--accent))] underline underline-offset-4" href="/sign-in">
            Sign in
          </Link>
        )}
      </p>
    </>
  )
  
  return asModal ? (
    <div className="w-full max-w-md">{Body}</div>
  ) : (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-card/60 backdrop-blur-md p-8 border border-border">
        {Body}
      </div>
    </main>
  );
};

export default SignUpForm;
