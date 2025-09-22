import React from 'react'
import TeamSwitcher from './team-switcher'
import { MainNav } from '../main-nav'
import { Search } from './search'
import { UserNav } from './user-nav'

function AdminNavbar() {
  return (
    <div><div className="border-b">
    <div className="flex h-16 items-center px-4">
      <TeamSwitcher />
      <MainNav  />
      <div className="ml-auto flex items-center space-x-4">
        <Search />
        <UserNav />
      </div>
    </div>
  </div></div>
  )
}

export default AdminNavbar