import React, { useState } from 'react';
import { Modal } from './Modal';
import { Tabs, TabItem } from './Tabs';

interface TabbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  tabs: TabItem[];
  defaultTab?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onTabChange?: (tabId: string) => void;
}

export const TabbedModal: React.FC<TabbedModalProps> = ({
  isOpen,
  onClose,
  title,
  tabs,
  defaultTab,
  size = 'lg',
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <Tabs
        tabs={tabs}
        defaultTab={activeTab}
        onChange={handleTabChange}
        variant="underline"
      />
    </Modal>
  );
};