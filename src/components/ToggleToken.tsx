import { useState } from "react";
import { ButtonProps, Button } from "@chakra-ui/react";

interface ToggleTokenProps extends ButtonProps {
    title: string;
}

const toggleToken = ({ title, ...rest }: ToggleTokenProps) => {
    const [showMe, setShowMe] = useState(false);
    function toggle(){
      setShowMe(!showMe);
    }
    return <Button onClick={toggle} size="sm" borderRadius="25px" variant={showMe ? "toggled" : "notToggled"} {...rest}>{title}</Button>
}

export default toggleToken;