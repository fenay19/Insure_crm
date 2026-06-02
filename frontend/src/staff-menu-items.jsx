import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GridViewIcon from '@mui/icons-material/GridView';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import LinkIcon from '@mui/icons-material/Link';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CategoryIcon from '@mui/icons-material/Category';
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import NetworkWifiOutlinedIcon from '@mui/icons-material/NetworkWifiOutlined';
import MoneyIcon from '@mui/icons-material/Money';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import PersonIcon from '@mui/icons-material/Person';
import ContactsIcon from '@mui/icons-material/Contacts';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import { AssignmentTurnedIn, ConfirmationNumber } from '@mui/icons-material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const staffMenuIems = {
  items: [
    {
      id: 'navigation',
      type: 'group',
      title: 'Navigation',
      icon: NavigationOutlinedIcon,
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: HomeOutlinedIcon,
          url: '/dashboard'
        },
        {
          id: 'master-group',
          title: 'Masters',
          type: 'collapse',
          icon: GridViewIcon,
          children: [
            {
              id: 'bank-details',
              title: 'Bank Details',
              type: 'item',
              icon: AccountBalanceIcon,
              url: '/master/bank-details'
            },
            {
              id: 'product-or-service-category',
              title: 'Product Category',
              icon: ShoppingCartIcon,
              type: 'item',
              url: '/master/product-or-service-category'
            },
            {
              id: 'sub-product-category',
              title: 'Sub Product Category',
              icon: ShoppingCartCheckoutIcon,
              type: 'item',
              url: '/master/sub-product-category'
            },
            {
              id: 'leave-type',
              title: 'Leave Type',
              icon: BeachAccessIcon,
              type: 'item',
              url: '/master/leave-type'
            },
            {
              id: 'lead-reference',
              title: 'Lead Reference',
              icon: LinkIcon,
              type: 'item',
              url: '/master/lead-reference'
            },
            {
              id: 'lead-stauts',
              title: 'Lead Status',
              type: 'item',
              icon: HourglassEmptyIcon,
              url: '/master/lead-status'
            },
            {
              id: 'lead-type',
              title: 'Lead Type',
              icon: CategoryIcon,
              type: 'item',
              url: '/master/lead-type'
            },
            {
              id: 'prefix',
              title: 'Prefix',
              type: 'item',
              icon: NumbersOutlinedIcon,
              url: '/master/prefix'
            },
            {
              id: 'gst-percentage',
              title: 'GST Percentage',
              type: 'item',
              icon: AttachMoneyIcon,
              url: '/master/gst-percentage'
            },
            {
              id: 'Holiday',
              title: 'Holiday',
              type: 'item',
              icon: AttachMoneyIcon,
              url: '/master/holiday'
            },
            {
              id: 'holiday-type',
              title: 'Holiday Type',
              type: 'item',
              icon: AttachMoneyIcon,
              url: '/master/holiday-type'
            },
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
            },
            {
              id: 'network',
              title: 'Network',
              type: 'item',
              icon: NetworkWifiOutlinedIcon,
              url: '/master/network'
            },
            {
              id: 'salary-income-head',
              title: 'Salary Income Head',
              type: 'item',
              icon: MoneyIcon,
              url: '/master/salary-income-head'
            },
            {
              id: 'status',
              title: 'Status',
              type: 'item',
              icon: StackedBarChartIcon,
              url: '/master/status'
            },
            {
              id: 'Ticket Status',
              title: 'Ticket Status',
              type: 'item',
              icon: ConfirmationNumber,
              url: '/master/ticket-status'
            },
            {
              id: 'Task Status',
              title: 'Task Status',
              type: 'item',
              icon: AssignmentTurnedIn,
              url: '/master/task-status'
            },
            {
              id: 'Priority',
              title: 'Priority',
              type: 'item',
              icon: PriorityHighIcon,
              url: '/priority'
            }
          ]
        },
        {
          id: 'company-settings',
          title: 'Company Settings',
          type: 'item',
          icon: RoomPreferencesIcon,
          url: '/company-settings'
        },
        {
          id: 'client',
          title: 'Client',
          type: 'item',
          icon: PersonIcon,
          url: '/client'
        },
        {
          id: 'contacts',
          title: 'Contacts',
          type: 'item',
          icon: ContactsIcon,
          url: '/contacts'
        },
        {
          id: 'prospects',
          title: 'Prospects',
          type: 'item',
          icon: ManageSearchIcon,
          url: '/prospects'
        },
        {
          id: 'lead-management-group',
          title: 'Lead Management',
          type: 'collapse',
          icon: PeopleIcon,
          children: [
            {
              id: 'lead',
              title: 'Lead',
              type: 'item',
              url: '/lead-management/lead'
            },
            {
              id: 'parametric-report',
              title: 'Parametric Report',
              type: 'item',
              url: '/lead-management/parametric-report'
            },
            {
              id: 'analytical-report',
              title: 'Analytical Report',
              type: 'item',
              url: '/lead-management/analytical-report'
            }
          ]
        },
        {
          id: 'Invoice',
          title: 'Invoice',
          icon: ReceiptIcon, // Using the imported icon
          type: 'item',
          url: '/invoice-management'
        },
        {
          id: 'hr-group',
          title: 'HR',
          type: 'collapse',
          icon: AdminPanelSettingsIcon,
          children: [
            {
              id: 'attendance-list',
              title: 'Attendance',
              type: 'item',
              url: '/hr/attendance-list'
            },
            {
              id: 'leave-management',
              title: 'Leave Manager',
              type: 'item',
              url: '/hr/leave-management'
            },
            {
              id: 'users',
              title: 'Users',
              type: 'collapse',
              icon: PeopleIcon,
              children: [
                {
                  id: 'company-staff',
                  title: 'Staff',
                  type: 'item',
                  icon: PeopleIcon,
                  url: '/users/company-staff'
                },
                {
                  id: 'company-exstaff',
                  title: 'Ex Staff',
                  type: 'item',
                  icon: PeopleIcon,
                  url: '/users/company-exstaff'
                },
                {
                  id: 'company-staff-report',
                  title: 'Staff Report',
                  type: 'item',
                  icon: PeopleIcon,
                  url: '/users/company-staff-report'
                }
              ]
            }
          ]
        },
        {
          id: 'ticket-management',
          title: 'Ticket Management',
          type: 'item',
          icon: ContactSupportOutlinedIcon,
          url: '/ticket-management'
        },
        {
          id: 'task-manager',
          title: 'Task Management',
          type: 'item',
          icon: ManageSearchIcon,
          url: '/task-manager'
        },
        {
          id: 'pipeline',
          title: 'pipeline',
          type: 'item',
          icon: AutoAwesomeIcon,
          url: '/pipeline'
        }
      ]
    }
  ]
};

export default staffMenuIems;
