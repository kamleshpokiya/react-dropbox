import { Box, Typography, useTheme } from "@mui/material";
import Form from "./Form";

const Auth = () => {
    const theme = useTheme();
    return (
        <Box>
            <Box
                width="100%"
                backgroundColor={theme.palette.background.alt}
                p="1rem 0"
                textAlign="center"
            >
                <Typography fontWeight="bold" fontSize="32px" color="primary">
                    Dropbox
                </Typography>
            </Box>

            <Box
                width="30%"
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
            >
                <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
                    Welcome to Dropbox, App for file management!
                </Typography>
                <Form />
            </Box>
        </Box>
    );
};

export default Auth;