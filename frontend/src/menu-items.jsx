import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { ReceiptIcon } from 'lucide-react';

const icons = {
  NavigationOutlinedIcon: NavigationOutlinedIcon,
  HomeOutlinedIcon: HomeOutlinedIcon,
  ChromeReaderModeOutlinedIcon: ChromeReaderModeOutlinedIcon,
  HelpOutlineOutlinedIcon: HelpOutlineOutlinedIcon,
  SecurityOutlinedIcon: SecurityOutlinedIcon,
  AccountTreeOutlinedIcon: AccountTreeOutlinedIcon,
  BlockOutlinedIcon: BlockOutlinedIcon,
  AppsOutlinedIcon: AppsOutlinedIcon,
  ContactSupportOutlinedIcon: ContactSupportOutlinedIcon
};

export default {
  items: [
    {
      id: 'navigation',
      type: 'group',
      title: 'Navigation',
      icon: icons['NavigationOutlinedIcon'],
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: icons['HomeOutlinedIcon'],
          url: '/dashboard'
        },

        {
          id: 'master-group',
          title: 'Masters',
          type: 'collapse',
          icon: GridViewIcon,
          children: [
            // {
            //   id: 'type-of-client',
            //   title: 'Type Of Client',
            //   icon: PeopleIcon,
            //   type: 'item',
            //   url: '/type-of-client'
            // },
            {
              id: 'position',
              title: 'Position',
              type: 'item',
              icon: ManageAccountsIcon,
              url: '/master/position'
            },
            {
              id: 'departments',
              title: 'Department',
              type: 'item',
              icon: AccountTreeIcon,
              url: '/master/departments'
            }
          ]
        },

        // {
        //   id: 'contacts',
        //   title: 'Contacts',
        //   type: 'item',
        //   icon: ContactsIcon,
        //   url: '/contacts'
        // },

        {
          id: 'client',
          title: 'Client',
          type: 'item',
          icon: PersonIcon,
          url: '/super-admin-client'
        },

        {
          id: 'invoice-management-group',
          title: 'Invoice Management',
          type: 'collapse',
          icon: PeopleIcon,
          children: [
            {
              id: 'Invoice',
              title: 'Invoice',
              icon: ReceiptIcon,
              type: 'item',
              url: '/invoice-management'
            },
            {
              id: 'Invoice-report',
              title: 'Invoice Report',
              icon: ReceiptIcon,
              type: 'item',
              url: '/invoice-report'
            },
            {
              id: 'GST-report',
              title: 'GST Report',
              icon: ReceiptIcon,
              type: 'item',
              url: '/gst-report'
            },
            {
              id: 'invoice-analytical-report',
              title: 'Analytical Report',
              icon: ReceiptIcon,
              type: 'item',
              url: '/invoice-analytical-report'
            }
          ]
        }
      ]
    }
  ]
};
