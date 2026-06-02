import React, { useCallback, useEffect, useState } from 'react'
import { Switch } from '@mui/material'
import { get, post } from 'api/api' // Assuming `post` is available for updating suspension status

function SuspendUser ({ userId }) {
  const [suspended, setSuspended] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch suspension status
  const fetchSuspensionStatus = useCallback(async () => {
    try {
      setLoading(true)
      const response = await get(`admin/fetch-user-suspension-status/${userId}`)

      if (response?.success === true) {
        setSuspended(response.isSuspended)
      } else {
        console.error('Error fetching suspension status:', response)
        setError('Failed to fetch suspension status')
      }
    } catch (err) {
      console.error('Error fetching suspension status:', err)
      setError('An error occurred while fetching suspension status')
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Update suspension status
  const handleSuspensionToggle = async () => {
    try {
      setLoading(true)
      const newStatus = !suspended
      const response = await post(`admin/update-user-suspension-status`, {
        userId,
        isSuspended: newStatus
      })

      if (response?.success) {
        setSuspended(response.isSuspended)
      } else {
        console.error('Error updating suspension status:', response)
        setError('Failed to update suspension status')
      }
    } catch (err) {
      console.error('Error updating suspension status:', err)
      setError('An error occurred while updating suspension status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuspensionStatus()
  }, [userId, fetchSuspensionStatus])

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <Switch color='primary' checked={suspended} onChange={handleSuspensionToggle} />
      )}
    </div>
  )
}

export default SuspendUser
