import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ContactsIcon from '@mui/icons-material/Contacts';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import LinkIcon from '@mui/icons-material/Link';
import CategoryIcon from '@mui/icons-material/Category';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ClassIcon from '@mui/icons-material/Class';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PolicyIcon from '@mui/icons-material/Policy';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { id } from 'google-translate-api-extended/languages';
import {
  Money,
  MoneyOffRounded,
  MoneyTwoTone,
  NetworkCell,
  NetworkCheck,
  NetworkPing,
  NetworkWifi,
  NetworkWifi1BarOutlined,
  NetworkWifiOutlined,
  NumbersOutlined,
  StackedBarChart,
  ConfirmationNumber,
  AssignmentTurnedIn
} from '@mui/icons-material';
import { MdMoney } from 'react-icons/md';
import { IoMdGitNetwork } from 'react-icons/io';
import StatusBoxes from 'views/master/frontOffice-setup/OPD-Dashboard/components/StatusBoxes';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import Priority from 'views/master/Priority/Priority';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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

// ==============================||ADMIN MENU ITEMS ||============================== //

// eslint-disable-next-line
export default {
  items: [
    {
      id: 'All ',
      type: 'group',
      title: '',
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
          id: 'company-settings',
          title: 'Company Settings',
          type: 'item',
          icon: RoomPreferencesIcon,
          url: '/company-settings'
        },
        {
          id: 'master-group',
          title: 'Masters',
          type: 'collapse',
          icon: GridViewIcon,
          children: [
            {
              id: 'master-group',
              title: 'Genral Master',
              type: 'collapse',
              icon: GridViewIcon,
              children: [
                {
                  id: 'financial-year',
                  title: 'Financial Year',
                  type: 'item',
                  icon: AccountTreeIcon,
                  url: '/master/financial-year'
                },
                {
                  id: 'gst-percentage',
                  title: 'GST Rates',
                  type: 'item',
                  icon: AttachMoneyIcon,
                  url: '/master/gst-percentage'
                },
                {
                  id: 'product-or-service-category',
                  title: 'Product',
                  type: 'item',
                  icon: ShoppingCartIcon,
                  url: '/master/product-or-service-category'
                },
                {
                  id: 'sub-product-category',
                  title: 'Sub Product',
                  type: 'item',
                  icon: ShoppingCartCheckoutIcon,
                  url: '/master/sub-product-category'
                },
                {
                  id: 'payment-mode',
                  title: 'Payment Mode',
                  type: 'item',
                  icon: AccountTreeIcon,
                  url: '/master/payment-mode'
                },

                {
                  id: 'bank-details',
                  title: 'Bank Details',
                  type: 'item',
                  icon: AccountBalanceIcon,
                  url: '/master/bank-details'
                }
              ]
            },
            {
              id: 'master-group',
              title: 'Branch Master',
              type: 'collapse',
              icon: GridViewIcon,
              children: [
                {
                  id: 'broker-code',
                  title: 'Branch Code',
                  type: 'item',
                  icon: TrendingUpIcon,
                  url: '/master/broker-branch'
                },
                {
                  id: 'broker',
                  title: 'Broker Name',
                  type: 'item',
                  icon: TrendingUpIcon,
                  url: '/master/broker-name'
                },
                {
                  id: 'broker',
                  title: 'Broker Branch',
                  type: 'item',
                  icon: TrendingUpIcon,
                  url: '/master/branch-broker'
                },
                {
                  id: 'broker-rate',
                  title: 'Broker Rate',
                  type: 'item',
                  icon: TrendingUpIcon,
                  url: '/master/broker-rate'
                }
              ]
            },
            {
              id: 'master-group',
              title: 'Customer Master',
              type: 'collapse',
              icon: GridViewIcon,
              children: [
                {
                  id: 'customer-group',
                  title: 'Customer Group (Corporate)',
                  type: 'item',
                  icon: ClassIcon,
                  url: '/master/customer-group'
                },
                {
                  id: 'subcustomer-group',
                  title: 'Sub Customer Group (Corporate)',
                  type: 'item',
                  icon: TrendingUpIcon,
                  url: '/master/subcustomer-group'
                }
              ]
            },
            {
              id: 'master-group',
              title: 'Insurance Master',
              type: 'collapse',
              icon: GridViewIcon,
              children: [
                {
                  id: 'insurance-company',
                  title: 'Insurance Company',
                  type: 'item',
                  icon: AccountBalanceIcon,
                  url: '/master/insurance-company'
                },
                {
                  id: 'departments',
                  title: 'INS Department',
                  type: 'item',
                  icon: AccountTreeIcon,
                  url: '/master/ins-department'
                },
                {
                  id: 'endorsement',
                  title: 'Endorsement',
                  type: 'item',
                  icon: AccountTreeIcon,
                  url: '/master/endorsement'
                },

                {
                  id: 'fuel-type',
                  title: 'Fuel Type',
                  type: 'item',
                  icon: AccountTreeIcon,
                  url: '/master/fuel-type'
                },

                {
                  id: 'license-validity',
                  title: 'LIcense Validity',
                  type: 'item',
                  icon: AttachMoneyIcon,
                  url: '/master/license-validity'
                },
                {
                  id: 'marine-clauses',
                  title: 'Marine Cargo Clause',
                  type: 'item',
                  icon: AccountTreeIcon,
                  url: '/master/marine-clauses'
                },
                {
                  id: 'incoterms',
                  title: 'Incoterms',
                  type: 'item',
                  icon: AccountTreeIcon,
                  url: '/master/incoterms'
                },
                {
                  id: 'other-addons',
                  title: 'Other Addons',
                  type: 'item',
                  icon: AccountTreeIcon,
                  url: '/master/otherAddon'
                },
                {
                  id: 'type-of-vehicle',
                  title: 'Type of Vehicle',
                  type: 'item',
                  icon: AccountTreeIcon,
                  url: '/master/type-of-vehicle'
                },
                {
                  id: 'risk-code',
                  title: 'Risk Code',
                  type: 'item',
                  icon: AccountTreeIcon,
                  url: '/master/risk-code'
                }
              ]
            },
            {
              id: 'master-group',
              title: 'HR Master',
              type: 'collapse',
              icon: GridViewIcon,
              children: [
                {
                  id: 'staff-departments',
                  title: 'Staff Department',
                  type: 'item',
                  icon: AccountTreeIcon,
                  url: '/master/departments'
                },
                {
                  id: 'staff-position',
                  title: 'Staff Position',
                  type: 'item',
                  icon: AccountTreeIcon,
                  url: '/master/position'
                },
                {
                  id: 'prefix',
                  title: 'Prefix',
                  type: 'item',
                  icon: NumbersOutlined,
                  url: '/master/prefix'
                },
                {
                  id: 'leave-type',
                  title: 'Leave Type',
                  type: 'item',
                  icon: BeachAccessIcon,
                  url: '/master/leave-type'
                }
              ]
            },

            {
              id: 'lead-stauts',
              title: 'Lead Status',
              type: 'item',
              icon: HourglassEmptyIcon,
              url: '/master/lead-status'
            },
            {
              id: 'lead-reference',
              title: 'Lead Reference',
              type: 'item',
              icon: LinkIcon,
              url: '/master/lead-reference'
            },
            //  {
            //   id: 'lead-stage',
            //   title: 'Lead Stage',
            //   type: 'item',
            //   icon: TrendingUpIcon,
            //   url: '/master/lead-stage',
            // },
            {
              id: 'lead-type',
              title: 'Lead Type',
              type: 'item',
              icon: CategoryIcon,
              url: '/master/lead-type'
            },
            // {
            //   id: 'category-of-organtion',
            //   title: 'Category Of Organisation',
            //   type: 'item',
            //   icon: ClassIcon,
            //   url: '/master/category-of-organtion',
            // },
            // {
            //   id: 'profession',
            //   title: 'Profession',
            //   type: 'item',
            //   icon: BusinessCenterIcon,
            //   url: '/master/profession',
            // },
            {
              id: 'holiday-type',
              title: 'Holiday Type',
              type: 'item',
              icon: AttachMoneyIcon,
              url: '/master/holiday-type'
            },
            {
              id: 'Holiday',
              title: 'Holiday',
              type: 'item',
              icon: AttachMoneyIcon,
              url: '/master/holiday'
            },
            // {
            //   id: 'position',
            //   title: 'Staff Position',
            //   type: 'item',
            //   icon: ManageAccountsIcon,
            //   url: '/master/position'
            // },
            // {
            //   id: 'network',
            //   title: 'Network',
            //   type: 'item',
            //   icon: NetworkWifiOutlined,
            //   url: '/master/network'
            // },
            // {
            //   id: 'salary-income-head',
            //   title: 'Salary Income Head',
            //   type: 'item',
            //   icon: Money,
            //   url: '/master/salary-income-head'
            // },
            // {
            //   id: 'status',
            //   title: 'Status',
            //   type: 'item',
            //   icon: StackedBarChart,
            //   url: '/master/status'
            // },
            // {
            //   id: 'Ticket Status',
            //   title: 'Ticket Status',
            //   type: 'item',
            //   icon: ConfirmationNumber,
            //   url: '/master/ticket-status'
            // },
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
          id: 'hr-group',
          title: 'HR',
          type: 'collapse',
          icon: AdminPanelSettingsIcon,
          children: [
            {
              id: 'users',
              title: 'Users',
              type: 'collapse',
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
            },
            {
              id: 'attendance-list',
              title: 'Attendance',
              type: 'item',
              url: '/hr/attendance-list',
              target: false
            },
            {
              id: 'leave-management',
              title: 'Leave Manager',
              type: 'item',
              url: '/hr/leave-management', // Define the new route here
              target: false
            }
          ]
        },
        {
          id: 'contacts',
          title: 'Contacts',
          type: 'item',
          icon: ContactsIcon,
          url: '/contacts'
        },

        // {
        //     id: 'company',
        //     title: 'Company',
        //     type: 'item',
        //     icon: ManageSearchIcon,
        //     url: '/company',
        // },

        // {
        //   id: 'prospects',
        //   title: 'Prospects',
        //   type: 'item',
        //   icon: ManageSearchIcon,
        //   url: '/prospects'
        // },
        // {
        //   id: 'task-manager',
        //   title: 'Task Management',
        //   type: 'item',
        //   icon: ManageSearchIcon,
        //   url: '/task-manager'
        // },
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
              url: '/lead-management/lead', // Define the new route here
              target: false
            },
            {
              id: 'parametric-report',
              title: 'Parametric Report',
              type: 'item',
              url: '/lead-management/parametric-report', // Define the new route here
              target: false
            },
            {
              id: 'analytical-report',
              title: 'Analytical Report',
              type: 'item',
              url: '/lead-management/analytical-report',
              target: false
            },
            {
              id: 'pipeline',
              title: 'Pipeline',
              type: 'item',
              url: '/pipeline',
              target: false
            }
          ]
        },
        // {
        //     id: 'Inventory',
        //     title: 'Inventory',
        //     icon: AppsOutlinedIcon,
        //     type: 'item',
        //     url: '/inventory',
        // },
        // {
        //   id: 'ticket-management',
        //   title: 'Ticket Management',
        //   type: 'item',
        //   icon: ContactSupportOutlinedIcon,
        //   url: '/ticket-management'
        // },
        // {
        //   id: 'client',
        //   title: 'Client',
        //   type: 'item',
        //   icon: PersonIcon,
        //   url: '/client'
        // },
        {
          id: 'customer',
          title: 'Customer',
          type: 'item',
          icon: PersonIcon,
          url: '/customer'
        },
        {
          id: 'policy-management',
          title: 'Policy Management',
          type: 'collapse',
          icon: PolicyIcon,
          children: [
            {
              id: 'policy-list',
              title: 'Policy List',
              type: 'item',
              icon: PeopleIcon,
              url: '/policy'
            },

            {
              id: 'unbilled-policy',
              title: 'Unbilled Brokerage',
              type: 'item',
              icon: PeopleIcon,
              url: '/policy/unbilled-policy'
            },

            {
              id: 'billed-policy',
              title: 'Billed Policies',
              type: 'item',
              icon: PeopleIcon,
              url: '/policy/billed-policy'
            }
          ]
        },
        {
          id: 'renewal-management',
          title: 'Renewal Management',
          type: 'collapse',
          icon: AutorenewIcon,
          children: [
            {
              id: 'renewal-reminder',
              title: 'Renewal Reminder',
              type: 'item',
              icon: PeopleIcon,
              url: '/renewal/renewal-reminder'
            },
            {
              id: 'pdf-extraction',
              title: 'Policy Extractor',
              type: 'item',
              icon: ChromeReaderModeOutlinedIcon,
              url: '/renewal/pdf-extraction'
            }
            // {
            //   id: 'renewal-due',
            //   title: 'Renewal Due',
            //   type: 'item',
            //   icon: PeopleIcon,
            //   url: '/renewal/renewal-due'
            // },

            // {
            //   id: 'renewal-done',
            //   title: 'Renewal Done',
            //   type: 'item',
            //   icon: PeopleIcon,
            //   url: '/renewal/renewal-done'
            // },

            // {
            //   id: 'message-trigger',
            //   title: 'Message Trigger',
            //   type: 'item',
            //   icon: PeopleIcon,
            //   url: '/renewal/message-trigger'
            // }
          ]
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
        },
        // {
        //   id: 'calander',
        //   title: 'Calander',
        //   type: 'item',
        //   icon: ManageSearchIcon,
        //   url: '/calander'
        // },
        {
          id: 'reports',
          title: 'Reports',
          type: 'collapse',
          icon: AssessmentIcon,
          children: [
            {
              id: 'parametric-report',
              title: 'Parametric Report',
              type: 'item',
              icon: PeopleIcon,
              url: '/report/parametric-report'
            },

            {
              id: 'analytical-report',
              title: 'Analytical Report',
              type: 'item',
              icon: AssessmentIcon,
              url: '/report/analytical-report'
            },

            {
              id: 'irdia-report',
              title: 'IRDIA Report',
              type: 'item',
              icon: PeopleIcon,
              url: '/report/irdai-report'
            }
          ]
        }

        //  {
        //   id:'pipeline',
        //   title: 'pipeline',
        //   type:'item',
        //    icon: AutoAwesomeIcon,
        //   url:'/pipeline'
        // },
      ]
    }
  ]
};
