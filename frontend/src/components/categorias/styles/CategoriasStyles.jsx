import styled from 'styled-components';
import { Box, Card, Table, Button, Dialog, Grid } from '@mui/material';

export const StyledContainer = styled(Box)`
  padding: 20px;
`;

export const StyledCard = styled(Card)`
  border: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const StyledTable = styled(Table)`
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export const ResponsiveButton = styled(Button)`
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    margin: 0.2rem;
  }
`;

export const StyledModal = styled(Dialog)``;

export const ResponsiveCol = styled(Grid)`
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

export const ResponsiveForm = styled(Box)`
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;
