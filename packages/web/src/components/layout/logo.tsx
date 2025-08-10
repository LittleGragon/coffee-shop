import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export function Logo({ withLink = false }: { withLink?: boolean }) {
  const logoContent = (
    <>
      <LocalCafeIcon sx={{ fontSize: 32, color: '#4A2C2A' }} />
      <Typography
        variant="h6"
        component="span"
        sx={{
          fontWeight: 600,
          color: '#4A2C2A',
          ml: 1,
        }}
      >
        Coffee Bliss
      </Typography>
    </>
  );

  if (withLink) {
    return (
      <Link
        href="/"
        underline="none"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {logoContent}
      </Link>
    );
  }

  return <Box sx={{ display: 'flex', alignItems: 'center' }}>{logoContent}</Box>;
}
