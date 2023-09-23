'use client';
import axios from 'axios';
import { redisConnect } from '../lib/redis';
import PaymentsDisplay from './payments/PaymentsDisplay';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Container,
  Flex,
  Button,
  Heading,
  Text,
  Card,
  Badge,
} from '@radix-ui/themes';
import StripeContainer from '../components/StripeContainer';
import { Navbar } from '@/components';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
  const newData = async () => {
    const { data } = await axios.post('api/redis', {
      text: 'hello',
      tags: ['TypeScript', 'CSS'],
    });
    console.log(data);
  };
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className='flex h-screen w-screen items-center'>
        <div className='w-full text-center'>
          <div className='flex flex-col gap-8'>
            <Heading>Welcome to BillBot Baggins</Heading>
            <div className='flex flex-row items-center justify-center gap-4'>
              <Button onClick={() => signIn()}>Client Login</Button>

              <Link href='/AdminLogin'>
                <Button>Admin Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <main className='class'>
        {/* <Navbar /> */}
        {/* conditionally render Payments display */}
        {/* Added "paymentsdisplay" in anticipation of component - button is in here to make API call, you can move this wherever */}
        <PaymentsDisplay />
        <StripeContainer />
 
        <>
        </>
      </main>
    </>
  );
}
