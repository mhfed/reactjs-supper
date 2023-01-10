import ConfirmModal from '../ConfirmModal';
import { useSelector } from 'react-redux';
import { isExpiredSelector } from 'selectors/app.selector';

const ExpiredDialog = () => {
  const isExpired = useSelector(isExpiredSelector);

  const onExpired = () => {
    localStorage.clear();
    window.location.reload();
  };

  return <ConfirmModal open={isExpired} alertContent="lang_creating_pin_request_has_expired" onSubmit={onExpired} />;
};

export default ExpiredDialog;
