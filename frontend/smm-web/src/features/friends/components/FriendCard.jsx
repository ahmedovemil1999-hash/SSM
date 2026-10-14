import {
  Avatar,
  Box,
  Button,
  Paper,
  Typography,
} from '@mui/material';

import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';

import { API_ORIGIN } from '../../../config';

export default function FriendCard({
  friend,
  onRemove,
  loading,
}) {
  const avatar = friend.profileImageUrl
    ? friend.profileImageUrl.startsWith('http')
      ? friend.profileImageUrl
      : `${API_ORIGIN}${friend.profileImageUrl}`
    : null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.2,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'rgba(148,163,184,.16)',
        background:
          'linear-gradient(145deg, #fff, #f8fafc)',
        boxShadow:
          '0 16px 40px rgba(15,23,42,.06)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Avatar
          src={avatar || undefined}
          sx={{
            width: 54,
            height: 54,
            fontWeight: 800,
            background:
              'linear-gradient(135deg,#2563eb,#7c3aed)',
          }}
        >
          {friend.firstName?.[0]}
        </Avatar>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Typography
            fontWeight={800}
            noWrap
          >
            {friend.firstName} {friend.lastName}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
          >
            @{friend.userName}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="error"
          disableElevation
          startIcon={
            <PersonRemoveRoundedIcon />
          }
          disabled={loading}
          onClick={() => onRemove(friend.id)}
          sx={{
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 800,
            px: 2,
            borderColor: 'rgba(239, 68, 68, 0.4)',
            '&:hover': {
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.04)',
            },
          }}
        >
          Dostluqdan çıxar
        </Button>
      </Box>
    </Paper>
  );
}