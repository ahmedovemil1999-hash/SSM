import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Container,
    IconButton,
    InputBase,
    Paper,
    Tooltip,
    Typography,
  } from '@mui/material';
  
  import {
    Outlet,
    useLocation,
    useNavigate,
  } from 'react-router-dom';
  
  import HomeRoundedIcon
    from '@mui/icons-material/HomeRounded';
  
  import PeopleAltRoundedIcon
    from '@mui/icons-material/PeopleAltRounded';
  
  import ChatBubbleRoundedIcon
    from '@mui/icons-material/ChatBubbleRounded';
  
  import SearchRoundedIcon
    from '@mui/icons-material/SearchRounded';
  
  import NotificationsRoundedIcon
    from '@mui/icons-material/NotificationsRounded';
  
  import { useQuery } from '@tanstack/react-query';
  
  import { useAuthStore }
    from '../features/auth/store/authStore';
  
  import {
    getUnreadCount,
  } from '../features/notifications/api/notificationsApi';
  
  export default function MainLayout() {
    const navigate = useNavigate();
  
    const location = useLocation();
  
    const user = useAuthStore(
      (state) => state.user
    );
  
    const unreadQuery = useQuery({
      queryKey: [
        'notification-unread-count',
      ],
  
      queryFn: getUnreadCount,
    });
  
    const navItem = (
      path,
      Icon,
      badge = 0
    ) => {
      const active =
        location.pathname === path ||
        (
          path !== '/' &&
          location.pathname.startsWith(
            path
          )
        );
  
      return (
        <Tooltip title={path}>
          <IconButton
            onClick={() =>
              navigate(path)
            }
            sx={{
              width: 48,
              height: 48,
  
              borderRadius: 3,
  
              color: active
                ? 'primary.main'
                : 'text.secondary',
  
              bgcolor: active
                ? 'rgba(37,99,235,.09)'
                : 'transparent',
  
              transition:
                'all .2s ease',
  
              '&:hover': {
                bgcolor:
                  'rgba(37,99,235,.08)',
                color:
                  'primary.main',
              },
            }}
          >
            <Badge
              badgeContent={badge}
              color="error"
              max={99}
            >
              <Icon />
            </Badge>
          </IconButton>
        </Tooltip>
      );
    };
  
    return (
      <Box
        sx={{
          minHeight: '100vh',
  
          background:
            'linear-gradient(180deg,#f8fafc 0%,#f3f6fb 100%)',
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor:
              'rgba(255,255,255,.88)',
  
            color: 'text.primary',
  
            backdropFilter:
              'blur(24px)',
  
            borderBottom:
              '1px solid rgba(148,163,184,.16)',
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                minHeight: 74,
  
                display: 'grid',
  
                gridTemplateColumns: {
                  xs:
                    'auto 1fr auto',
                  lg:
                    '340px 1fr 340px',
                },
  
                alignItems: 'center',
                gap: 2,
              }}
            >
              {/* LEFT */}
  
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  onClick={() =>
                    navigate('/')
                  }
                  sx={{
                    width: 44,
                    height: 44,
  
                    borderRadius: 3.2,
  
                    display: 'grid',
                    placeItems: 'center',
  
                    cursor: 'pointer',
  
                    color: 'white',
  
                    fontWeight: 950,
                    fontSize: 20,
  
                    background:
                      'linear-gradient(135deg,#2563eb,#7c3aed)',
  
                    boxShadow:
                      '0 10px 26px rgba(37,99,235,.28)',
                  }}
                >
                  S
                </Box>
  
                <Paper
                  elevation={0}
                  sx={{
                    display: {
                      xs: 'none',
                      md: 'flex',
                    },
  
                    alignItems: 'center',
  
                    height: 44,
                    width: 255,
  
                    px: 1.5,
  
                    borderRadius: 999,
  
                    bgcolor:
                      'rgba(241,245,249,.9)',
                  }}
                >
                  <SearchRoundedIcon
                    sx={{
                      mr: 1,
                      color:
                        'text.secondary',
                    }}
                  />
  
                  <InputBase
                    placeholder="Search people & posts"
                    fullWidth
                    onFocus={() =>
                      navigate('/friends')
                    }
                  />
                </Paper>
              </Box>
  
              {/* CENTER NAV */}
  
              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    'center',
                  gap: {
                    xs: 0,
                    sm: 1,
                    md: 2,
                  },
                }}
              >
                {navItem(
                  '/',
                  HomeRoundedIcon
                )}
  
                {navItem(
                  '/friends',
                  PeopleAltRoundedIcon
                )}
  
                {navItem(
                  '/messages',
                  ChatBubbleRoundedIcon
                )}
  
                {navItem(
                  '/notifications',
                  NotificationsRoundedIcon,
                  unreadQuery.data
                    ?.count ?? 0
                )}
              </Box>
  
              {/* RIGHT */}
  
              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    'flex-end',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: {
                      xs: 'none',
                      md: 'block',
                    },
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={800}
                  >
                    {user?.firstName}{' '}
                    {user?.lastName}
                  </Typography>
  
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    @{user?.userName}
                  </Typography>
                </Box>
  
                <Avatar
                  sx={{
                    width: 42,
                    height: 42,
  
                    fontWeight: 800,
  
                    background:
                      'linear-gradient(135deg,#2563eb,#7c3aed)',
                  }}
                >
                  {user?.firstName?.[0]}
                </Avatar>
              </Box>
            </Box>
          </Container>
        </AppBar>
  
        <Outlet />
      </Box>
    );
  }