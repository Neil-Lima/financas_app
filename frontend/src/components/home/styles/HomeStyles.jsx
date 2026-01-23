import styled from 'styled-components';
import DatePicker from 'react-datepicker';

export const StyledContainer = styled.div`
  box-sizing: border-box;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  overflow-x: hidden;

  @media (max-width: 600px) {
    padding: 12px;
  }
`;

export const IconWrapper = styled.div`
  font-size: 2rem;
  margin-bottom: 15px;
`;

export const ChartContainer = styled.div`
  width: 100%;
  min-width: 0;
  height: 300px;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    height: 240px;
    margin-bottom: 16px;
  }
`;

export const StyledDatePicker = styled(DatePicker)`
  .react-datepicker-wrapper {
    width: auto;
  }

  @media (max-width: 600px) {
    .react-datepicker-wrapper {
      width: 100%;
    }
  }

  input {
    width: 160px;
    padding: 10px 12px;
    border-radius: ${({ theme }) => theme.borderRadius.md}px;
    border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
    background: ${({ theme }) => theme.colors.bgSecondary};
    color: ${({ theme }) => theme.colors.textPrimary};
    outline: none;
    transition: ${({ theme }) => theme.transitions.normal};
  }

  @media (max-width: 600px) {
    input {
      width: 100%;
    }
  }

  input:focus {
    border-color: ${({ theme }) => theme.colors.borderFocus};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.borderFocus};
  }
`;
