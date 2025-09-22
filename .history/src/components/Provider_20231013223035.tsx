import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'
interface Providerprops{
    children : ReactNode
}

const Provider: FC<Providerprops> = ({children}) => {
  return <SessionProvider></SessionProvider>
}

export default Provider