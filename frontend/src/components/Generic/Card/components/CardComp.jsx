import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardStyles } from '../styles/CardStyles';
import { useTheme } from '../../../../shared/contexts/ThemeContext';

const CardComp = ({ 
  title, 
  icon, 
  value, 
  variant, 
  children, 
  className = '',
  centerContent = false
}) => {
  const { isDarkMode } = useTheme();

  return (
    <CardStyles.StyledCard $isDarkMode={isDarkMode} className={className}>
      <BootstrapCard.Body className={centerContent ? "text-center" : ""}>
        {icon && (
          <CardStyles.IconWrapper>
            <FontAwesomeIcon icon={icon} />
          </CardStyles.IconWrapper>
        )}
        {title && <BootstrapCard.Title>{title}</BootstrapCard.Title>}
        {value && (
          <BootstrapCard.Text className={`h3 ${variant ? `text-${variant}` : ''}`}>
            {value}
          </BootstrapCard.Text>
        )}
        {children}
      </BootstrapCard.Body>
    </CardStyles.StyledCard>
  );
};

export default CardComp; 