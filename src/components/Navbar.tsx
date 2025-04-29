import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";


export default function MainNavbar() {
  return (
    <Navbar className="w-full p-4 sm:p-6 lg:px-8 max-w-7xl bg-gray-200">
      <NavbarBrand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Church of Christ the King</span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink href="/">
          Home
        </NavbarLink>
        <NavbarLink href="/admin">
          Admin        
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  )
}
