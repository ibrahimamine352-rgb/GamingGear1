import React from 'react';
import withAuth from "../../../../middleware";
import RootLayout from '@/app/layout';

const Page = () => {
  return (
    <RootLayout>
      <div>page</div>
    </RootLayout>
  );
}

export default withAuth(Page);
