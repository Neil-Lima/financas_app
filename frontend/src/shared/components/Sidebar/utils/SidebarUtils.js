import { useState, useEffect } from 'react';

const useSidebarLogic = () => {
  const [openDropdown, setOpenDropdown] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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

  return {
    userName,
    openDropdown,
    isOpen,
    toggleDropdown,
    toggleSidebar,
    closeSidebar
  };
};

export const SidebarUtils = {
  useSidebarLogic
}; 