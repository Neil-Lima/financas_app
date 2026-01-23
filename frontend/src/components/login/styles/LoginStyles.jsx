import styled from 'styled-components';
import { Box, Button, Card, Dialog, TextField } from '@mui/material';

export const StyledContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
`;

export const StyledCard = styled(Card)`
  width: 400px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
`;

export const StyledForm = styled(Box)`
  padding: 20px;
`;

export const StyledInput = styled(TextField)`
  border-radius: 20px;
  padding-left: 40px;
`;

export const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 15px;
  transform: translateY(-50%);
  color: #6c757d;
`;

export const StyledButton = styled(Button)`
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: bold;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  border: none;

  &:hover {
    background: linear-gradient(135deg, #a777e3, #6e8efb);
  }
`;

export const StyledModal = styled(Dialog)``;
