import React, { useState, useEffect } from 'react';
import { Button, Grid, IconButton, MenuItem, TextField, Card, CardContent, Typography, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { get, post } from 'api/api';
import Loader from 'component/Loader/Loader';
import { Save, Cancel } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAddPathologyProfileTestsMutation } from 'services/endpoints/pathology/pathologyTest';

function ProfileMasterAddForm({ handleClose, fetchProfileData }) {
  const [addPathology, { isSuccess, isError, data, error, isLoading }] = useAddPathologyProfileTestsMutation();
  const [profileName, setProfileName] = useState('');
  const [TestMasterData, setTestMasterData] = useState([]);
  const [serviceAndBillGroup, setAllServiceAndBillGroup] = useState([]);
  const [departments, setAllDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [newSubheading, setNewSubheading] = useState('');
  const [mainProfileTests, setMainProfileTests] = useState([
    { testId: '', testName: '', testCode: '', machineName: '', formula: '', unit: '' }
  ]);
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({ profileName: '' });
  const [billGroupId, setBillGroupId] = useState('');
  const [billGroup, setBillGroup] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [department, setDepartment] = useState('');

  // Fetching all data concurrently
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [tests, billGroups, departments] = await Promise.all([
          get('investigation-pathology-master'),
          get('billgroup-master'),
          get('department-setup')
        ]);
        setTestMasterData(tests.investigations || []);
        setAllServiceAndBillGroup(billGroups.data || []);
        setAllDepartments(departments.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoader(false);
      }
    };

    fetchAllData();
  }, []);

  const addSection = () => {
    if (!newSubheading.trim()) return;
    setSections([
      ...sections,
      {
        subheading: newSubheading,
        tests: [{ testId: '', testName: '', testCode: '', machineName: '', formula: '', unit: '' }]
      }
    ]);
    setNewSubheading('');
  };

  const addTestToSection = (index) => {
    const updatedSections = [...sections];
    updatedSections[index].tests.push({ testId: '', testName: '', testCode: '', machineName: '', formula: '', unit: '' });
    setSections(updatedSections);
  };

  const handleTestChange = (sectionIndex, testIndex, field, value) => {
    const updatedSections = [...sections];
    if (field === 'testName') {
      const selectedTest = TestMasterData.find((test) => test._id === value);
      if (selectedTest) {
        updatedSections[sectionIndex].tests[testIndex] = {
          testId: selectedTest._id,
          testName: selectedTest.testName,
          testCode: selectedTest.testCode,
          machineName: selectedTest.machineName,
          formula: selectedTest.formula,
          unit: selectedTest.unit
        };
      }
    } else {
      updatedSections[sectionIndex].tests[testIndex][field] = value;
    }
    setSections(updatedSections);
  };

  const deleteTestFromSection = (sectionIndex, testIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].tests.splice(testIndex, 1);
    setSections(updatedSections);
  };

  const handleMainProfileTestChange = (testIndex, field, value) => {
    const updatedTests = [...mainProfileTests];
    if (field === 'testName') {
      const selectedTest = TestMasterData.find((test) => test._id === value);
      if (selectedTest) {
        updatedTests[testIndex] = {
          testId: selectedTest._id,
          testName: selectedTest.testName,
          testCode: selectedTest.testCode,
          machineName: selectedTest.machineName,
          formula: selectedTest.formula,
          unit: selectedTest.unit
        };
      }
    } else {
      updatedTests[testIndex][field] = value;
    }
    setMainProfileTests(updatedTests);
  };

  const addMainProfileTest = () => {
    setMainProfileTests([...mainProfileTests, { testId: '', testName: '', testCode: '', machineName: '', formula: '', unit: '' }]);
  };

  const deleteMainProfileTest = (index) => {
    const updatedTests = [...mainProfileTests];
    updatedTests.splice(index, 1);
    setMainProfileTests(updatedTests);
  };

  const handleSave = async () => {
    if (!profileName.trim()) {
      setErrors({ profileName: 'Profile name is required' });
      return;
    }

    const formData = {
      profileName,
      billGroupId,
      billGroup,
      departmentId,
      department,
      mainTests: mainProfileTests.map((t) => ({ testId: t.testId })),
      sections: sections.map((sec) => ({
        subheading: sec.subheading,
        tests: sec.tests.map((t) => ({ testId: t.testId }))
      }))
    };

    try {
      await addPathology(formData);
      console.log('FORM DATA', formData);
    } catch (error) {
      toast.error(error.message || 'Error saving profile.');
    }
  };

  const deleteSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Profie Added Successfully');
      handleClose();
    }

    if (isError) {
      toast.error('Failed To add profile');
    }
  }, [isSuccess, isError]);
  if (loader) return <Loader />;

  return (
    <Card sx={{ margin: 2, padding: 3 }}>
      <Typography variant="h5">Profile Master</Typography>
      <Divider sx={{ my: 2 }} />

      <TextField
        label="Profile Name"
        fullWidth
        variant="outlined"
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
        error={Boolean(errors.profileName)}
        helperText={errors.profileName}
      />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Service/Bill Group"
            value={billGroupId}
            onChange={(e) => {
              const selected = serviceAndBillGroup.find((g) => g._id === e.target.value);
              if (selected) {
                setBillGroupId(selected._id);
                setBillGroup(selected.billGroupName);
              }
            }}
          >
            {serviceAndBillGroup.map((g) => (
              <MenuItem key={g._id} value={g._id}>
                {g.billGroupName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Department"
            value={departmentId}
            onChange={(e) => {
              const selected = departments.find((d) => d._id === e.target.value);
              if (selected) {
                setDepartmentId(selected._id);
                setDepartment(selected.departmentName);
              }
            }}
          >
            {departments.map((d) => (
              <MenuItem key={d._id} value={d._id}>
                {d.departmentName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Profile-level Tests */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Tests for {profileName || 'Profile'}
      </Typography>
      {mainProfileTests.map((test, index) => (
        <Grid container spacing={2} alignItems="center" key={index} sx={{ mb: 2 }}>
          <Grid item xs={3}>
            <TextField
              select
              label="Test Name"
              fullWidth
              value={test.testId || ''}
              onChange={(e) => handleMainProfileTestChange(index, 'testName', e.target.value)}
            >
              {TestMasterData.map((test) => (
                <MenuItem key={test._id} value={test._id}>
                  {test.testName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Test Code"
              fullWidth
              value={test.testCode}
              onChange={(e) => handleMainProfileTestChange(index, 'testCode', e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Machine"
              fullWidth
              value={test.machineName}
              onChange={(e) => handleMainProfileTestChange(index, 'machineName', e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Formula"
              fullWidth
              value={test.formula}
              onChange={(e) => handleMainProfileTestChange(index, 'formula', e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Unit"
              fullWidth
              value={test.unit}
              onChange={(e) => handleMainProfileTestChange(index, 'unit', e.target.value)}
            />
          </Grid>
          <Grid item xs={1} sx={{ display: 'flex' }}>
            <IconButton color="primary" onClick={addMainProfileTest}>
              <AddIcon />
            </IconButton>
            <IconButton color="error" onClick={() => deleteMainProfileTest(index)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      {/* Subheadings Section */}
      <Grid container spacing={2} sx={{ mt: 4 }} alignItems="center">
        <Grid item xs={10}>
          <TextField label="Subheading" fullWidth value={newSubheading} onChange={(e) => setNewSubheading(e.target.value)} />
        </Grid>
        <Grid item xs={2}>
          <IconButton color="primary" onClick={addSection}>
            <AddIcon />
          </IconButton>
        </Grid>
      </Grid>

      {sections.map((section, sectionIndex) => (
        <Card key={section.subheading + sectionIndex} sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9' }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
                {section.subheading}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton color="error" onClick={() => deleteSection(sectionIndex)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>

          {section.tests.map((test, testIndex) => (
            <Grid container spacing={2} alignItems="center" key={testIndex} sx={{ mb: 2 }}>
              <Grid item xs={3}>
                <TextField
                  select
                  label="Test Name"
                  fullWidth
                  value={test.testId || ''}
                  onChange={(e) => handleTestChange(sectionIndex, testIndex, 'testName', e.target.value)}
                >
                  {TestMasterData.map((test) => (
                    <MenuItem key={test._id} value={test._id}>
                      {test.testName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Test Code"
                  fullWidth
                  value={test.testCode}
                  onChange={(e) => handleTestChange(sectionIndex, testIndex, 'testCode', e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Machine"
                  fullWidth
                  value={test.machineName}
                  onChange={(e) => handleTestChange(sectionIndex, testIndex, 'machineName', e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Formula"
                  fullWidth
                  value={test.formula}
                  onChange={(e) => handleTestChange(sectionIndex, testIndex, 'formula', e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Unit"
                  fullWidth
                  value={test.unit}
                  onChange={(e) => handleTestChange(sectionIndex, testIndex, 'unit', e.target.value)}
                />
              </Grid>
              <Grid item xs={1} sx={{ display: 'flex' }}>
                <IconButton color="primary" onClick={() => addTestToSection(sectionIndex)}>
                  <AddIcon />
                </IconButton>
                <IconButton color="error" onClick={() => deleteTestFromSection(sectionIndex, testIndex)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Card>
      ))}

      <Grid container justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
        <Grid item>
          <IconButton color="primary" sx={{ backgroundColor: '#4CAF50', color: 'white', p: 2 }} onClick={handleSave}>
            <Save />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton color="secondary" sx={{ backgroundColor: '#F44336', color: 'white', p: 2 }} onClick={handleClose}>
            <Cancel />
          </IconButton>
        </Grid>
      </Grid>
    </Card>
  );
}

export default ProfileMasterAddForm;
