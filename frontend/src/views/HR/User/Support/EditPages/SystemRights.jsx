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
import { post, put } from 'api/api'

// Recursive function to render the menu items into table rows
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
      <TableRow key={item.id || item.title}>
        <TableCell
          align="center"
          sx={{ fontWeight: hasChildren ? 'bold' : 'normal' }}
        >
          {fullIndex}
        </TableCell>
        <TableCell
          align="center"
          sx={{ fontWeight: hasChildren ? 'bold' : 'normal' }}
        >
          {item.title}
        </TableCell>
        <TableCell align="center">
          <Switch
            checked={!!authorizedIds[item.id || item.title]}
            onChange={(e) =>
              handleAuthorizationChange(item.id || item.title, e.target.checked)
            }
            color="primary"
          />
        </TableCell>
        <TableCell align="center">
          {item.url && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
              }}
            >
              {/* Select All Checkbox */}
              <div>
                <Checkbox
                  checked={isSelectAllChecked}
                  onChange={(e) =>
                    handleActionChange(item.id || item.title, null, e.target.checked, true)
                  }
                  color="primary"
                  size="small"
                />
                <Typography variant="body2">Select All</Typography>
              </div>
              {/* Individual Action Checkboxes */}
              {['Add', 'View', 'Edit', 'Delete'].map((action) => (
                <div
                  key={action}
                  style={{ display: 'inline-block', marginRight: '10px' }}
                >
                  <Checkbox
                    checked={
                      !!(
                        actionPermissions[item.id || item.title]?.[action]
                      )
                    }
                    onChange={(e) =>
                      handleActionChange(item.id || item.title, action, e.target.checked)
                    }
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
        <React.Fragment key={item.id || item.title}>
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
  const menuItems = [
    {
      id: 'vital',
      title: 'Vital',
      url: '/vital'
    },
    {
      id: 'chief-complaint',
      title: 'Chief Complaint',
      url: '/chief-complaint'
    },
    {
      id: 'medical-history',
      title: 'Medical History',
      url: '/medical-history'
    },
    {
      id: 'examination',
      title: 'Examination',
      url: '/examination'
    },
    {
      id: 'medical-prescription',
      title: 'Medical Prescription',
      url: '/medical-prescription'
    },
    {
      id: 'provisional-diagnosis',
      title: 'Provisional Diagnosis',
      url: '/provisional-diagnosis'
    },
    {
      id: 'final-diagnosis',
      title: 'Final Diagnosis',
      url: '/final-diagnosis'
    },
    {
      id: 'Orders',
      title: 'Orders',
      url: '/final-diagnosis'
    },
    {
      id: 'Follow',
      title: 'Follow',
      url: '/final-diagnosis'
    },
    {
      id: 'All',
      title: 'All',
      url: '/final-diagnosis'
    }
  ]



  useEffect(() => {
    if (storedAllData.systemRights) {
      setAuthorizedIds(storedAllData.systemRights.authorizedIds || {})
      setActionPermissions(storedAllData.systemRights.actionPermissions || {})
    }
  }, [storedAllData.systemRights])

  const handleAuthorizationChange = (id, isAuthorized) => {
    const updateChildren = (items, parentId) => {
      const updatedIds = {}
      const traverse = items => {
        items.forEach(item => {
          const key = item.id || item.title
          if (key === parentId) {
            updatedIds[key] = isAuthorized
            if (item.children) {
              item.children.forEach(child => {
                updatedIds[child.id || child.title] = isAuthorized
                if (child.children) traverse(child.children)
              })
            }
          } else if (item.children) {
            traverse(item.children)
          }
        })
      }
      traverse(items)
      return updatedIds
    }

    setAuthorizedIds(prev => ({
      ...prev,
      ...updateChildren(menuItems, id)
    }))
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
  console.log("authorizedIds  ", authorizedIds)
  console.log("actionPermissions  ", actionPermissions)
  const handleSubmit = async e => {
    e.preventDefault()

    try {
   

      // Preserve existing _id from stored data
      const finalActionPermissions = {}

      for (const [key, value] of Object.entries(actionPermissions)) {
        finalActionPermissions[key] = {
          ...value
        }

        // If there's an existing _id in storedAllData for this key, preserve it
        const existing = storedAllData?.systemRights?.actionPermissions?.[key]
        if (existing && existing._id) {
          finalActionPermissions[key]._id = existing._id
        }
      }

      const response = await put(`nursingAndParamedical/system-right/${storedAllData.submittedFormId}`, {
        authorizedIds,
        actionPermissions: finalActionPermissions
      })

      if (response.success === true) {
        setStoredAllData(prev => ({ ...prev, systemRights: response?.data?.systemRights }))
        toast.success(response.message)
        setValue(prev => prev + 1)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred while updating system rights.')
    }
  }


  return (
    <Box sx={{ padding: 4 }}>
      <Card sx={{ maxWidth: '100%', boxShadow: 6, borderRadius: 4 }}>
        <CardHeader
          title='System Rights Management'
          titleTypographyProps={{
            variant: 'h5',
            align: 'center',
            sx: { color: '#344767', fontWeight: 'bold' }
          }}
          sx={{ backgroundColor: '#e3f2fd', borderRadius: '8px', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
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
                    menuItems,
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
                disabled={storedAllData?.systemRights?._id}
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
