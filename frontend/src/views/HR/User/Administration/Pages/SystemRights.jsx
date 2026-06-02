// import React, { useEffect, useState } from 'react'
// import {
//   Box,
//   Grid,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Switch,
//   Checkbox,
//   Paper,
//   Typography
// } from '@mui/material'
// import { toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import menuItems from 'menu-items'
// import adminMenuItems from 'admin-menu-items'
// import { post, put } from '../../../../../api/api.js'
// // Recursive function to render the menu items into table rows
// function renderMenuItems(
//   items,
//   authorizedIds,
//   actionPermissions,
//   handleAuthorizationChange,
//   handleActionChange,
//   handleRowSelectAll,
//   parentIndex = ''
// ) {
//   return items.map((item, index) => {
//     const fullIndex = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`
//     const hasChildren = item.children && item.children.length > 0

//     const isSelectAllChecked =
//       item.url &&
//       ['Add', 'View', 'Edit', 'Delete'].every(
//         (action) => actionPermissions[item.id]?.[action]
//       )

//     const row = (
//       <TableRow key={item.id}>
//         <TableCell
//           align="center"
//           sx={{ fontWeight: hasChildren ? 'bold' : 'normal' }}
//         >
//           {fullIndex}
//         </TableCell>
//         <TableCell
//           align="center"
//           sx={{ fontWeight: hasChildren ? 'bold' : 'normal' }}
//         >
//           {item.title || item.id || item.name || 'N/A'}
//         </TableCell>
//         <TableCell align="center">
//           <Switch
//             checked={!!authorizedIds[item.id]}
//             onChange={(e) =>
//               handleAuthorizationChange(item.id, e.target.checked)
//             }
//             color="primary"
//           />
//         </TableCell>
//         <TableCell align="center">
//           {item.url && (
//             <div
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: '15px',
//               }}
//             >
//               {/* Select All Checkbox */}
//               <div>
//                 <Checkbox
//                   checked={isSelectAllChecked}
//                   onChange={(e) =>
//                     handleActionChange(item.id, null, e.target.checked, true) // Pass isSelectAll as true
//                   }
//                   color="primary"
//                   size="small"
//                 />
//                 <Typography variant="body2">Select All</Typography>
//               </div>
//               {/* Individual Action Checkboxes */}
//               {['Add', 'View', 'Edit', 'Delete'].map((action) => (
//                 <div
//                   key={action}
//                   style={{
//                     display: 'inline-block',
//                     marginRight: '10px',
//                   }}
//                 >
//                   <Checkbox
//                     checked={
//                       !!(
//                         actionPermissions[item.id] &&
//                         actionPermissions[item.id][action]
//                       )
//                     }
//                     onChange={(e) =>
//                       handleActionChange(item.id, action, e.target.checked)
//                     }
//                     color="primary"
//                     size="small"
//                   />
//                   <Typography variant="body2">{action}</Typography>
//                 </div>
//               ))}
//             </div>
//           )}
//         </TableCell>
//       </TableRow>
//     )

//     if (hasChildren) {
//       return (
//         <React.Fragment key={item.id}>
//           {row}
//           {renderMenuItems(
//             item.children,
//             authorizedIds,
//             actionPermissions,
//             handleAuthorizationChange,
//             handleActionChange,
//             handleRowSelectAll,
//             fullIndex
//           )}
//         </React.Fragment>
//       )
//     }

//     return row
//   })
// }


// const SystemRights = ({ setValue, setStoredAllData, storedAllData }) => {
//   const [authorizedIds, setAuthorizedIds] = useState({})
//   const [actionPermissions, setActionPermissions] = useState({})

//   useEffect(() => {
//     if (storedAllData.systemRights) {
//       setAuthorizedIds(storedAllData.systemRights.authorizedIds || {})
//       setActionPermissions(storedAllData.systemRights.actionPermissions || {})
//     }
//   }, [storedAllData.systemRights])

//   const handleAuthorizationChange = (id, isAuthorized) => {
//     // Update the authorized state for the selected ID and its children
//     const updateChildren = (items, parentId) => {
//       const updatedIds = {}
//       const traverse = items => {
//         items.forEach(item => {
//           if (item.id === parentId) {
//             updatedIds[item.id] = isAuthorized // Update the parent
//             if (item.children) {
//               item.children.forEach(child => {
//                 updatedIds[child.id] = isAuthorized // Update all children
//                 if (child.children) traverse(child.children)
//               })
//             }
//           } else if (item.children) {
//             traverse(item.children)
//           }
//         })
//       }
//       traverse(items)
//       return updatedIds
//     }

//     setAuthorizedIds(prev => ({
//       ...prev,
//       ...updateChildren(adminMenuItems.items, id) // Merge updated IDs with existing state
//     }))
//   }

//   const handleActionChange = (id, action, isChecked, isSelectAll = false) => {
//     setActionPermissions(prev => {
//       const updatedPermissions = { ...prev }
//       if (!updatedPermissions[id]) updatedPermissions[id] = {}

//       if (isSelectAll) {
//         // Toggle all actions
//         ;['Add', 'View', 'Edit', 'Delete'].forEach(act => {
//           updatedPermissions[id][act] = isChecked
//         })
//       } else {
//         // Toggle individual action
//         updatedPermissions[id][action] = isChecked
//       }

//       return updatedPermissions
//     })
//   }

//   const handleRowSelectAll = (id, isSelected) => {
//     setActionPermissions(prev => ({
//       ...prev,
//       [id]: {
//         Add: isSelected,
//         View: isSelected,
//         Edit: isSelected,
//         Delete: isSelected
//       }
//     }))
//   }

  
//   const handleSubmit = async e => {
//     e.preventDefault()
//     try {
//       if (storedAllData.submittedFormId) {
//         const response = await put(`administrative/systemRights/${storedAllData.submittedFormId}`, {
//           authorizedIds,
//           actionPermissions
//         })
//         if (response.success === true) {
//           setStoredAllData(prev => ({ ...prev, systemRights: response?.data?.systemRights }))
//           toast.success(response.message)
//           setValue(prev => prev + 1)
//         } else {
//           toast.error(response.message)
//         }
//       } else {
//         toast.error('Please submit the Basic Details first')
//         setValue(0)
//       }
//     } catch (error) {
//       toast.error('An error occurred while updating system rights.')
//     }
//   }

//   return (
//     <Box sx={{ padding: 4 }}>
//       <Card sx={{ maxWidth: '100%', boxShadow: 6, borderRadius: 4 }}>
//         <CardHeader
//           title='System Rights Management'
//           titleTypographyProps={{
//             variant: 'h5',
//             align: 'center',
//             sx: { color: '#344767', fontWeight: 'bold' }
//           }}
//           sx={{ backgroundColor: '#e3f2fd', borderRadius: '8px', padding: 2 }}
//         />
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2} sx={{ marginBottom: 2 }}></Grid>
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell align='center' sx={{ fontWeight: 'bold' }}>
//                       Sr. No.
//                     </TableCell>
//                     <TableCell align='center' sx={{ fontWeight: 'bold' }}>
//                       Module Name
//                     </TableCell>
//                     <TableCell align='center' sx={{ fontWeight: 'bold' }}>
//                       Authorization
//                     </TableCell>
//                     <TableCell align='center' sx={{ fontWeight: 'bold' }}>
//                       System Actions
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {renderMenuItems(
//                     adminMenuItems.items,
//                     authorizedIds,
//                     actionPermissions,
//                     handleAuthorizationChange,
//                     handleActionChange,
//                     handleRowSelectAll
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 2 }}>
//               <Button
//                 type='submit'
//                 variant='contained'
//                 color='secondary'
//                 disabled={storedAllData?.systemRights?._id}
//                 sx={{
//                   padding: '10px 30px',
//                   fontSize: '1rem',
//                   fontWeight: 600,
//                   borderRadius: '8px',
//                   textTransform: 'none',
//                   '&:hover': {
//                     backgroundColor: '#43a047'
//                   }
//                 }}
//               >
//                 Submit Rights
//               </Button>
//             </Grid>
//           </form>
//         </CardContent>
//       </Card>
//     </Box>
//   )
// }

// export default SystemRights


//todo: new code
import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Checkbox,
  Paper,
  Typography
} from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import adminMenuItems from 'admin-menu-items'
import { put } from '../../../../../api/api.js'

function renderMenuItems(
  items,
  authorizedIds,
  actionPermissions,
  handleAuthorizationChange,
  handleActionChange,
  handleRowSelectAll,
  parentIndex = ''
) {
  return items.map((item, index) => {
    const fullIndex = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`
    const hasChildren = item.children && item.children.length > 0

    const isSelectAllChecked =
      item.url &&
      ['Add', 'View', 'Edit', 'Delete'].every(
        (action) => actionPermissions[item.id]?.[action]
      )

    const row = (
      <TableRow key={item.id}>
        <TableCell align="center" sx={{ fontWeight: hasChildren ? 'bold' : 'normal' }}>
          {fullIndex}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: hasChildren ? 'bold' : 'normal' }}>
          {item.title || item.id || item.name || 'N/A'}
        </TableCell>
        <TableCell align="center">
          <Switch
            checked={!!authorizedIds[item.id]}
            onChange={(e) => handleAuthorizationChange(item.id, e.target.checked)}
            color="primary"
          />
        </TableCell>
        <TableCell align="center">
          {item.url && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <div>
                <Checkbox
                  checked={isSelectAllChecked}
                  onChange={(e) => handleActionChange(item.id, null, e.target.checked, true)}
                  color="primary"
                  size="small"
                />
                <Typography variant="body2">Select All</Typography>
              </div>
              {['Add', 'View', 'Edit', 'Delete'].map((action) => (
                <div key={action} style={{ display: 'inline-block', marginRight: '10px' }}>
                  <Checkbox
                    checked={!!(actionPermissions[item.id]?.[action])}
                    onChange={(e) => handleActionChange(item.id, action, e.target.checked)}
                    color="primary"
                    size="small"
                  />
                  <Typography variant="body2">{action}</Typography>
                </div>
              ))}
            </div>
          )}
        </TableCell>
      </TableRow>
    )

    if (hasChildren) {
      return (
        <React.Fragment key={item.id}>
          {row}
          {renderMenuItems(
            item.children,
            authorizedIds,
            actionPermissions,
            handleAuthorizationChange,
            handleActionChange,
            handleRowSelectAll,
            fullIndex
          )}
        </React.Fragment>
      )
    }

    return row
  })
}

const SystemRights = ({ setValue, setStoredAllData, storedAllData }) => {
  const [authorizedIds, setAuthorizedIds] = useState({})
  const [actionPermissions, setActionPermissions] = useState({})

  useEffect(() => {
    if (storedAllData.systemRights) {
      setAuthorizedIds(storedAllData.systemRights.authorizedIds || {})
      setActionPermissions(storedAllData.systemRights.actionPermissions || {})
    }
  }, [storedAllData.systemRights])

  const handleAuthorizationChange = (id, isAuthorized) => {
    const updateChildren = (items, parentId) => {
      const updatedIds = {}
      const updatedActions = {}

      const traverse = items => {
        items.forEach(item => {
          if (item.id === parentId) {
            updatedIds[item.id] = isAuthorized
            if (!isAuthorized) {
              updatedActions[item.id] = {
                Add: false,
                View: false,
                Edit: false,
                Delete: false
              }
            }
            if (item.children) {
              item.children.forEach(child => {
                updatedIds[child.id] = isAuthorized
                if (!isAuthorized) {
                  updatedActions[child.id] = {
                    Add: false,
                    View: false,
                    Edit: false,
                    Delete: false
                  }
                }
                if (child.children) traverse(child.children)
              })
            }
          } else if (item.children) {
            traverse(item.children)
          }
        })
      }

      traverse(adminMenuItems.items)
      return { updatedIds, updatedActions }
    }

    const { updatedIds, updatedActions } = updateChildren(adminMenuItems.items, id)

    setAuthorizedIds(prev => ({
      ...prev,
      ...updatedIds
    }))

    setActionPermissions(prev => {
      const newPermissions = { ...prev }
      Object.entries(updatedActions).forEach(([key, actions]) => {
        newPermissions[key] = actions
      })
      return newPermissions
    })
  }

  const handleActionChange = (id, action, isChecked, isSelectAll = false) => {
    setActionPermissions(prev => {
      const updatedPermissions = { ...prev }
      if (!updatedPermissions[id]) updatedPermissions[id] = {}

      if (isSelectAll) {
        ['Add', 'View', 'Edit', 'Delete'].forEach(act => {
          updatedPermissions[id][act] = isChecked
        })
      } else {
        updatedPermissions[id][action] = isChecked
      }

      return updatedPermissions
    })
  }

  const handleRowSelectAll = (id, isSelected) => {
    setActionPermissions(prev => ({
      ...prev,
      [id]: {
        Add: isSelected,
        View: isSelected,
        Edit: isSelected,
        Delete: isSelected
      }
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (storedAllData.submittedFormId) {
        const response = await put(`administrative/systemRights/${storedAllData.submittedFormId}`, {
          authorizedIds,
          actionPermissions
        })
        if (response.success === true) {
          setStoredAllData(prev => ({ ...prev, systemRights: response?.data?.systemRights }))
          toast.success(response.message)
          setValue(prev => prev + 1)
        } else {
          toast.error(response.message)
        }
      } else {
        toast.error('Please submit the Basic Details first')
        setValue(0)
      }
    } catch (error) {
      toast.error('An error occurred while updating system rights.')
    }
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Card sx={{ maxWidth: '100%', boxShadow: 6, borderRadius: 4 }}>
        <CardHeader
          title='System Rights Management'
          titleTypographyProps={{ variant: 'h5', align: 'center', sx: { color: '#344767', fontWeight: 'bold' } }}
          sx={{ backgroundColor: '#e3f2fd', borderRadius: '8px', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}></Grid>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Sr. No.</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Module Name</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Authorization</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>System Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderMenuItems(
                    adminMenuItems.items,
                    authorizedIds,
                    actionPermissions,
                    handleAuthorizationChange,
                    handleActionChange,
                    handleRowSelectAll
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 2 }}>
              <Button
                type='submit'
                variant='contained'
                color='secondary'
                sx={{
                  padding: '10px 30px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#43a047'
                  }
                }}
              >
                Submit Rights
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SystemRights
