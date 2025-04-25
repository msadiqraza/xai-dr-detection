// src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
// Removed Grid import
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Fade from "@mui/material/Fade";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider"; // Import Divider

// Ensure this image exists in your /public folder
const placeholderImageUrl = "/eye_logo.webp"; // Or your chosen image

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    // ... (keep existing submit logic)
    event.preventDefault();
    setError(null);
    setLoading(true);
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }
    try {
      const success = await auth.login(email, password);
      if (success) {
        navigate("/");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = () => {
    console.log("Navigate to Sign Up page (not implemented yet)");
    // Optional: navigate('/signup'); // You would need to define this route
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Container component="main" maxWidth={false} sx={{ height: "100vh", p: 0 }}>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {/* Image Box */}
        <Box
          sx={{
            width: { xs: "100%", sm: "45%", md: "60%" },
            display: { xs: "none", sm: "block" },
            height: { xs: "30%", sm: "100%" },
            backgroundImage: `url(${placeholderImageUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[100]
                : t.palette.grey[900],
          }}
        />

        {/* Form Box */}
        <Box
          component={Paper}
          elevation={6}
          square
          sx={{
            width: { xs: "100%", sm: "55%", md: "40%" },
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflowY: "auto",
          }}
        >
          <Fade in={animate} timeout={1000}>
            <Box
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                maxWidth: 400,
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                {" "}
                <LockOutlinedIcon />{" "}
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
                {" "}
                Sign In{" "}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {" "}
                Welcome back! Please enter your credentials.{" "}
              </Typography>

              {/* Form */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ width: "100%" }}
              >
                <Tooltip title="Enter your registered email address">
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </Tooltip>
                <Tooltip title="Enter your password">
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {" "}
                          <Tooltip
                            title={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {" "}
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              disabled={loading}
                            >
                              {" "}
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}{" "}
                            </IconButton>{" "}
                          </Tooltip>{" "}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Tooltip>
                {error && (
                  <Alert severity="error" sx={{ width: "100%", mt: 2, mb: 1 }}>
                    {" "}
                    {error}{" "}
                  </Alert>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.2 }}
                  disabled={loading}
                >
                  {" "}
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}{" "}
                </Button>

                {/* === Sign Up Button Section === */}
                <Divider sx={{ my: 2 }}>
                  {" "}
                  {/* Optional Divider */}
                  <Typography variant="caption">New Here?</Typography>
                </Divider>
                <Button
                  fullWidth
                  variant="text" // Use text variant for less emphasis
                  onClick={handleSignUpClick}
                  sx={{ mt: 1, mb: 2 }}
                  disabled={loading} // Disable if login is in progress
                >
                  Create an Account (Sign Up)
                </Button>
                {/* ============================== */}
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 3 }}
              >
                {" "}
                {/* Reduced margin */}© {new Date().getFullYear()} Your Company
                Name
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
