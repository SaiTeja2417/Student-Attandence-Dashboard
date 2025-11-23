import { Button } from "@mui/material";

const PrimaryButton = ({ sx = {}, children, ...props }) => {
  return (
    <>
      <Button
        sx={{
          textTransform: "capitalize",
          fontSize:"20px",
          color: "white",
          backgroundColor: '#00008b',
          width:"100%",
          "&:hover": {
            color:"white",
            
            backgroundColor: "#0000b2",
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </Button>
    </>
  );
};

export default PrimaryButton
