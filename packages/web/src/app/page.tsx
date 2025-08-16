"use client";

import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

function FeatureCard(props: { title: string; desc: string }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          {props.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.desc}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 10, md: 16 },
          background:
            "linear-gradient(135deg, rgba(139,69,19,0.10) 0%, rgba(160,82,45,0.10) 100%)",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 40, md: 56 },
                fontWeight: 800,
                letterSpacing: -0.5,
              }}
            >
              Coffee Shop Buddy
            </Typography>
            <Typography
              component="h2"
              color="text.secondary"
              sx={{ fontSize: { xs: 16, md: 20 }, maxWidth: 760 }}
            >
              Your daily dose of bliss — handcrafted coffee, artisan pastries,
              and delightful moments. Start your order or explore what's
              brewing today.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 1 }}
            >
              <Link href="/menu">
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 3,
                    py: 1.25,
                    bgcolor: "#8B4513",
                    "&:hover": { bgcolor: "#6f3610" },
                  }}
                >
                  View Menu
                </Button>
              </Link>
              <Link href="/checkout">
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 3,
                    py: 1.25,
                    borderColor: "#A0522D",
                    color: "#A0522D",
                    "&:hover": { borderColor: "#8B4513", color: "#8B4513" },
                  }}
                >
                  Checkout
                </Button>
              </Link>
              <Link href="/reservation">
                <Button variant="text" size="large">
                  Reserve a Table
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Container>

        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              borderRadius: "50%",
              filter: "blur(60px)",
              opacity: 0.25,
            },
            "&::before": {
              width: 280,
              height: 280,
              top: -60,
              left: -60,
              background: "#8B4513",
            },
            "&::after": {
              width: 420,
              height: 420,
              bottom: -120,
              right: -120,
              background: "#A0522D",
            },
          }}
        />
      </Box>

      {/* Featured categories */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={2} sx={{ mb: 4 }} alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Explore Favorites
          </Typography>
          <Typography color="text.secondary" align="center" sx={{ maxWidth: 720 }}>
            From bold espresso to delicate teas and freshly baked treats — pick a
            category to get started.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {[
            {
              title: "Coffee",
              desc:
                "Espresso, Americano, Latte, Cappuccino — carefully crafted, always fresh.",
              link: "/menu?category=Coffee",
            },
            {
              title: "Tea",
              desc:
                "Green, Black, and specialty blends to soothe, refresh, and inspire.",
              link: "/menu?category=Tea",
            },
            {
              title: "Pastry",
              desc:
                "Croissants, muffins, and cookies baked daily to pair with your drink.",
              link: "/menu?category=Pastry",
            },
            {
              title: "Food",
              desc:
                "Light bites and breakfast options for any time of day.",
              link: "/menu?category=Food",
            },
          ].map((c) => (
            <Grid item xs={12} sm={6} md={3} key={c.title}>
              <FeatureCard title={c.title} desc={c.desc} />
              <Box sx={{ mt: 1.5 }}>
                <Link href={c.link}>
                  <Button size="small">Browse {c.title}</Button>
                </Link>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why choose us */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FeatureCard
                title="Freshly Roasted Beans"
                desc="We select premium beans and roast in small batches for peak flavor."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                title="Crafted With Care"
                desc="Every cup is made by skilled baristas with consistent quality."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FeatureCard
                title="Community First"
                desc="A welcoming spot to study, meet friends, or unwind anytime."
              />
            </Grid>
          </Grid>

          <Stack
            spacing={2}
            alignItems="center"
            sx={{ mt: { xs: 5, md: 8 }, textAlign: "center" }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Ready to order?
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Link href="/menu">
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#8B4513",
                    "&:hover": { bgcolor: "#6f3610" },
                  }}
                >
                  Start with the Menu
                </Button>
              </Link>
              <Link href="/membership">
                <Button variant="outlined">Join Membership</Button>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Coffee Shop Buddy. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}