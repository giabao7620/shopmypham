export default function BearWatcher({ activeField, hasPassword }) {
  const getBearFace = () => {
    if (activeField === 'password') {
      return '🙈'; // Che mắt khi nhập password
    }
    if (activeField === 'name' || activeField === 'email') {
      return '👀'; // Mắt nhìn khi nhập name/email
    }
    return '😴'; // Ngủ khi không focus
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '120px',
      zIndex: 1,
      pointerEvents: 'none',
      transition: 'all 0.3s ease'
    }}>
      {getBearFace()}
    </div>
  );
}