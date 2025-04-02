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
import { useTheme } from "../../../../shared/contexts/ThemeContext";
import { SidebarStyles } from "../styles/SidebarStyles";
import { SidebarUtils } from "../utils/SidebarUtils";

const SidebarComp = () => {
  const { isDarkMode } = useTheme();
  const { 
    userName, 
    openDropdown, 
    isOpen, 
    toggleDropdown, 
    toggleSidebar, 
    closeSidebar 
  } = SidebarUtils.useSidebarLogic();

  return (
    <>
      <SidebarStyles.ToggleButton onClick={toggleSidebar} isDarkMode={isDarkMode}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </SidebarStyles.ToggleButton>
      <SidebarStyles.Sidebar isDarkMode={isDarkMode} isOpen={isOpen}>
        <Card bg="transparent" text="white" className="border-0 mb-4">
          <Card.Body className="text-center">
            <FontAwesomeIcon icon={faUser} size="3x" className="mb-3" />
            <Card.Title>{userName || "Usuário"}</Card.Title>
          </Card.Body>
        </Card>
        <Nav className="flex-column">
          <SidebarStyles.SidebarLink
            href="/home"
            isDarkMode={isDarkMode}
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faHome} className="fa-icon" />
            Início
          </SidebarStyles.SidebarLink>

          <SidebarStyles.SidebarDropdown
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
          </SidebarStyles.SidebarDropdown>
          <SidebarStyles.DropdownContent
            in={openDropdown === "finances"}
            isDarkMode={isDarkMode}
          >
            <Nav className="flex-column">
              <SidebarStyles.SidebarLink
                href="/transacoes"
                isDarkMode={isDarkMode}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faWallet} className="fa-icon" />
                Transações
              </SidebarStyles.SidebarLink>
              <SidebarStyles.SidebarLink
                href="/orcamentos"
                isDarkMode={isDarkMode}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faChartPie} className="fa-icon" />
                Orçamentos
              </SidebarStyles.SidebarLink>
              <SidebarStyles.SidebarLink
                href="/despesas"
                isDarkMode={isDarkMode}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="fa-icon" />
                Despesas
              </SidebarStyles.SidebarLink>
            </Nav>
          </SidebarStyles.DropdownContent>

          <SidebarStyles.SidebarDropdown
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
          </SidebarStyles.SidebarDropdown>
          <SidebarStyles.DropdownContent
            in={openDropdown === "debts"}
            isDarkMode={isDarkMode}
          >
            <Nav className="flex-column">
              <SidebarStyles.SidebarLink
                href="/contas"
                isDarkMode={isDarkMode}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon
                  icon={faFileInvoiceDollar}
                  className="fa-icon"
                />
                Contas a Pagar
              </SidebarStyles.SidebarLink>
              <SidebarStyles.SidebarLink
                href="/parcelamentos"
                isDarkMode={isDarkMode}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faCreditCard} className="fa-icon" />
                Parcelamentos
              </SidebarStyles.SidebarLink>
              <SidebarStyles.SidebarLink
                href="/financiamentos"
                isDarkMode={isDarkMode}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faHandHoldingUsd} className="fa-icon" />
                Financiamentos
              </SidebarStyles.SidebarLink>
            </Nav>
          </SidebarStyles.DropdownContent>

          <SidebarStyles.SidebarLink
            href="/estoque"
            isDarkMode={isDarkMode}
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faCog} className="fa-icon" />
            Estoque
          </SidebarStyles.SidebarLink>
          <SidebarStyles.SidebarLink
            href="/metas"
            isDarkMode={isDarkMode}
            onClick={closeSidebar}
          >
            <FontAwesomeIcon icon={faChartPie} className="fa-icon" />
            Metas
          </SidebarStyles.SidebarLink>
        </Nav>
      </SidebarStyles.Sidebar>
    </>
  );
};

export default SidebarComp; 