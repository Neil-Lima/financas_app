import styled from 'styled-components';
import { Box, Button, Card, Table, Dialog } from '@mui/material';

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

export const StyledTable = styled(Table)`
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ResponsiveButton = styled(Button)`
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
`;

export const StyledModal = styled(Dialog)``;
