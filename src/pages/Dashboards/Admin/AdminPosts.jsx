import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Tabs, Tab } from "@mui/material";
import { useSearchParams, useLocation } from "react-router-dom";
import PendingPosts from "./PendingPosts";
import AllPosts from "./AllPosts";
import ArchievedPosts from "./ArchievedPosts";
import FeaturedPosts from "./FeaturedPosts";
import ScheduledPost from "./ScheduledPost";


function AdminPosts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const stateTab = location.state?.tab;
  const initialTab = parseInt(searchParams.get("tab")) || stateTab || 0;
  const [tab, setTab] = useState(initialTab);

  const handleTabChange = (e, newVal) => {
    setTab(newVal);
    setSearchParams({ tab: newVal });
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          bgcolor: "#2c2638",
          borderRadius: 2,
          py: 2,
          mb: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "white", textAlign: "center", fontSize: { xs: 15, md: 20 } }}
        >
          Posts
        </Typography>
      </Box>

      <Box sx={{ px: 2 }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          textColor="black"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label="Pending" />
          <Tab label="Published" />
          <Tab label="Archived" />
          <Tab label="Featured" />
          <Tab label="Scheduled" />
        </Tabs>

        {tab === 0 && <PendingPosts tab={tab} />}
        {tab === 1 && <AllPosts tab={tab} />}
        {tab === 2 && <ArchievedPosts tab={tab} />}
        {tab === 3 && <FeaturedPosts tab={tab} />}
        {tab === 4 && <ScheduledPost tab={tab} />}
      </Box>
    </Container>
  );
}

export default AdminPosts;
