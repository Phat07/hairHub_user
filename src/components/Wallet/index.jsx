import React, { useState } from 'react';
import { Card, Tabs, List, Tag, Statistic, Avatar, theme } from 'antd';
import { 
  WalletOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CreditCardOutlined,
  DollarOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { green, red } from '@ant-design/colors';

// Custom theme colors
const goldColor = {
  primary: '#BF9456',
  lighter: '#D4B17B',
  darker: '#A67B3E'
};

const WalletComponent = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { token } = theme.useToken();
  const [bankInfo, setBankInfo] = useState(null);
  const [showBankForm, setShowBankForm] = useState(false);
  const transactions = [
    { id: 1, type: 'income', amount: 1500, description: 'Salary', date: '2024-10-20' },
    { id: 2, type: 'expense', amount: -45, description: 'Restaurant', date: '2024-10-19' },
    { id: 3, type: 'income', amount: 200, description: 'Freelance', date: '2024-10-18' },
  ];
  const handleAddBankInfo = (values) => {
    setBankInfo(values);
  };

  const cards = [
    {
      id: 1,
      number: '**** **** **** 4242',
      holder: 'John Doe',
      expiry: '12/25',
      type: 'VISA'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const tabItems = [
    {
      key: '1',
      label: 'Overview',
      children: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <List
            itemLayout="horizontal"
            dataSource={transactions}
            renderItem={(item) => (
              <motion.div
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
              >
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={item.type === 'income' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                        style={{ 
                          backgroundColor: item.type === 'income' ? green[5] : red[5],
                          color: 'white'
                        }}
                      />
                    }
                    title={<span style={{ color: token.colorText }}>{item.description}</span>}
                    description={item.date}
                  />
                  <Tag color={item.type === 'income' ? 'success' : 'error'}>
                    {item.type === 'income' ? '+' : ''}{item.amount} USD
                  </Tag>
                </List.Item>
              </motion.div>
            )}
          />
        </motion.div>
      ),
    },
    {
      key: '2',
      label: 'Cards',
      children: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cards.map(card => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                style={{ 
                  background: `linear-gradient(135deg, ${goldColor.primary}, ${goldColor.darker})`,
                  color: 'white',
                  marginBottom: 16
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <CreditCardOutlined style={{ fontSize: 24 }} />
                  <span>{card.type}</span>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 18 }}>{card.number}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{card.holder}</span>
                  <span>{card.expiry}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ),
    },
    {
      key: '3',
      label: 'Statistics',
      children: (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Card style={{ background: '#f8f8f8' }}>
              <Statistic
                title={<span style={{ color: goldColor.darker }}>Income</span>}
                value={1700}
                precision={2}
                valueStyle={{ color: green[5] }}
                prefix={<ArrowUpOutlined />}
                suffix="USD"
              />
            </Card>
            <Card style={{ background: '#f8f8f8' }}>
              <Statistic
                title={<span style={{ color: goldColor.darker }}>Expenses</span>}
                value={45}
                precision={2}
                valueStyle={{ color: red[5] }}
                prefix={<ArrowDownOutlined />}
                suffix="USD"
              />
            </Card>
          </div>
        </motion.div>
      ),
    },
  ];

  return (
    <motion.div
      initial={false}
      style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white' }}>
              <WalletOutlined />
              <span>My Wallet</span>
            </div>
          }
          extra={
            <Statistic
              value={2450}
              precision={2}
              suffix="USD"
              valueStyle={{ color: 'white' }}
            />
          }
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ 
            cursor: 'pointer',
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
          headStyle={{ 
            background: goldColor.primary,
            borderBottom: `1px solid ${goldColor.darker}`
          }}
        >
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Tabs
                  defaultActiveKey="1"
                  items={tabItems}
                  animated={{ tabPane: true }}
                  style={{
                    '.ant-tabs-ink-bar': {
                      backgroundColor: goldColor.primary
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      <style jsx global>{`
        .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: ${goldColor.primary} !important;
        }
        .ant-tabs-ink-bar {
          background: ${goldColor.primary} !important;
        }
        .ant-card {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .ant-card:hover {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        .ant-list-item:hover {
          background: #f8f8f8;
          border-radius: 8px;
        }
      `}</style>
    </motion.div>
  );
};

export default WalletComponent;