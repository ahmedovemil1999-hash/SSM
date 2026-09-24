import { useState } from 'react';

import {
  Box,
  Container,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  acceptFriendRequest,
  getIncomingRequests,
  getFriends,
  rejectFriendRequest,
  searchUsers,
  sendFriendRequest,
} from '../features/friends/api/friendsApi';

import PeopleCard from '../features/friends/components/PeopleCard';
import FriendRequestCard from '../features/friends/components/FriendRequestCard';

export default function FriendsPage() {
  const queryClient = useQueryClient();

  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');

  const peopleQuery = useQuery({
    queryKey: ['people', search],
    queryFn: () =>
      searchUsers(search),
  });

  const requestsQuery = useQuery({
    queryKey: ['friend-requests'],
    queryFn: getIncomingRequests,
  });

  const friendsQuery = useQuery({
    queryKey: ['friends'],
    queryFn: getFriends,
  });

  const sendMutation = useMutation({
    mutationFn: sendFriendRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['people'],
      });

      queryClient.invalidateQueries({
        queryKey: ['friend-requests'],
      });
    },
  });

  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['friend-requests'],
      });

      queryClient.invalidateQueries({
        queryKey: ['friends'],
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectFriendRequest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['friend-requests'],
      });
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f6f8fc',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box mb={3}>
          <Typography
            variant="h4"
            fontWeight={900}
          >
            Friends
          </Typography>

          <Typography color="text.secondary">
            Discover people and manage your connections.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            mb: 3,
            px: 2,
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, value) =>
              setTab(value)
            }
          >
            <Tab label="Discover" />
            <Tab
              label={`Requests (${requestsQuery.data?.length ?? 0})`}
            />
            <Tab
              label={`Friends (${friendsQuery.data?.length ?? 0})`}
            />
          </Tabs>
        </Paper>

        {tab === 0 && (
          <>
            <TextField
              fullWidth
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search people..."
              sx={{
                mb: 3,

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

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                },
                gap: 2,
              }}
            >
              {peopleQuery.data?.map(
                (user) => (
                  <PeopleCard
                    key={user.id}
                    user={user}
                    loading={
                      sendMutation.isPending
                    }
                    onAdd={(id) =>
                      sendMutation.mutate(id)
                    }
                  />
                )
              )}
            </Box>
          </>
        )}

        {tab === 1 && (
          <Stack spacing={2}>
            {requestsQuery.data?.length ===
              0 && (
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 4,
                }}
              >
                <Typography>
                  No pending friend requests.
                </Typography>
              </Paper>
            )}

            {requestsQuery.data?.map(
              (request) => (
                <FriendRequestCard
                  key={request.id}
                  request={request}
                  loading={
                    acceptMutation.isPending ||
                    rejectMutation.isPending
                  }
                  onAccept={(id) =>
                    acceptMutation.mutate(id)
                  }
                  onReject={(id) =>
                    rejectMutation.mutate(id)
                  }
                />
              )
            )}
          </Stack>
        )}

        {tab === 2 && (
          <Stack spacing={2}>
            {friendsQuery.data?.map(
              (friend) => (
                <Paper
                  key={friend.id}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                  }}
                >
                  <Typography fontWeight={800}>
                    {friend.firstName}{' '}
                    {friend.lastName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    @{friend.userName}
                  </Typography>
                </Paper>
              )
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
}