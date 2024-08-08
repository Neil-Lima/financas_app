import React, { useState, useEffect } from "react";
import { Card, Nav, Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faWallet,
  faChartPie,
  faUser,
  faCog,
  faHistory,
  faCalendarAlt,
  faFileInvoiceDollar,
  faCreditCard,
  faHandHoldingUsd,
  faExclamationTriangle,
  faAngleDown,
  faAngleUp,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useTheme } from "../context/ThemeContext";

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

const SidebarComp = () => {
  const [openDropdown, setOpenDropdown] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.nome) {
          setUserName(user.nome);
        }
      } catch (error) {
        console.error("Erro ao analisar dados do usuário:", error);
      }
    }
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? "" : name);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ToggleButton onClick={toggleSidebar} isDarkMode={isDarkMode}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </ToggleButton>
      <Sidebar isDarkMode={isDarkMode} isOpen={isOpen}>
        <Card bg="transparent" text="white" className="border-0 mb-4">
          <Card.Body className="text-center">
            <FontAwesomeIcon icon={faUser} size="3x" className="mb-3" />
            <Card.Title>{userName || "Usuário"}</Card.Title>
          </Card.Body>
        </Card>
        <Nav className="flex-column">
          <SidebarLink
            href="/home"
            isDarkMode={isDarkMode}
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faHome} className="fa-icon" />
            Início
          </SidebarLink>

          <SidebarDropdown
            onClick={() => toggleDropdown("finances")}
            isDarkMode={isDarkMode}
          >
            <div>
              <FontAwesomeIcon icon={faWallet} className="fa-icon" />
              Finanças
            </div>
            <FontAwesomeIcon
              icon={openDropdown === "finances" ? faAngleUp : faAngleDown}
              className="dropdown-icon"
            />
          </SidebarDropdown>
          <DropdownContent
            in={openDropdown === "finances"}
            isDarkMode={isDarkMode}
          >
            <Nav className="flex-column">
              <SidebarLink
                href="/transacoes"
                isDarkMode={isDarkMode}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faWallet} className="fa-icon" />
                Transações
              </SidebarLink>
              <SidebarLink
                href="/orcamentos"
                isDarkMode={isDarkMode}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faChartPie} className="fa-icon" />
                Orçamentos
              </SidebarLink>
              <SidebarLink
                href="/despesas"
                isDarkMode={isDarkMode}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="fa-icon" />
                Despesas
              </SidebarLink>
            </Nav>
          </DropdownContent>

          <SidebarDropdown
            onClick={() => toggleDropdown("debts")}
            isDarkMode={isDarkMode}
          >
            <div>
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="fa-icon"
              />
              Dívidas e Pagamentos
            </div>
            <FontAwesomeIcon
              icon={openDropdown === "debts" ? faAngleUp : faAngleDown}
              className="dropdown-icon"
            />
          </SidebarDropdown>
          <DropdownContent
            in={openDropdown === "debts"}
            isDarkMode={isDarkMode}
          >
            <Nav className="flex-column">
              <SidebarLink
                href="/contas"
                isDarkMode={isDarkMode}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon
                  icon={faFileInvoiceDollar}
                  className="fa-icon"
                />
                Contas a Pagar
              </SidebarLink>
              <SidebarLink
                href="/parcelamentos"
                isDarkMode={isDarkMode}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faCreditCard} className="fa-icon" />
                Parcelamentos
              </SidebarLink>
              <SidebarLink
                href="/financiamentos"
                isDarkMode={isDarkMode}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faHandHoldingUsd} className="fa-icon" />
                Financiamentos
              </SidebarLink>
            </Nav>
          </DropdownContent>

          <SidebarLink
            href="/estoque"
            isDarkMode={isDarkMode}
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faCog} className="fa-icon" />
            Estoque
          </SidebarLink>
          <SidebarLink
            href="/metas"
            isDarkMode={isDarkMode}
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faChartPie} className="fa-icon" />
            Metas
          </SidebarLink>
        </Nav>
      </Sidebar>
    </>
  );
};

export default SidebarComp;
