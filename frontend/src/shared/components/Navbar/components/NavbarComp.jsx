import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCommentDots, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../../../shared/contexts/ThemeContext';
import { NavbarStyles } from '../styles/NavbarStyles';

const NavbarComp = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <NavbarStyles.StyledNavbar bg={isDarkMode ? 'dark' : 'light'} variant={isDarkMode ? 'dark' : 'light'} expand="lg" className="mb-4 shadow-sm">
      <Navbar.Brand href="#home"></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link"><FontAwesomeIcon icon={faBell} /></Nav.Link>
          <Nav.Link href="#link"><FontAwesomeIcon icon={faCommentDots} /></Nav.Link>
          <Button variant="link" onClick={toggleTheme}>
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </Button>
        </Nav>
      </Navbar.Collapse>
    </NavbarStyles.StyledNavbar>
  );
};

export default NavbarComp; 