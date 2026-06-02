import React, { useEffect, useRef, useState } from 'react';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {
  Badge,
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemText,
  Avatar,
  Typography,
  ListItemAvatar,
  ListItemSecondaryAction,
  Fade,
  Box,
  Divider
} from '@mui/material';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import QueryBuilderTwoToneIcon from '@mui/icons-material/QueryBuilderTwoTone';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTheme } from '@mui/material/styles';
import { useGetNotificationsQuery } from 'services/endpoints/notifications/notificationApi';
import { createSocketConnection } from '../../../../socket.js';
import NotificationDialog from './NotificationDialog';

const NotificationSection = () => {
  const theme = useTheme();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const loginData = JSON.parse(localStorage.getItem('loginData'));
  const consultantId = loginData?.refId;

  const { data: notifications = [], refetch } = useGetNotificationsQuery(consultantId);

  // 🔄 Real-time socket connection setup
  useEffect(() => {
    const socket = createSocketConnection();

    const handleConnect = () => {
      socket.emit('notification', { consultantId });
    };

    const handleNewNotification = (newNotification) => {
      refetch(); // Refresh list
    };

    socket.on('connect', handleConnect);
    socket.on(`notification-${consultantId}`, handleNewNotification);
    socket.connect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off(`notification-${consultantId}`, handleNewNotification);
    };
  }, [consultantId, refetch]);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = (e) => {
    if (anchorRef.current && anchorRef.current.contains(e.target)) return;
    setOpen(false);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setDialogOpen(true);
  };

  const unapprovedNotifications = notifications.filter((item) => !item.isApproved);

  return (
    <>
      <Badge
        badgeContent={unapprovedNotifications.length}
        color="error"
        sx={{
          mr: 2,
          '& .MuiBadge-badge': {
            borderRadius: '50%',
            minWidth: 20,
            height: 20,
            fontSize: '0.75rem'
          }
        }}
      >
        <Button ref={anchorRef} onClick={handleToggle} color="inherit" sx={{ minWidth: 'unset', padding: 0,  color: '#000'}}>
          <NotificationsNoneTwoToneIcon sx={{ fontSize: '1.8rem' }} />
        </Button>
      </Badge>

      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-end" transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper
              sx={{
                mt: 3,
                width: 400,
                boxShadow: theme.shadows[5],
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: theme.palette.background.default
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <Box px={2} py={1.5} bgcolor={theme.palette.grey[100]}>
                    <Typography variant="h6" fontWeight={600}>
                      Notifications
                    </Typography>
                  </Box>
                  <Divider />
                  <PerfectScrollbar style={{ maxHeight: 360 }}>
                    <List disablePadding>
                      {unapprovedNotifications.length > 0 ? (
                        unapprovedNotifications.map((item, index, arr) => (
                          <React.Fragment key={item._id}>
                            <ListItemButton
                              onClick={() => handleNotificationClick(item)}
                              sx={{
                                alignItems: 'flex-start',
                                px: 2,
                                py: 1.5,
                                '&:hover': { bgcolor: theme.palette.action.hover }
                              }}
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ width: 44, height: 44, mt: 0.5, bgcolor: 'grey.200' }}>
                                  <PersonOutlineIcon sx={{ color: 'black' }} />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography variant="subtitle2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                    {item.message}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(item.createdAt).toLocaleString()}
                                  </Typography>
                                }
                                sx={{ pr: 4 }}
                              />
                              <ListItemSecondaryAction>
                                <QueryBuilderTwoToneIcon fontSize="small" sx={{ color: theme.palette.grey[400] }} />
                              </ListItemSecondaryAction>
                            </ListItemButton>
                            {index !== arr.length - 1 && <Divider component="li" />}
                          </React.Fragment>
                        ))
                      ) : (
                        <Box py={4} textAlign="center">
                          <Typography variant="body2" color="text.secondary">
                            You're all caught up! 🎉
                          </Typography>
                        </Box>
                      )}
                    </List>
                  </PerfectScrollbar>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      <NotificationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        notification={selectedNotification}
      />
    </>
  );
};

export default NotificationSection;
