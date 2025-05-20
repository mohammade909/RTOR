import { Disclosure, Menu, MenuButton, MenuItems } from "@headlessui/react";
import { FaUserAlt } from "react-icons/fa";
import {
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  Bars3CenterLeftIcon,
  ClockIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  HomeIcon,
  ScaleIcon,
  UserGroupIcon,
  
} from "@heroicons/react/24/outline";
import { FaChartBar } from "react-icons/fa";
import { FaDirections } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { GiLevelEndFlag } from "react-icons/gi";
import { FcSupport } from "react-icons/fc";
import { RiPolaroid2Line } from "react-icons/ri";
import { SiFirewalla } from "react-icons/si";
import { PiHandWithdrawFill } from "react-icons/pi";
import { IoMdNotifications } from "react-icons/io";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { MdAccountTree } from "react-icons/md";
import { PiHandDepositFill } from "react-icons/pi";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoMdLogOut } from "react-icons/io";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signoutuser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { defaulterNotification, getUser } from "../../redux/userSlice";
import NotificationPopup from "../../User/NotificationPopup";
import RewardNotification from "../../User/RewardNotification";
import { FaRegUser } from "react-icons/fa";
import {
  CreditCard,
  DollarSign,
  Wallet,
  Timer,
  Clock,
  PiggyBank,
  TrendingUp,
  ChevronRightIcon,
  User,
  BarChart4,
  Trophy,
  HandCoins,
} from "lucide-react";
import Trading from "../../User/Trading";
export default function UserMenu({ Children, PageName }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const location = useLocation();
  const activeTabs = location.pathname;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [defaulternotification, setDefaulterNotification] = useState(false);
  const { auth } = useSelector((state) => state.auth);
  const { singleuser, userrewardnotification } = useSelector(
    (state) => state.allusers
  );

  const [tabs, setTabs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("Dashboard");
  const [currentTabs, setCurrentTabs] = useState(tabs?.[0]);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [timeRemaining2, setTimeRemaining2] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  useEffect(() => {
    dispatch(getUser(auth?.id));
    dispatch(defaulterNotification(auth?.id));
  }, [auth?.id]);

  useEffect(() => {
    if (userrewardnotification) {
      setDefaulterNotification(true);
    }
  }, [userrewardnotification]);

  function handleLogout() {
    dispatch(signoutuser());
    navigate("/");
  }
  function handleMenu(submenu, name) {
    setTabs(submenu);
    setCurrentMenu(name);
  }

  useEffect(() => {
    if (!singleuser?.created_at) return;
    const createdAtDate = new Date(singleuser.created_at);
    const referenceDate = new Date("2025-02-08T00:00:00Z"); // 7 Feb 2025 (UTC)
    if (createdAtDate < referenceDate) {
      setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const timerDuration = 7 * 24 * 60 * 60 * 1000; // 10 days in milliseconds
    const endDate = createdAtDate.getTime() + timerDuration;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const difference = endDate - now;

      if (difference <= 0) {
        clearInterval(timerInterval);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    const timerInterval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(timerInterval);
  }, [singleuser?.created_at]);

  useEffect(() => {
    if (!singleuser?.created_at) return;

    const createdAtDate = new Date(singleuser.created_at);
    const referenceDate = new Date("2025-02-08T00:00:00Z"); // 7 Feb 2025 (UTC)

    // If created_at is before 7th Feb 2025, stop the countdown
    if (createdAtDate < referenceDate) {
      setTimeRemaining2({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const timerDuration2 = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
    const endDate2 = createdAtDate.getTime() + timerDuration2;

    const calculateTimeRemaining2 = () => {
      const now = new Date().getTime();
      const difference2 = endDate2 - now;

      if (difference2 <= 0) {
        clearInterval(timerInterval2);
        setTimeRemaining2({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeRemaining2({
          days: Math.floor(difference2 / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference2 % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference2 % (1000 * 60)) / 1000),
        });
      }
    };

    const timerInterval2 = setInterval(calculateTimeRemaining2, 1000);
    return () => clearInterval(timerInterval2);
  }, [singleuser?.created_at]);

  function isClose() {
    setDefaulterNotification(false);
  }

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    else if (hour < 17) return "Good Afternoon";
    else return "Good Evening";
  };

  const income = [
    {
      name: "Trade Income",
      to: "/user/transaction/roi_transaction/Invest",
      icon: RiPolaroid2Line,
      submenu: [],
    },
    {
      name: "Direct",
      to: "/user/directmember",
      icon: FaDirections,
      submenu: [],
    },
    {
      name: "Level Commission",
      to: "/user/transaction/invest_level_transaction/invest",
      icon: GiLevelEndFlag,
      submenu: [],
    },
    {
      name: "Reward",
      to: "/user/transaction/reward_transaction",
      icon: SiFirewalla,
      submenu: [],
    },
    {
      name: "Salary Transactions",
      to: "/user/salary-transactions",
      icon: HandCoins,
      submenu: [],
    },
    { name: "Detail", to: "/user/income", icon: TbListDetails, submenu: [] },
  ];
  const wallet = [];
  const menus = [
    {
      name: "Dashboard",
      to: "/user/dashboard",
      icon: AiOutlineDashboard,
      submenu: [],
    },
    {
      name: "Tree",
      to: "/user/referraltree",
      icon: MdAccountTree,
      submenu: [],
    },
    {
      name: "Deposit",
      to: "/user/adddeposite",
      icon: PiHandDepositFill,
      submenu: [],
    },
    {
      name: "Trading Chart",
      to: "/user/treading",
      icon: FaChartBar,
      submenu: [],
    },
    {
      name: "Income",
      to: "/user/income",
      icon: FaHandHoldingDollar,
      submenu: income,
    },
    {
      name: "Withdrawal",
      to: "/user/addwithdrawal",
      icon: PiHandWithdrawFill,
      submenu: wallet,
    },
    {
      name: "Rewards",
      to: "/user/rewards",
      icon: Trophy,
      submenu: wallet,
    },
    {
      name: "Notification",
      to: "/user/Notification",
      icon: IoMdNotifications,
      submenu: [],
    },
    {
      name: "ReTop-Up",
      to: "/user/topup",
      icon: DocumentChartBarIcon,
      submenu: [],
    },

    {
      name: "Membership Plan",
      to: "/user/plan",
      icon: UserGroupIcon,
      submenu: [],
    },
    {
      name: "Support",
      to: "/user/sendsupport",
      icon: FcSupport,
      submenu: [],
    },
  ];

  const navItems = [
    { label: "Dashboard", href: "/user/dashboard", icon: AiOutlineDashboard },
    {
      label: "Withdrawal",
      href: "/user/addwithdrawal",
      icon: PiHandWithdrawFill,
    },
    { label: "Deposit", href: "/user/adddeposite", icon: PiHandDepositFill },
    {
      label: "Chart",
      href: "/user/treading",
      icon: FaChartBar,
    },
  ];
 const profitWallet = Number(singleuser?.level_month) +
    Number(singleuser?.direct_income) +
    Number(singleuser?.salary) +
    Number(singleuser?.reward)
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white  border-r border-gray-700/50 text-black transition-all duration-300 z-50
          ${
            isMobileMenuOpen
              ? "w-64 translate-x-0"
              : isSidebarOpen
              ? "w-64"
              : "md:w-16"
          }
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#410f7b] border-b border-gray-300">
          <Link to="/">
            <img src="/logo.png" className="w-16" alt="Logo" />
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-200 p-2"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-[50px] -right-3.5 p-2 text-white bg-[#6e25c0] rounded-full transition-all duration-300 hidden md:block"
        >
          <ChevronLeftIcon
            className={`w-4 h-4 transition-transform ${
              isSidebarOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>

        {/* Menu Items */}
        <div className="flex flex-col h-full p-2 ">
          <ul className="flex flex-col space-y-2 no-scrollbar overflow-auto md:mb-28 mb-[160px]">
            {menus.map((menu, index) => {
              const isActive = activeTab === menu.name;
              return (
                <Disclosure key={index} as="div" className="">
                  {({ open }) => (
                    <>
                      <Link to={menu.to}>
                        <Disclosure.Button
                          className={`flex items-center   w-full text-gray-800 transition-all duration-300 rounded ${
                            isSidebarOpen ? "p-3" : "p-2 justify-center"
                          } ${isActive ? "bg-[#e2e3e3]" : ""}`}
                          onClick={() => setActiveTab(menu.name)}
                        >
                          {menu?.icon && <menu.icon className="w-6 h-6" />}
                          {(isSidebarOpen || isMobileMenuOpen) && (
                            <span className="ml-3">{menu.name}</span>
                          )}
                          {(isSidebarOpen || isMobileMenuOpen) &&
                            menu.submenu.length > 0 && (
                              <ChevronDownIcon
                                className={`w-5 h-5 ml-auto transition-transform ${
                                  open ? "rotate-180" : "rotate-0"
                                }`}
                              />
                            )}
                        </Disclosure.Button>
                        {open && (isSidebarOpen || isMobileMenuOpen) && (
                          <Disclosure.Panel className="pl-4">
                            <ul>
                              {menu?.submenu.map((submenu, subIndex) => (
                                <li
                                  key={subIndex}
                                  className={`p-2 rounded cursor-pointer ${
                                    activeTab === submenu.name
                                      ? "bg-[#e3e3e3] text-gray-800"
                                      : ""
                                  }`}
                                  onClick={() => setActiveTab(submenu.name)}
                                >
                                  <Link
                                    to={submenu.to}
                                    className="w-full block flex items-center"
                                  >
                                    {submenu.icon && (
                                      <submenu.icon className="w-5 h-5 inline-block mr-4" />
                                    )}
                                    {submenu.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </Disclosure.Panel>
                        )}
                      </Link>
                    </>
                  )}
                </Disclosure>
              );
            })}
          </ul>
        </div>
      </aside>
      <div
        className={`flex flex-col flex-1 transition-all duration-300 overflow-x-hidden ${
          isSidebarOpen || isMobileMenuOpen ? "md:ml-64" : "md:ml-16"
        }`}
      >
        {/* Header */}
        <header className=" flex justify-between  items-center w-full bg-white shadow-md dark:bg-gray-900 dark:border-gray-700">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-900 dark:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="flex flex-col flex-1 item-center">
            <nav
              aria-label="Breadcrumb"
              className="flex border-b md:justify-between justify-end  px-4 py-2 "
            >
              <ol role="list" className="hidden space-x-4 lg:flex w-full">
                <li className="flex">
                  <div className="flex items-center">
                    <a href="#" className="text-gray-800 hover:text-gray-800">
                      <HomeIcon
                        aria-hidden="true"
                        className="flex-shrink-0 w-5 h-5"
                      />
                      <span className="sr-only">Home</span>
                    </a>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex items-center">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 44"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      className="flex-shrink-0 w-6 h-full text-gray-900 hover:text-gray-800/85"
                    >
                      <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                    </svg>
                    <a className="ml-4 text-base font-medium text-gray-900 hover:text-gray-800/85">
                      {singleuser?.username}
                    </a>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex items-center">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 44"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      className="flex-shrink-0 w-6 h-full text-gray-900 hover:text-gray-800/85"
                    >
                      <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                    </svg>
                    <a className="ml-4 text-base font-medium text-gray-900 hover:text-gray-800/85">
                      {singleuser?.email}
                    </a>
                  </div>
                </li>
                <li className="flex">
                  <div className="flex items-center">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 44"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      className="flex-shrink-0 w-6 h-full text-gray-900 hover:text-gray-800/85"
                    >
                      <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                    </svg>
                    <a className="ml-4 text-base font-medium text-gray-900 hover:text-gray-800/85">
                      {PageName}
                    </a>
                  </div>
                </li>
              </ol>
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="flex items-center p-3 text-sm font-medium rounded-full text-gray-400 bg-[#e0e21e]">
                  <FaUserAlt
                    aria-hidden="true"
                    className="size-4 text-[#0089bd]"
                  />
                </Menu.Button>

                <Menu.Items className="absolute right-0 z-50 mt-2 min-w-48 max-w-96 break-all origin-top-right rounded-sm bg-white py-1 shadow-lg ring-1 focus:outline-none">
                  <div className="flex items-center px-4 pb-1 border-b border-gray-400">
                    <div className="shrink-0 border bg-[#0089bd] p-2 rounded-full">
                      {/* <img alt="" className="size-8 rounded-full border" /> */}
                      <FaUserAlt
                        aria-hidden="true"
                        className="size-4 text-gray-300"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-800">
                        {singleuser?.fullname}
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        {singleuser?.email}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 px-2">
                    <Link to={`/user/profile/${auth?.id}`}>
                      <button
                        className={`group flex w-full text-gray-800 items-center px-4 py-2 text-sm font-medium ${
                          currentMenu === "Profile"
                            ? "bg-gray-200 text-gray-900"
                            : " hover:bg-gray-200 hover:text-gray-800"
                        }`}
                      >
                        <FaRegUser className="mr-2 h-4 w-4" />
                        Profile
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center  font-medium text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-200"
                    >
                      <IoMdLogOut className="mr-2 h-5 w-5 text-red-400" />
                      Logout
                    </button>
                  </div>
                </Menu.Items>
              </Menu>
            </nav>
          </div>
        </header>
         <div className="md:hidden text-xs z-50 w-full fixed bottom-0 border border-white/50 bg-black backdrop-blur-md p-5 flex justify-around items-center shadow-lg">
          {navItems.map((item) => {
            const isActive = activeTabs === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex flex-col items-center relative transition-all duration-500 ease-in-out"
              >
                <div
                  className={`p-2 rounded-full flex items-center justify-center absolute -top-10 border-2 border-white/50 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] delay-150 ${
                    isActive
                      ? "bg-rose-500 opacity-100 scale-110 translate-y-0 shadow-xl"
                      : "bg-transparent opacity-0 scale-75 translate-y-4"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 transition-colors duration-500 ease-in-out ${
                      isActive ? "text-white" : "text-gray-200"
                    }`}
                  />
                </div>
                <span
                  className={`text-xs mt-0.5 transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] ${
                    isActive ? "text-rose-500 font-semibold" : "text-gray-200"
                  } text-center`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <header className="">
          <div className="mx-auto max-w-7xl py-4  px-4">
            <Trading />
            <div className="flex justify-between my-2 ">
              <h2 className="text-base font-semibold text-gray-900  tracking-wide">
                {getGreeting()},
                <span className="text-transparent text-base bg-clip-text bg-gradient-to-r from-[#F4A950] to-[#2c7180]">
                  &nbsp;{singleuser?.fullname}
                </span>
              </h2>
              <nav aria-label="Breadcrumb" className="flex">
                <ol role="list" className="flex items-center space-x-2">
                  <li>
                    <div>
                      <Link
                        to="/"
                        className="text-gray-800 hover:text-gray-800"
                      >
                        <HomeIcon
                          aria-hidden="true"
                          className="size-5 shrink-0"
                        />
                        <span className="sr-only">Home</span>
                      </Link>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <ChevronRightIcon
                        aria-hidden="true"
                        className="size-5 shrink-0 text-gray-900"
                      />
                      <p className="ml-2 text-sm font-medium text-gray-800 hover:text-gray-800">
                        {PageName}
                      </p>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
            <div className="grid sm:grid-cols-4 grid-cols-1 gap-4 ">
              {/* {singleuser?.cto === "false" && (
                <div className="bg-gradient-to-br from-pink-900 via-pink-800 to-pink-700 rounded-2xl shadow-xl overflow-hidden border border-pink-700/30 transform hover:scale-105 transition-transform duration-300">
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="bg-pink-700/50 p-1.5 rounded-lg">
                        <Clock className="text-pink-200" size={16} />
                      </div>
                      <span className="text-pink-100 font-semibold">
                        Special Timer
                      </span>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-pink-400 animate-pulse"></div>
                  </div>
                  <div className="px-4 pb-4 text-center">
                    {timeRemaining2?.days > 0 || timeRemaining2?.hours > 0 ? (
                      <div className="text-2xl font-bold text-white">
                        {timeRemaining2?.days}:{timeRemaining2?.hours}:
                        {timeRemaining2?.minutes}:{timeRemaining2?.seconds}
                      </div>
                    ) : (
                      <div className="text-xl font-bold text-white bg-pink-800/50 py-1 rounded-lg">
                        Timer expired!
                      </div>
                    )}
                  </div>
                </div>
              )} */}

              {/* <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 rounded-md shadow-xl overflow-hidden border border-blue-700/30 transform hover:scale-105 transition-transform duration-300">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-700/50 p-1.5 rounded-lg">
                      <Clock className="text-blue-200" size={16} />
                    </div>
                    <span className="text-blue-100 font-semibold">
                      Active Timer
                    </span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                </div>
                <div className="px-4 pb-4 text-center">
                  {timeRemaining?.days > 0 || timeRemaining?.hours > 0 ? (
                    <div className="text-2xl font-bold text-white">
                      {timeRemaining?.days}:{timeRemaining?.hours}:
                      {timeRemaining?.minutes}:{timeRemaining?.seconds}
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-white bg-blue-800/50 py-1 rounded-lg">
                      Timer expired!
                    </div>
                  )}
                </div>
              </div> */}

<div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 rounded-md shadow-xl overflow-hidden border border-purple-700/30 transform hover:scale-105 transition-transform duration-300">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-indigo-700/50 p-1.5 rounded-lg">
                    <Clock className="text-blue-200" size={16} />
                    </div>
                    <span className="text-purple-100 font-semibold">
                     Compound Income
                    </span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                </div>
                <div className="px-4 pb-4 text-center">
                  <div className="text-2xl font-bold text-white flex items-center ">
                    <DollarSign className="text-purple-300" size={18} />
                    {singleuser?.compound_income|| 0}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-600 rounded-md shadow-xl overflow-hidden border border-purple-700/30 transform hover:scale-105 transition-transform duration-300">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-purple-700/50 p-1.5 rounded-lg">
                      <Wallet className="text-purple-200" size={16} />
                    </div>
                    <span className="text-purple-100 font-semibold">
                      Active Wallet
                    </span>
                  </div>
                  <BarChart4 className="text-purple-300" size={16} />
                </div>
                <div className="px-4 pb-4 text-center">
                  <div className="text-2xl font-bold text-white flex items-center ">
                    <DollarSign className="text-purple-300" size={18} />
                    {singleuser?.business?.toFixed(2) || 0}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-teal-600 rounded-md shadow-xl overflow-hidden border border-teal-700/30 transform hover:scale-105 transition-transform duration-300">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-teal-700/50 p-1.5 rounded-lg">
                      <CreditCard className="text-teal-200" size={16} />
                    </div>
                    <span className="text-teal-100 font-semibold">
                      Profit Wallet
                    </span>
                  </div>
                  <BarChart4 className="text-teal-300" size={16} />
                </div>
                <div className="px-4 pb-4 text-center">
                  <div className="text-2xl font-semibold text-white flex items-center">
                    <DollarSign className="text-teal-300" size={18} />
                    {profitWallet}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-900 via-rose-800 to-orange-600 rounded-md shadow-xl overflow-hidden border border-rose-700/30 transform hover:scale-105 transition-transform duration-300">
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-rose-700/50 p-1.5 rounded-lg">
                      <TrendingUp className="text-rose-200" size={16} />
                    </div>
                    <span className="text-rose-100 font-semibold">
                      Trade Wallet
                    </span>
                  </div>
                  <BarChart4 className="text-rose-300" size={16} />
                </div>
                <div className="px-4 pb-4 text-center">
                  <div className="text-2xl font-bold text-white flex items-center ">
                    <DollarSign className="text-rose-300" size={18} />
                    {singleuser?.working?.toFixed(2) || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 text-white">
          <div className="mx-auto max-w-7xl">
            {/* <h1 className="text-2xl font-semibold mb-4">{PageName}</h1> */}
            {Children}
          </div>
        </main>
      </div>
      <NotificationPopup />
      {defaulternotification && (
        <RewardNotification
          userrewardnotification={userrewardnotification}
          isClose={isClose}
        />
      )}
    </div>
  );
}
