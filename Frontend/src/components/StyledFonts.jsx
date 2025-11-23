import { styled, Typography } from "@mui/material";


export const Font20=({sx={},children,...props})=>{
    return (
        <>
        <Typography sx={{color:"white",fontWeight:600,fontSize:"20px",...sx}} {...props}>
            {children}
        </Typography>
        </>
    )
}
export const Font19 =styled(Typography)({
    fontSize : "19rem",
    fontWeight : 700,
    color : "white"
})
export const Font18 = styled(Typography)({
  fontSize: "18rem",
  fontWeight:600,
    color:"white"
});

export const Font14 = styled(Typography)({
  fontSize: "14rem"
});

export const Font16 = styled(Typography)({
  fontSize:"16rem",
  fontWeight:600,
  // color:"#484d54"
})

export const Font12 = styled(Typography)({
  fontSize:"12rem",
  // fontWeight:600,
  // color:"#484d54"
})

export const Font13 = styled(Typography)({
  fontSize: "13rem",
  color : "white",
  fontWeight : 300
});

export const Font22 = styled(Typography)({
    fontSize: "22rem",
    fontWeight : "bold"
  });
