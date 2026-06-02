import VitalTabs from './VerticalTabs';

const VitalMaster = ({ editData }) => {
  const departmentId = editData?.departmentId?._id;
  return (
    <>
      <VitalTabs departmentId={departmentId} />
    </>
  );
};

export default VitalMaster;
