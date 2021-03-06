import React from 'react';

const Toaster = React.lazy(() => import('./views/notifications/toaster/Toaster'));
const Tables = React.lazy(() => import('./views/base/tables/Tables'));

const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/base/cards/Cards'));
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
const BasicForms = React.lazy(() => import('./views/base/forms/BasicForms'));

const Realestate = React.lazy(() => import('./views/real-estate/realestate'));
const AddRealestate = React.lazy(() => import('./views/real-estate/add-property/index'));

const Permissions = React.lazy(() => import('./views/powerful/permissions/permissions'));
const PermissionEdit = React.lazy(() => import('./views/powerful/permissions/edit'));
const Group = React.lazy(() => import('./views/powerful/group/group'));
const GroupEdit = React.lazy(() => import('./views/powerful/group/edit'));
const GroupUpdate = React.lazy(() => import('./views/powerful/group/update'));
const GroupUser = React.lazy(() => import('./views/powerful/group/group-user'));
const Approval = React.lazy(() => import('./views/powerful/approval/index'));
const ApprovalEdit = React.lazy(() => import('./views/powerful/approval/edit'));

const Cadastre = React.lazy(() => import('./views/expertise/cadastre/cadastre'));
const CadastreEdit = React.lazy(() => import('./views/expertise/cadastre/edit'));
const Justice = React.lazy(() => import('./views/expertise/justice/justice'));
const JusticeEdit = React.lazy(() => import('./views/expertise/justice/edit'));
const Valuation = React.lazy(() => import('./views/expertise/valuation/valuation'));
const ValuationEdit = React.lazy(() => import('./views/expertise/valuation/edit'));

const Attribute = React.lazy(() => import('./views/attribute/attribute'));
const AttributeMGR = React.lazy(() => import('./views/attribute/attribute-manager'));
// const Parents = React.lazy(() => import('./views/attribute/parents'));

const Utilities = React.lazy(() => import('./views/utilities/utilities'));

const Jumbotrons = React.lazy(() => import('./views/base/jumbotrons/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
const Navbars = React.lazy(() => import('./views/base/navbars/Navbars'));
const Navs = React.lazy(() => import('./views/base/navs/Navs'));
const Paginations = React.lazy(() => import('./views/base/paginations/Pagnations'));
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
const ProgressBar = React.lazy(() => import('./views/base/progress-bar/ProgressBar'));
const Switches = React.lazy(() => import('./views/base/switches/Switches'));

const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/buttons/brand-buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/buttons/button-dropdowns/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
const Charts = React.lazy(() => import('./views/charts/Charts'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
const Brands = React.lazy(() => import('./views/icons/brands/Brands'));
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
const Typography = React.lazy(() => import('./views/theme/typography/Typography'));
const Widgets = React.lazy(() => import('./views/widgets/Widgets'));
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/User'));

const routes = [
  { path: '/', exact: true, name: 'Trang ch???' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', name: 'Theme', component: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },

  { path: '/realestate', name: 'B???t ?????ng s???n', component: Realestate},
  { path: '/addrealestate', name: 'Th??m b???t ?????ng s???n', component: AddRealestate},

  { path: '/permissions', exact: true, name: 'Qu???n l?? ph??n quy???n', component: Permissions},
  { path: '/permissions/:PermissionId', exact: true, name: 'Ch???nh s???a quy???n', component: PermissionEdit},
  { path: '/group', exact: true, name: 'Qu???n l?? nh??m', component: Group},
  { path: '/group/:GroupNameId', exact: true, name: 'Ch???nh s???a nh??m', component: GroupEdit},
  { path: '/groupUpdate/:GroupNameId', exact: true, name: 'C???p nh???t quy???n', component: GroupUpdate},
  { path: '/groupuser', name: 'C???p quy???n User', component: GroupUser},
  { path: '/approval', exact: true, name: 'Qu???n l?? khu v???c', component: Approval},
  { path: '/approval/:ApprovalManagerId', exact: true, name: 'Ch???nh s???a khu v???c', component: ApprovalEdit},

  { path: '/cadastre', exact: true, name: '?????a ch??nh', component: Cadastre},
  { path: '/cadastre/:SellId', exact: true, name: 'Th???m ?????nh', component: CadastreEdit},
  { path: '/justice', exact: true, name: 'T?? ph??p', component: Justice},
  { path: '/justice/:SellId', exact: true, name: 'Th???m ?????nh', component: JusticeEdit},
  { path: '/valuation', exact: true, name: '?????nh gi??', component: Valuation},
  { path: '/valuation/:SellId', exact: true, name: 'Th???m ?????nh', component: ValuationEdit},

  { path: '/attributes', exact: true, name: '?????c ??i???m b???t ?????ng s???n', component: Attribute},
  { path: '/attributes/:AttributesId', exact: true, name: 'Qu???n l?? ?????c ??i???m', component: AttributeMGR},
  // { path: '/parents', name: 'Th??ng tin thu???c t??nh', component: Parents},

  { path: '/utilities', name: 'Ti???n ??ch b???t ?????ng s???n', component: Utilities},
  
  { path: '/base', name: 'Base', component: Cards, exact: true },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/forms', name: 'Forms', component: BasicForms },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/brands', name: 'Brands', component: Brands },
  { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/notifications/toaster', name: 'Toaster', component: Toaster },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/users', exact: true,  name: 'Ng?????i d??ng', component: Users },
  { path: '/users/:UserId', exact: true, name: 'Chi ti???t ng?????i d??ng', component: User }
];

export default routes;
