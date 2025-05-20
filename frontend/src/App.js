import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AdminLogin from "./BaseFile/Pages/AdminLogin";
import AdminMenu from "./BaseFile/AdminFiles/AdminMenu";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminRefferal from "./Admin/AdminRefferal";
import RefferalTree from "./Admin/RefferalTree";
import AdminPlan from "./Admin/AdminPlan";
import AdminUserList from "./Admin/AdminUserList";
import AdminActPlan from "./Admin/AdminActPlan";
import AdminEditActPlan from "./Admin/AdminEditActPlan";
import AdminSupport from "./Admin/AdminSupport";
import AdminLevel from "./Admin/AdminLevel";
import AdminPendingWidhdrawalRequest from "./Admin/AdminPendingWidhdrawalRequest";
import AdminRewards from "./Admin/AdminRewards";
import AdminProfile from "./Admin/AdminProfile";
import {Register} from "./AuthAccount/Register";
import UserProfile from "./User/UserProfile";
import AdminAddPlan from "./Admin/AdminAddPlan";
import AdminAddActPlan from "./Admin/AdminAddActPlan";
import AdminEditPlan from "./Admin/AdminEditPlan";
import UserAddSupport from "./User/UserAddSupport";
import UserAddWithdrawal from "./User/AddWithdrawal";
import UserDashboard from "./User/UserDashboard";
import UserMenu from "./BaseFile/UserFIles/UserMenu";
import AdminDeposite from "./Admin/AdminDeposite";
import UserDeposite from "./User/UserDeposite";
import UserDirectMember from "./User/UserDirectMember";
import UserReferralTree from "./User/UserReferralTree";

import UserPlan from "./User/UserPlan";
import AdminIncome from "./Admin/AdminIncome";
import UserIncome from "./User/UserIncome";
import AdminPrivateRoute from "./BaseFile/AdminFiles/AdminPrivateRoutes";
import UserPrivateRoute from "./BaseFile/UserFIles/UserPrivateRoutes";
import AdminReport from "./Admin/AdminReport";
import AdminSetting from "./Admin/AdminSetting";
import AdminUserCheck from "./Admin/AdminUserCheck";
import NotificationForm from "./Admin/NotificationForm";
import NotificationTable from "./Admin/NotificationTable";
import AdminTopup from "./Admin/AdminTopup";
import AdminTopupDetail from "./Admin/AdminTopupDetail";
import UserTopup from "./User/UserTopup";
import UserRetopup from "./User/UserRetopup"
import AdminQrLink from "./Admin/AdminQRLink";
import UserIncomeTransaction from "./User/UserIncomeTransaction";
import AdminLeadership from "./Admin/AdminLeadership";
import UserLeadershipTransaction from "./User/UserLeadership";
// import HeroSection from "./Blackbot/HeroSection";
import UserRewardDetail from "./User/UserRewardDetail";
import NotificationList from "./User/NotificationList";
import AdminCompoundWIthRequest from "./Admin/AdminCompoundWIthRequest";
import AdminRoiWithReq from "./Admin/AdminRoiWithReq";
import Transfer from "./User/Transfer";
import TopData from "./User/TopData";
import WalletTransaction from "./User/WalletTransaction";
import {Home} from "./HomeFile/Home"
import {Contact} from "./HomeFile/StaticsPage/Contact"
import {Privacy} from "./HomeFile/StaticsPage/Privacy"
import {Terms} from "./HomeFile/StaticsPage/Terms"
import {About} from "./HomeFile/StaticsPage/About"
import AdminAchiver from "./Admin/AdminAchiver";
import ForgotPassword from "./BaseFile/Pages/ForgotPassword";
import AdminCto from "./Admin/AdminCto";
import DefaulterUsers from "./Admin/DefaulterUsers";
import OfferForm from "./Admin/OfferForm";
import AllTransactionsTable from "./Admin/RewardTransaction";
import OffersListComponent from "./Admin/Offers";
import { UserTransactionsTable } from "./User/UserRewardTransaction";
import OfferDetails from "./Admin/OfferDetails";
import useAutoLogout from './hooks/useAutoLogout'
import RewardsPage from "./User/UserRewards";
import RewardsList from "./Admin/RewardsList";
import AdminSalaryDashboard from "./Admin/AdminSalaryDashboard";
import TodaySalaryStats from "./Admin/TodaySalaryStats";
import TicketsTable from "./Admin/tickets/TicketsTable";
import TicketChat from "./Admin/tickets/TicketChat";
import SalaryTransactionsTable from "./Admin/SalariesTransaction";
import UserSalariesTable from "./User/UserSalariesTable";
// import { Service } from "./HomeFile/StaticsPage/Service";
import { UserTreadingChart } from "./User/UserTreadingChart";
import TradeTransaction from "./User/TradeTransactions";
import AdminPrWithReq from "./Admin/AdminPrWithReq";
import Registration from "./BaseFile/Pages/Registration";
import MyTransactions from "./User/MyTransactions";
import AddQuery from "./User/query/AddQuery";
import QueryChat from "./User/query/QueryChat";
import QueryList from "./User/query/QueryList";
import Market from "./User/Market";
import Trade from "./User/Trade";
import Service from "./HomeFile/StaticsPage/Service";
import Login from "./BaseFile/Pages/Login";
function App() {
  useAutoLogout()  
  return (
    <Router>
      <Routes>
        <Route path="/register" element={ <Registration/>}/>
        <Route path="/user/login" element={ <Login/>}/>
               
        <Route path="/" element={ <Home/>}/>
        <Route path="/contact-us" element={ <Contact/>}/>
        <Route path="/terms" element={ <Terms/>}/>
        <Route path="/privacy" element={ <Privacy/>}/>
        <Route path="/about-us" element={ <About/>}/>
        <Route path="/services" element={ <Service/>}/>

        {/* <Route path="/Service" element={ <Service/>}/> */}
        <Route path="/Admin/login" element={ <AdminLogin/>}/>
        <Route path="/reset-password/:token" element={ <ForgotPassword/>}/>
        <Route path="/" element={<AdminPrivateRoute/>}>
        <Route path="/admin/dashboard" element={ <AdminMenu Children={<AdminDashboard/>} PageName={"DashBoard"}/>}/>
        <Route path="/admin/cto" element={ <AdminMenu Children={<AdminCto/>} PageName={"CTO"}/>}/>
        <Route path="/admin/refferal-table/:referral_code" element={ <AdminMenu Children={<AdminRefferal/>} PageName={"Refferal Table"}/>}/>
        <Route path="/admin/refferal/:referral_code" element={ <AdminMenu Children={<RefferalTree/>} PageName={"Refferal Table"}/>}/>
        <Route path="/admin/membership/plan" element={ <AdminMenu Children={<AdminPlan/>} PageName={"Investment Plan"}/>}/>
        <Route path="/admin/activation/plan" element={ <AdminMenu Children={<AdminActPlan/>} PageName={"Activation Plan"}/>}/>
        <Route path="/admin/user/:action" element={ <AdminMenu Children={<AdminUserList/>} PageName={"User"}/>}/>
        <Route path="/admin/support" element={ <AdminMenu Children={<AdminSupport/>} PageName={"Support"}/>}/>
        <Route path="/admin/reward-plans" element={ <AdminMenu Children={<RewardsList/>} PageName={"Rewards List"}/>}/>
        <Route path="/admin/salary-transactions"   element={ <AdminMenu Children={<SalaryTransactionsTable/>} PageName={"Salaries"}/>} />
        <Route path="/admin/salary-analysis"   element={ <AdminMenu Children={<AdminSalaryDashboard/>} PageName={"Salary Anylysis"}/>}/>
        <Route path="/admin/salary-today"  element={ <AdminMenu Children={<TodaySalaryStats/>} PageName={"Todays Salaries"}/>} />
        <Route path="/admin/tickets"  element={ <AdminMenu Children={<TicketsTable/>} PageName={"Tickets"}/>} />
        <Route path="/admin/ticket/:ticketId"  element={ <AdminMenu Children={<TicketChat/>} PageName={"Ticket Details"}/>} />
        <Route path="/admin/level" element={ <AdminMenu Children={<AdminLevel/>} PageName={"Level"}/>}/>
        <Route path="/admin/pending-withdrawal-request" element={ <AdminMenu Children={<AdminPendingWidhdrawalRequest/>} PageName={"Pending Withdrawal Request"}/>}/>
        <Route path="/admin/pending-withdrawal-request/:action" element={ <AdminMenu Children={<AdminPendingWidhdrawalRequest/>} PageName={"Pending Withdrawal Request"}/>}/>
        <Route path="/admin/compound-pending-withdrawal-request" element={ <AdminMenu Children={<AdminCompoundWIthRequest/>} PageName={"Pending Compound Withdrawal Request"}/>}/>
        <Route path="/admin/roi-pending-withdrawal-request" element={ <AdminMenu Children={<AdminRoiWithReq/>} PageName={"Pending ROI Withdrawal Request"}/>}/>
        <Route path="/admin/pending-principle-withdrawal-request" element={ <AdminMenu Children={<AdminPrWithReq/>} PageName={"Pending ROI Withdrawal Request"}/>}/>
        <Route path="/admin/rewards" element={ <AdminMenu Children={<AdminRewards/>} PageName={"Rewards"}/>}/>
        <Route path="/admin/deposite" element={ <AdminMenu Children={<AdminDeposite/>} PageName={"Deposite"}/>}/>
        <Route path="/admin/deposite/:action" element={ <AdminMenu Children={<AdminDeposite/>} PageName={"Deposite"}/>}/>
        <Route path="/admin/profile" element={ <AdminMenu Children={<AdminProfile/>} PageName={"Admin Profile"}/>}/>
        <Route path="/admin/addplan" element={ <AdminMenu Children={<AdminAddPlan/>} PageName={"Add Plan"}/>}/>
        <Route path="/admin/addactplan" element={ <AdminMenu Children={<AdminAddActPlan/>} PageName={"Add Activation Plan"}/>}/>
        <Route path="/admin/editplan/:id" element={ <AdminMenu Children={<AdminEditPlan/>} PageName={"Edit investment Plan"}/>}/>
        <Route path="/admin/editactplan/:id" element={ <AdminMenu Children={<AdminEditActPlan/>} PageName={"Edit activation Plan"}/>}/>
        <Route path="/admin/income" element={ <AdminMenu Children={<AdminIncome/>} PageName={"Income"}/>}/>
        <Route path="/admin/reports" element={ <AdminMenu Children={<AdminReport/>} PageName={"Report"}/>}/>
        <Route path="/admin/settings" element={ <AdminMenu Children={<AdminSetting/>} PageName={"Settings"}/>}/>
        <Route path="/admin/check/profile/:id" element={ <AdminMenu Children={<AdminUserCheck/>} PageName={"User Profile"}/>}/>
        <Route path="/admin/topup" element={ <AdminMenu Children={<AdminTopup/>} PageName={"Topup"}/>}/>
        <Route path="/admin/topup/detail/:id" element={ <AdminMenu Children={<AdminTopupDetail/>} PageName={"Topup Detail"}/>}/>
        <Route path="/admin/qr/Link" element={ <AdminMenu Children={<AdminQrLink/>} PageName={"QR Link"}/>}/>
        <Route path="/admin/leadership" element={ <AdminMenu Children={<AdminLeadership/>} PageName={"leadership Income"}/>}/>
        <Route path="/admin/notification" element={ <AdminMenu Children={<NotificationForm/>} PageName={"Notification Form"}/>}/>
        <Route path="/admin/notification/list" element={ <AdminMenu Children={<NotificationTable/>} PageName={"Notification Table"}/>}/>
        <Route path="/admin/achivers" element={ <AdminMenu Children={<AdminAchiver/>} PageName={"Achivers Table"}/>}/>
        <Route path="/admin/defaulter" element={ <AdminMenu Children={<DefaulterUsers/>} PageName={"Defaulter Users"}/>}/>
        <Route path="/admin/reward-transactions" element={ <AdminMenu Children={<AllTransactionsTable/>} PageName={"Reward Transaction"}/>}/>
        <Route path="/admin/offers/:offerId" element={ <AdminMenu Children={<OfferDetails/>} PageName={"Reward Transaction"}/>}/>
        
        </Route>
        <Route path="/" element={<UserPrivateRoute/>}>
        <Route path="/user/profile/:id" element={ <UserMenu Children={<UserProfile/>} PageName={"User Profile"}/>}/>
        <Route path="/user/sendsupport" element={ <UserMenu Children={<UserAddSupport/>} PageName={"Send Message"}/>}/>
        <Route path="/user/withdrawal" element={ <UserMenu Children={<UserAddWithdrawal/>} PageName={"Withdrawal Request"}/>}/>
        <Route path="/user/deposit" element={ <UserMenu Children={<UserDeposite/>} PageName={"Deposit"}/>}/>
        <Route path="/user/dashboard" element={ <UserMenu Children={<UserDashboard/>} PageName={"User Dashboard"}/>}/>
        <Route path="/user/market" element={ <UserMenu Children={<Market/>} PageName={"User Treading Chart"}/>}/>
        <Route path="/user/trade" element={ <UserMenu Children={<Trade/>} PageName={"Trade"}/>}/>
        <Route path="/user/direct-members" element={ <UserMenu Children={<UserDirectMember/>} PageName={"Direct Member"}/>}/>
        <Route path="/user/refferral-tree" element={ <UserMenu Children={<UserReferralTree/>} PageName={"Refferal Tree"}/>}/>
        <Route path="/user/plan" element={ <UserMenu Children={<UserPlan/>} PageName={"User Plan"}/>}/>
        <Route path="/user/income" element={ <UserMenu Children={<UserIncome/>} PageName={"Income "}/>}/>
        <Route path="/user/topup" element={ <UserMenu Children={<UserTopup/>} PageName={"Topup "}/>}/>
        <Route path="/user/re-topup" element={ <UserMenu Children={<UserRetopup/>} PageName={"ReTop-Up "}/>}/>
        <Route path="/user/transaction/:table_name/:fit" element={ <UserMenu Children={<UserIncomeTransaction/>} PageName={"income "}/>}/>
        <Route path="/user/transaction/roi_transaction/invest" element={ <UserMenu Children={<TradeTransaction/>} PageName={"income "}/>}/>
        <Route path="/user/transaction/reward-transaction" element={ <UserMenu Children={<UserTransactionsTable/>} PageName={"income "}/>}/>
        <Route path="/transactions/:source"  element={ <UserMenu Children={<MyTransactions/>} PageName={"Transaction "}/>}/>sss
        <Route path="/user/transaction/:table_name" element={ <UserMenu Children={<UserIncomeTransaction/>} PageName={"income "}/>}/>
        <Route path="/user/leadership" element={ <UserMenu Children={<UserLeadershipTransaction/>} PageName={"Leadership Transaction"}/>}/>
        {/* <Route path="/user/transaction/leadership" element={ <UserMenu Children={<UserIncomeTransaction/>} PageName={"Transaction"}/>}/> */}
        <Route path="/user/reward/detail" element={ <UserMenu Children={<UserRewardDetail/>} PageName={"Reward Detail"}/>}/>
        <Route path="/user/transfer" element={ <UserMenu Children={<Transfer/>} PageName={"transfer fund"}/>}/>
        <Route path="/user/top" element={ <UserMenu Children={<TopData/>} PageName={"transfer fund"}/>}/>
        <Route path="/user/notification" element={ <UserMenu Children={<NotificationList/>} PageName={"Notification List"}/>}/>
        <Route path="/user/dep" element={ <UserMenu Children={<WalletTransaction/>} PageName={"Notification List"}/>}/>
        {/* <Route path="/user/reward" element={ <UserMenu Children={<UserRewardDetail/>} PageName={"Reward List"}/>}/> */}
        <Route path="/user/rewards" element={ <UserMenu Children={<RewardsPage/>} PageName={"Reward List"}/>}/>
        <Route path="/user/salary-transactions" element={ <UserMenu Children={<UserSalariesTable/>} PageName={"Reward List"}/>}/>
        <Route path="/user/queries" element={ <UserMenu Children={<QueryList/>} PageName={"Queries"}/>}/>
        <Route path="/user/queries/:ticketId" element={ <UserMenu Children={<QueryChat/>} PageName={"Query Details"}/>}/>
        <Route path="/user/query/create" element={ <UserMenu Children={<AddQuery/>} PageName={"Have a question?"}/>}/>
    
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
