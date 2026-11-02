
import { Box, Container, IconButton } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import type { ReactNode } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./layout/Header";
import SideNav from "./layout/SideNav";
import Footer from "./layout/Footer";

type DashboardLayoutProps = {
  children: ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      sx={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "#F4F7FB",
      }}
    >
      {/* Fixed header area */}
      <Box sx={{ flexShrink: 0 }}>
        <Header />
      </Box>

      <Box
        sx={{
          display: { xs: "block", md: "none" },
          px: 2,
          pt: 1,
          flexShrink: 0,
        }}
      >
        <IconButton
          aria-label="Open navigation menu"
          onClick={() => setMobileOpen(true)}
          sx={{
            bgcolor: "#FFFFFF",
            border: "1px solid #E8EDF5",
            borderRadius: 2,
          }}
        >
          <MenuRoundedIcon />
        </IconButton>
      </Box>

      {/* Dashboard body */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <SideNav
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        {/* Only this area scrolls */}
        <Box
          component="main"
          key={location.pathname}
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            py: { xs: 2.5, md: 4 },
            px: { xs: 2, sm: 3, lg: 4 },
            animation: "pageEnter 0.35s ease-out",
            "@keyframes pageEnter": {
              from: {
                opacity: 0,
                transform: "translateY(8px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          }}
        >
          <Container maxWidth="xl" disableGutters sx={{ width: "100%" }}>
            {children}
          </Container>
        </Box>
      </Box>

      {/* Fixed footer area */}
      <Box sx={{ flexShrink: 0 }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default DashboardLayout;
