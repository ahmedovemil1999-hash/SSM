import {
    Avatar,
    Box,
    Button,
    Paper,
    Typography,
  } from '@mui/material';
  
  import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
  
  import { API_ORIGIN } from '../../../config';
  
  export default function PeopleCard({
    user,
    onAdd,
    loading,
  }) {
    const avatar = user.profileImageUrl
      ? user.profileImageUrl.startsWith('http')
        ? user.profileImageUrl
        : `${API_ORIGIN}${user.profileImageUrl}`
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
            {user.firstName?.[0]}
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
              {user.firstName} {user.lastName}
            </Typography>
  
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
            >
              @{user.userName}
            </Typography>
          </Box>
  
          <Button
            variant="contained"
            disableElevation
            startIcon={
              <PersonAddAlt1RoundedIcon />
            }
            disabled={loading}
            onClick={() => onAdd(user.id)}
            sx={{
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 800,
              px: 2,
            }}
          >
            Add
          </Button>
        </Box>
      </Paper>
    );
  }