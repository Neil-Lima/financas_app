import { Nav, Collapse } from "react-bootstrap";
import styled from "styled-components";

const Sidebar = styled.div`
  background: ${(props) =>
    props.isDarkMode
      ? "linear-gradient(180deg, #1a1a1a 0%, #2c2c2c 100%)"
      : "linear-gradient(180deg, #153158 0%, #0a1a2e 100%)"};
  height: 100vh;
  color: white;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  overflow-y: auto;
  transition: transform 0.3s ease-in-out;
  z-index: 1000;

  @media (max-width: 768px) {
    transform: ${(props) =>
      props.isOpen ? "translateX(0)" : "translateX(-100%)"};
    width: 100%;
  }
`;

const SidebarLink = styled(Nav.Link)`
  color: #ffffff;
  padding: 10px 20px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;

  &:hover,
  &:focus {
    background-color: ${(props) =>
      props.isDarkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(255, 255, 255, 0.2)"};
    color: #ffffff;
    border-left: 3px solid
      ${(props) => (props.isDarkMode ? "#6c757d" : "#4e9af1")};
  }

  .fa-icon {
    margin-right: 10px;
    width: 20px;
  }
`;

const SidebarDropdown = styled.div`
  cursor: pointer;
  padding: 10px 20px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: ${(props) =>
      props.isDarkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(255, 255, 255, 0.2)"};
  }

  .fa-icon {
    margin-right: 10px;
    width: 20px;
  }

  .dropdown-icon {
    margin-left: 10px;
  }
`;

const DropdownContent = styled(Collapse)`
  background-color: ${(props) =>
    props.isDarkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.1)"};
  transition: all 0.5s ease-in-out;
`;

const ToggleButton = styled.button`
  display: none;
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 1001;
  background: transparent;
  border: none;
  color: ${(props) => (props.isDarkMode ? "white" : "black")};
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const SidebarStyles = {
  Sidebar,
  SidebarLink,
  SidebarDropdown,
  DropdownContent,
  ToggleButton
}; 