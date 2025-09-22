import { SessionProvider } from 'next-auth/react'
import React, { FC, ReactNode } from 'react'
interface Providerprops{
    children : ReactNode
}

const Provider: FC<Providerprops> = ({children}) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default Provider