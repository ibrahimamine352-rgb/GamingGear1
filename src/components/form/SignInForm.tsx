'use client';

import { useForm } from 'react-hook-form';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '../ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import GoogleSignInButton from '../custom/GoogleSignInButton';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must have more than 8 characters'),
});

type Props = { asModal?: boolean; onSwitch?: () => void; onSuccess?: () => void }
const SignInForm = ({ asModal = false, onSwitch, onSuccess }: Props) => {

  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (signInData?.ok === true) {
      if (asModal && onSuccess) {
        onSuccess();           // closes modal in Header
      } else {
        router.refresh();
        router.push('/');      // absolute home
      }
    } else {
      console.log(signInData?.error);
    }
  };

  const Body = (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-4">
            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mail@example.com"
                      {...field}
                      className="bg-[hsl(var(--card)/0.40)] text-foreground placeholder-muted-foreground border border-border focus:border-[hsl(var(--accent))] focus-visible:ring-0 outline-none"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            {/* PASSWORD */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="bg-[hsl(var(--card)/0.40)] text-foreground placeholder-muted-foreground border border-border focus:border-[hsl(var(--accent))] focus-visible:ring-0 outline-none"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>
  
          <Button className="w-full mt-6 rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-black font-semibold hover:shadow-[0_0_20px_rgba(56,189,248,0.35)]" type="submit">
            Sign in
          </Button>
        </form>
      </Form>
  
      <div className="mx-auto my-4 flex w-full items-center justify-evenly text-muted-foreground before:mr-4 before:block before:h-px before:flex-grow before:bg-border after:ml-4 after:block after:h-px after:flex-grow after:bg-border">
        or
      </div>
  
      <GoogleSignInButton>Sign in with Google</GoogleSignInButton>
  
      <p className="text-center text-sm text-muted-foreground mt-2">
        If you Don&apos;t have an account, please{" "}
        {onSwitch ? (
          <button type="button" onClick={onSwitch} className="text-[hsl(var(--accent))] underline underline-offset-4">
            Sign up
          </button>
        ) : (
          <Link className="text-[hsl(var(--accent))] underline underline-offset-4" href="/sign-up">
            Sign up
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

export default SignInForm;
