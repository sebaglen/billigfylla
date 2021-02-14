import { ButtonProps, Button } from '@chakra-ui/react';

interface ToggleTokenProps extends ButtonProps {
  title: string;
  isToggled: boolean;
  onToggle: (isToggled: boolean) => void;
}

const toggleToken = ({
  title,
  isToggled,
  onToggle,
  ...rest
}: ToggleTokenProps) => {
  function toggle() {
    onToggle(!isToggled);
  }
  return (
    <Button
      onClick={toggle}
      size="sm"
      borderRadius="25px"
      variant={isToggled ? 'toggled' : 'notToggled'}
      {...rest}
    >
      {title}
    </Button>
  );
};

export default toggleToken;
