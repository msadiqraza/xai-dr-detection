// src/pages/LoginPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Fade from "@mui/material/Fade";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";

// Ensure this image exists in your /public folder
const placeholderImageUrl = "/eye_logo.webp"; // Or your chosen image

const LoginPage: React.FC = () => {
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // UI state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 for login, 1 for signup
  const [signupSuccessOpen, setSignupSuccessOpen] = useState(false); // For signup success dialog
  
  // Hooks
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setError(null); // Clear any errors when switching tabs
    setTabValue(newValue);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }
    
    try {
      // For login tab
      if (tabValue === 0) {
        const { success, error } = await auth.login(email, password);
        if (success) {
          navigate("/");
        } else {
          setError(error || "Invalid email or password.");
        }
      } 
      // For signup tab
      else {
        const { success, error } = await auth.signup(email, password);
        if (success) {
          // Show success dialog and switch to login tab
          setError(null);
          setSignupSuccessOpen(true); // Open the success dialog instead of alert
          setTabValue(0); // Switch to login tab
          setEmail("");
          setPassword("");
        } else {
          setError(error || "Failed to create account.");
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  
  // Handler to close the signup success dialog
  const handleCloseSignupSuccess = () => {
    setSignupSuccessOpen(false);
  };
  
  // Open Gmail link in a new tab
  const handleOpenGmail = () => {
    window.open('https://mail.google.com', '_blank');
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
                {tabValue === 0 ? <LockOutlinedIcon /> : <PersonAddIcon />}
              </Avatar>
              
              {/* Tabs for Login/Signup */}
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="authentication tabs"
                sx={{ mb: 3, width: '100%', borderBottom: 1, borderColor: 'divider' }}
                centered
              >
                <Tab label="Sign In" />
                <Tab label="Sign Up" />
              </Tabs>

              {/* Form */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ width: "100%" }}
              >
                <Tooltip title="Enter your email address">
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete={tabValue === 0 ? "email" : "new-email"}
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </Tooltip>
                <Tooltip title={tabValue === 0 ? "Enter your password" : "Create a strong password"}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete={tabValue === 0 ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title={showPassword ? "Hide password" : "Show password"}>
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              disabled={loading}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Tooltip>
                
                {error && (
                  <Alert severity="error" sx={{ width: "100%", mt: 2, mb: 1 }}>
                    {error}
                  </Alert>
                )}
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.2 }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    tabValue === 0 ? "Sign In" : "Create Account"
                  )}
                </Button>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 3 }}
              >
                © {new Date().getFullYear()} Diabetic Retinopathy System
              </Typography>
            </Box>
          </Fade>
        </Box>
      </Box>
      
      {/* Signup Success Dialog with Gmail Link */}
      <Dialog
        open={signupSuccessOpen}
        onClose={handleCloseSignupSuccess}
        aria-labelledby="signup-success-dialog-title"
        aria-describedby="signup-success-dialog-description"
      >
        <DialogTitle id="signup-success-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon color="success" /> 
          Account Created Successfully
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="signup-success-dialog-description">
            <Typography paragraph>
              Your account has been created successfully! Please check your email for a verification link.
            </Typography>
            <Typography paragraph>
              You need to verify your email address before you can log in. We've sent a verification link to <strong>{email}</strong>.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
              <EmailIcon color="primary" />
              <Link 
                href="https://mail.google.com" 
                target="_blank" 
                rel="noopener"
                onClick={(e) => {
                  e.preventDefault();
                  handleOpenGmail();
                }}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                <Typography color="primary">Open Gmail</Typography>
              </Link>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSignupSuccess} color="primary" variant="contained">
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoginPage;
