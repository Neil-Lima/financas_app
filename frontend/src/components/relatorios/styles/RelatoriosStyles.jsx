import styled from 'styled-components';
import { Box, Card } from '@mui/material';

export const StyledCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.borderSecondary};
  background-color: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.textPrimary};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: ${({ theme }) => theme.transitions.slow};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
  }
`;

export const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
`;
