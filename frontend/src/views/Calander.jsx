// import React, { useEffect, useState } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import { Box, Card, Typography, CircularProgress, FormControl, Select, MenuItem } from '@mui/material';
// import { get } from 'api/api';

// const ModernCalendar = () => {
//   const [allEvents, setAllEvents] = useState([]);
//   const [filteredEvents, setFilteredEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filterType, setFilterType] = useState('all');

//   const addOneDay = (dateString) => {
//     if (!dateString) return null;
//     const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
//     date.setDate(date.getDate() + 1);
//     return date.toISOString().split('T')[0];
//   };

//   const addDays = (dateString, days) => {
//     if (!dateString) return null;
//     const date = new Date(dateString);
//     date.setDate(date.getDate() + days);
//     return date.toISOString().split('T')[0];
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch holidays
//         const holidayResponse = await get('holiday');
//         const holidayData = holidayResponse?.data || [];
//         // const formattedHolidays = holidayData.map((h) => ({
//         //   title: h.holidayName || 'Holiday',
//         //   start: h.date?.split('T')[0],
//         //   end: h.toDate ? h.toDate.split('T')[0] : h.date?.split('T')[0],
//         //   color: h.holidayTypeId?.color || '#f59e0b',
//         //   type: 'holiday',
//         //   allDay: true
//         // }));

//         const formattedHolidays = holidayData.map((h) => {
//           const startDate = h.date?.split('T')[0];
//           const endDate = h.toDate ? h.toDate.split('T')[0] : startDate;

//           return {
//             title: h.holidayName || 'Holiday',
//             start: startDate,
//             end: endDate ? addOneDay(endDate) : addOneDay(startDate), // Add 1 day
//             color: h.holidayTypeId?.color || '#f59e0b',
//             type: 'holiday',
//             allDay: true
//           };
//         });

//         // Fetch leaves
//         const leaveResponse = await get('/leaveManager');
//         console.log('leave manager ', leaveResponse.data);
//         const leaveData = leaveResponse?.data || [];

//         // Process leaves - show as continuous bars
//         // const formattedLeaves = leaveData
//         //   .map((l) => {
//         //     const fromDate = l.fromDate?.split('T')[0];
//         //     const toDate = l.toDate?.split('T')[0];
//         //     const staffName = l.staffName || 'Employee';
//         //     const leaveTypeName = l.leaveType?.leaveType || 'Leave';

//         //     return {
//         //       title: `${staffName} - ${leaveTypeName}`,
//         //       start: fromDate,
//         //       end: toDate || fromDate,
//         //       color: '#ef4444',
//         //       type: 'leave',
//         //       allDay: true
//         //     };
//         //   })
//         //   .filter((l) => l.start); // Remove leaves without fromDate

//         const formattedLeaves = leaveData
//           .map((l) => {
//             const startDate = l.fromDate?.split('T')[0];
//             let endDate = l.toDate?.split('T')[0];

//             if (endDate) {
//               endDate = addDays(endDate, 1);
//             } else if (startDate) {
//               endDate = addDays(startDate, 1);
//             }

//             return {
//               title: `${l.staffName || 'Employee'} - ${l.leaveType?.leaveType || 'Leave'}`,
//               start: startDate,
//               end: endDate,
//               color: '#ef4444',
//               type: 'leave',
//               allDay: true
//             };
//           })
//           .filter((l) => l.start);

//         // Fetch tasks
//         const taskResponse = await get('task-manager');
//         console.log('get task res is', taskResponse);
//         const taskData = taskResponse?.data || [];
//         // const formattedTasks = taskData
//         //   .map((t) => ({
//         //     title: t.title || 'Task',
//         //     start: t.startDate?.split('T')[0],
//         //     end: t.endDate?.split('T')[0] || t.startDate?.split('T')[0],
//         //     color: '#3b82f6',
//         //     type: 'task',
//         //     allDay: true
//         //   }))
//         //   .filter((t) => t.start);

//         const formattedTasks = taskData
//           .map((t) => {
//             const startDate = t.startDate?.split('T')[0];
//             let endDate = t.endDate?.split('T')[0];

//             // Add 2 extra days to the end date for tasks
//             if (endDate) {
//               endDate = addDays(endDate, 2);
//             } else if (startDate) {
//               endDate = addDays(startDate, 2);
//             }

//             return {
//               title: t.title || 'Task',
//               start: startDate,
//               end: endDate,
//               color: '#3b82f6',
//               type: 'task',
//               allDay: true
//             };
//           })
//           .filter((t) => t.start);

//         // Combine all events
//         const combinedEvents = [...formattedHolidays, ...formattedLeaves, ...formattedTasks];

//         setAllEvents(combinedEvents);
//         setFilteredEvents(combinedEvents);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle filter change
//   useEffect(() => {
//     if (filterType === 'all') {
//       setFilteredEvents(allEvents);
//     } else {
//       setFilteredEvents(allEvents.filter((event) => event.type === filterType));
//     }
//   }, [filterType, allEvents]);

//   const handleFilterChange = (event) => {
//     setFilterType(event.target.value);
//   };

//   return (
//     <Box
//       sx={{
//         backgroundColor: '#f9fafb',
//         minHeight: '100vh',
//         p: 4,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'flex-start'
//       }}
//     >
//       <Card
//         sx={{
//           width: '95%',
//           maxWidth: 1200,
//           borderRadius: 4,
//           boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//           p: 3,
//           background: '#fff'
//         }}
//       >
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography
//             variant="h5"
//             sx={{
//               fontWeight: 600,
//               color: '#1e293b'
//             }}
//           >
//             🗓️ Monthly Schedule
//           </Typography>

//           {/* Dropdown Filter */}
//           <FormControl sx={{ minWidth: 180 }}>
//             <Select
//               value={filterType}
//               onChange={handleFilterChange}
//               displayEmpty
//               sx={{
//                 borderRadius: 2,
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#e2e8f0'
//                 },
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#3b82f6'
//                 }
//               }}
//             >
//               <MenuItem value="all">📅 All Events</MenuItem>
//               <MenuItem value="holiday">🎉 Holidays</MenuItem>
//               <MenuItem value="leave">🏖️ Leaves</MenuItem>
//               <MenuItem value="task">✓ Tasks</MenuItem>
//             </Select>
//           </FormControl>
//         </Box>

//         {loading ? (
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: '70vh'
//             }}
//           >
//             <CircularProgress />
//           </Box>
//         ) : (
//           <FullCalendar
//             plugins={[dayGridPlugin, interactionPlugin]}
//             initialView="dayGridMonth"
//             height="80vh"
//             headerToolbar={{
//               left: 'prev,next today',
//               center: 'title',
//               right: ''
//             }}
//             titleFormat={{ year: 'numeric', month: 'long' }}
//             dayMaxEvents={false}
//             eventDisplay="block"
//             events={filteredEvents}
//           />
//         )}
//       </Card>
//     </Box>
//   );
// };

// export default ModernCalendar;

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Card, Typography, CircularProgress, FormControl, Select, MenuItem } from '@mui/material';
import { get } from 'api/api';

const ModernCalendar = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [employeeNames, setEmployeeNames] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');

  const addOneDay = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  const addDays = (dateString, days) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch holidays
        const holidayResponse = await get('holiday');
        const holidayData = holidayResponse?.data || [];

        const formattedHolidays = holidayData.map((h) => {
          const startDate = h.date?.split('T')[0];
          const endDate = h.toDate ? h.toDate.split('T')[0] : startDate;

          return {
            title: h.holidayName || 'Holiday',
            start: startDate,
            end: endDate ? addOneDay(endDate) : addOneDay(startDate), // Add 1 day
            color: h.holidayTypeId?.color || '#f59e0b',
            type: 'holiday',
            allDay: true
          };
        });

        // Fetch leaves
        const leaveResponse = await get('/leaveManager');
        console.log('leave manager ', leaveResponse.data);
        const leaveData = leaveResponse?.data || [];

        const formattedLeaves = leaveData
          .map((l) => {
            const startDate = l.fromDate?.split('T')[0];
            let endDate = l.toDate?.split('T')[0];

            if (endDate) {
              endDate = addDays(endDate, 1);
            } else if (startDate) {
              endDate = addDays(startDate, 1);
            }

            return {
              title: `${l.staffName || 'Employee'} - ${l.leaveType?.leaveType || 'Leave'}`,
              start: startDate,
              end: endDate,
              color: '#ef4444',
              type: 'leave',
              allDay: true
            };
          })
          .filter((l) => l.start);

        // Fetch tasks
        const taskResponse = await get('task-manager');
        console.log('get task res is', taskResponse);
        const taskData = taskResponse?.data || [];

        const formattedTasks = taskData
          .map((t) => {
            const startDate = t.startDate?.split('T')[0];
            let endDate = t.endDate?.split('T')[0];

            // Add 2 extra days to the end date for tasks
            if (endDate) {
              endDate = addDays(endDate, 2);
            } else if (startDate) {
              endDate = addDays(startDate, 2);
            }

            return {
              title: t.title || 'Task',
              start: startDate,
              end: endDate,
              color: '#3b82f6',
              type: 'task',
              allDay: true,
              employeeName: t.employeeName || 'Unknown'
            };
          })
          .filter((t) => t.start);

        // Extract unique employee names from tasks
        const uniqueEmployees = [...new Set(formattedTasks.map((t) => t.employeeName))].sort();
        setEmployeeNames(uniqueEmployees);

        // Combine all events
        const combinedEvents = [...formattedHolidays, ...formattedLeaves, ...formattedTasks];

        setAllEvents(combinedEvents);
        setFilteredEvents(combinedEvents);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filter change
  useEffect(() => {
    let filtered = allEvents;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((event) => event.type === filterType);
    }

    // Filter by employee if task type is selected and an employee is chosen
    if (filterType === 'task' && selectedEmployee !== 'all') {
      filtered = filtered.filter((event) => event.employeeName === selectedEmployee);
    }

    setFilteredEvents(filtered);
  }, [filterType, selectedEmployee, allEvents]);

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setSelectedEmployee('all'); // Reset employee filter when type changes
  };

  const handleEmployeeChange = (event) => {
    setSelectedEmployee(event.target.value);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f9fafb',
        minHeight: '75vh',
        // p: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start'
      }}
    >
      <Card
        sx={{
          width: '95%',
          maxWidth: 1200,
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          p: 3,
          background: '#fff'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#1e293b'
            }}
          >
            🗓️ Monthly Schedule
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Type Filter Dropdown */}
            <FormControl sx={{ minWidth: 180 }}>
              <Select
                value={filterType}
                onChange={handleFilterChange}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e2e8f0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3b82f6'
                  }
                }}
              >
                <MenuItem value="all">📅 All Events</MenuItem>
                <MenuItem value="holiday">🎉 Holidays</MenuItem>
                <MenuItem value="leave">🏖️ Leaves</MenuItem>
                <MenuItem value="task">✓ Tasks</MenuItem>
              </Select>
            </FormControl>

            {/* Employee Filter Dropdown - only show when tasks are selected */}
            {filterType === 'task' && (
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={selectedEmployee}
                  onChange={handleEmployeeChange}
                  displayEmpty
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e2e8f0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6'
                    }
                  }}
                >
                  <MenuItem value="all">👤 All Employees</MenuItem>
                  {employeeNames.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '70vh'
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="80vh"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: ''
            }}
            titleFormat={{ year: 'numeric', month: 'long' }}
            dayMaxEvents={false}
            eventDisplay="block"
            events={filteredEvents}
          />
        )}
      </Card>
    </Box>
  );
};

export default ModernCalendar;
