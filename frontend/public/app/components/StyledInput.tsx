import { InputBase } from "@mui/material";
import { InputBaseProps } from "@mui/material/InputBase/InputBase";

export default function StyledInput(props: InputBaseProps) {
  return (
    <InputBase
      {...props}
      sx={{
        flex: 1,
        paddingY: 1,
        paddingX: 2,
        bgcolor: "#ffffff",
        borderRadius: "4px",
        color: "#496CC6",
        boxShadow: "0px 0px 7px #638EFF",
        ...props.sx,
      }}
    />
  );
}
