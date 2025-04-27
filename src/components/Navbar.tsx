import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";


export default function MainNavbar() {
  return (
    <Navbar>
      <NavbarBrand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Church of Christ the King</span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink href="/" active={true}>
          Home
        </NavbarLink>
        <NavbarLink href="/bookings">
          View Bookings        
        </NavbarLink>
        <NavbarLink href="/help">
          Help        
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  )
}
