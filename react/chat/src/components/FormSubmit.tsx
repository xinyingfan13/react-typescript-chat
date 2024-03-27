import Button, { ButtonProps } from '@mui/material/Button';
import { FC, useContext } from 'react';

import { FormContext } from '@/contexts';

interface IFormSubmit extends ButtonProps {}

export const FormSubmit: FC<IFormSubmit> = ({
  fullWidth,
  color,
  children,
  sx,
  ...props
}) => {
  const formContext = useContext(FormContext);

  return (
    <Button
      color={color}
      disabled={formContext != null && formContext.isValid < 0}
      fullWidth={fullWidth}
      sx={{ my: 1, ...sx }}
      type="submit"
      {...props}
    >
      {children}
    </Button>
  );
};
