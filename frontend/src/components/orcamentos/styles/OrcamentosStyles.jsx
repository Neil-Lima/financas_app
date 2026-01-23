import styled from 'styled-components';
import { Box, Button, Card, Grid, Table, Dialog } from '@mui/material';

export const StyledContainer = styled(Box)`
  padding: 20px;
`;

export const StyledCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.borderSecondary};
  background-color: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: ${({ theme }) => theme.transitions.slow};
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
  }
`;

export const ChartContainer = styled.div`
  height: 300px;
  width: 100%;

  @media (max-width: 768px) {
    height: 200px;
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

export const StyledModal = styled(Dialog)`
  .modal-content {
    background-color: ${({ theme }) => theme.colors.bgSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;
