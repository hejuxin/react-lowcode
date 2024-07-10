import { useCallback, useRef, useState } from "react";

/**
 * 自定义modal hook
 */
export function useModalParams() {
  const [visible, setVisible] = useState(false);
  const paramsRef = useRef<Record<string, any>>({});
  const hideModal = useCallback(() => {
    setVisible(false);
    paramsRef.current = {};
  }, []);
  const showModal = useCallback((params?: Record<string, any>) => {
    if (params) {
      paramsRef.current = params;
    }
    setVisible(true);
  }, []);
  return {
    hideModal,
    showModal,
    visible,
    params: paramsRef.current,
    modalProps: {
      open: visible,
      onCancel: hideModal,
      maskClosable: false,
      okText: '确认',
      cancelText: '取消',
      destroyOnClose: true,
    },
  };
}