import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Container,
  InputAdornment,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CircleIcon from '@mui/icons-material/Circle';

import { useQuery } from '@tanstack/react-query';

import { getPosts, searchPosts } from '../features/posts/api/postsApi';
import { getFriends } from '../features/friends/api/friendsApi';
import { useAuthStore } from '../features/auth/store/authStore';
import { API_ORIGIN } from '../config';

import CreatePostCard from '../features/posts/components/CreatePostCard';
import PostCard from '../features/posts/components/PostCard';

export default function FeedPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [search, setSearch] = useState('');

  // Postları gətirmək və ya axtarış etmək üçün query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', search],
    queryFn: () =>
      search.trim()
        ? searchPosts(search, { page: 1, pageSize: 20 })
        : getPosts({ page: 1, pageSize: 20 }),
  });

  // Contacts üçün dostları çəkirik
  const { data: friendsData } = useQuery({
    queryKey: ['friends-sidebar'],
    queryFn: getFriends,
  });

  // Yalnız onlayn olan dostları süzgəcdən keçiririk
  const onlineFriends = friendsData?.filter((friend) => friend.isOnline) || [];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f6f8fc',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '240px minmax(0, 680px)',
              lg: '240px minmax(0, 680px) 300px',
            },
            gap: 3,
            justifyContent: 'center',
          }}
        >
          {/* Sol Navigasiya */}
          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'block',
              },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 4,
                position: 'sticky',
                top: 96,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack spacing={1.2}>
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={700}
                >
                  Navigation
                </Typography>

                <Typography fontWeight={700}>Home</Typography>
                <Typography
                  color="text.secondary"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate('/friends')}
                >
                  Friends
                </Typography>
                <Typography color="text.secondary">Messages</Typography>
                <Typography color="text.secondary">Notifications</Typography>
              </Stack>
            </Paper>
          </Box>

          {/* Orta Hissə: Axtarış, Post yaratma və Postlar */}
          <Stack spacing={2.5}>
            {/* Task 2: Post Search Input */}
            <TextField
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 999,
                  bgcolor: 'white',
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <CreatePostCard />

            {isLoading &&
              [1, 2, 3].map((item) => (
                <Paper
                  key={item}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                    }}
                  >
                    <Skeleton variant="circular" width={46} height={46} />

                    <Box sx={{ flex: 1 }}>
                      <Skeleton width="30%" />
                      <Skeleton width="20%" />
                    </Box>
                  </Box>

                  <Skeleton height={24} sx={{ mt: 2 }} />
                  <Skeleton height={24} width="75%" />
                </Paper>
              ))}

            {isError && (
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                }}
              >
                <Typography color="error">Feed could not be loaded.</Typography>
              </Paper>
            )}

            {data?.items?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Stack>

          {/* Sağ Hissə: Contacts (Onlayn Dostlar və Mesaja Keçid) */}
          <Box
            sx={{
              display: {
                xs: 'none',
                lg: 'block',
              },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                position: 'sticky',
                top: 96,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography fontWeight={800} mb={2}>
                Contacts
              </Typography>

              {onlineFriends.length === 0 ? (
                <Typography color="text.secondary" variant="body2">
                  Online friends will appear here.
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {onlineFriends.map((friend) => {
                    const avatar = friend.profileImageUrl
                      ? friend.profileImageUrl.startsWith('http')
                        ? friend.profileImageUrl
                        : `${API_ORIGIN}${friend.profileImageUrl}`
                      : null;

                    return (
                      <Box
                        key={friend.id}
                        onClick={() => navigate(`/messages/${friend.id}`)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          cursor: 'pointer',
                          p: 1,
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                        }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <Avatar src={avatar || undefined} sx={{ width: 38, height: 38 }}>
                            {friend.firstName?.[0]}
                          </Avatar>
                          <CircleIcon
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              fontSize: 12,
                              color: 'success.main',
                              bgcolor: 'background.paper',
                              borderRadius: '50%',
                            }}
                          />
                        </Box>
                        <Typography fontWeight={700} variant="body2" noWrap>
                          {friend.firstName} {friend.lastName}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}