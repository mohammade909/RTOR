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
  ChevronRightIcon,
  Trophy,
  HandCoins,
  Users,
  List,
  Blocks,
  Briefcase,
  Wallet,
  ChartCandlestick,
  TrophyIcon,
  BarChart,
} from "lucide-react";
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
      name: "Rent history",
      to: "/user/transaction/roi_transaction/invest",
      icon: RiPolaroid2Line,
      submenu: [],
    },
    {
      name: "Refferal Income",
      to: "/user/transaction/direct_transaction",
      icon: FaDirections,
      submenu: [],
    },
    {
      name: "Level Commission",
      to: "/user/transaction/invest_level_transaction/invest",
      icon: BarChart,
      submenu: [],
    },
    {
      name: "Refferal rewards",
      to: "/transactions/community_bonus",
      icon: TrophyIcon,
      submenu: [],
    },
    {
      name: "Reward",
      to: "/user/transaction/reward_transaction",
      icon: Trophy,
      submenu: [],
    },
    // {
    //   name: "Salary Transactions",
    //   to: "/user/salary-transactions",
    //   icon: HandCoins,
    //   submenu: [],
    // },
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
      name: "Deposit",
      to: "/user/deposit",
      icon: PiHandDepositFill,
      submenu: [],
    },
    {
      name: "Tree",
      to: "/user/refferral-tree",
      icon: MdAccountTree,
      submenu: [
        {
          name: "Tree",
          to: "/user/refferral-tree",
          icon: Blocks,
          submenu: [],
        },
        {
          name: "Table View",
          to: "/user/direct-members",
          icon: List,
          submenu: [],
        },
      ],
    },

    // {
    //   name: "Market",
    //   to: "/user/market",
    //   icon: FaChartBar,
    //   submenu: [
    //     {
    //       name: "Trade",
    //       to: "/user/trade",
    //       icon: ChartCandlestick,
    //       submenu: income,
    //     },
    //   ],
    // },
    {
      name: "Income",
      to: "/user/income",
      icon: FaHandHoldingDollar,
      submenu: income,
    },
    {
      name: "Withdrawal",
      to: "/user/withdrawal",
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
    // {
    //   name: "Support",
    //   to: "/user/queries",
    //   icon: FcSupport,
    //   submenu: [
       
    //   ],
    // },
  ];

  const profitWallet =
    Number(singleuser?.level_month) +
    Number(singleuser?.direct_income) +
    Number(singleuser?.salary) +
    Number(singleuser?.reward);

  const handleGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    else if (hour < 17) return "Good Afternoon";
    else return "Good Evening";
  };

  return (
    <div className="flex h-screen text-left">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white  border-r border-gray-200 text-gray-800 transition-all duration-300 z-50
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
        <div className="flex items-center justify-between px-4 py-3 border-b bg-[#000000] border-white/50">
          <Link to="/">
            <img src="/logo.png" className="w-28" />
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white p-2"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-[50px] -right-3.5 p-2 text-gray-800 border border-[#2e5799] bg-blue-100 rounded-full transition-all duration-300 hidden md:block"
        >
          <ChevronLeftIcon
            className={`w-4 h-4 transition-transform ${
              isSidebarOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>

        {/* Menu Items */}
        <div className="flex flex-col h-full p-2  ">
          <ul className="flex flex-col space-y-2 no-scrollbar overflow-auto mb-20">
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
                          } ${
                            isActive
                              ? "bg-[#0d4db442] border text-[#d78628] border-[#2e5799]"
                              : ""
                          }`}
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
                                      ? "bg-[#4874bb42] border text-[#d78628] border-[#2e5799]"
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
        className={`flex flex-col flex-1 transition-all duration-300  ${
          isSidebarOpen || isMobileMenuOpen ? "md:ml-64" : "md:ml-16"
        }`}
      >
        {/* Header */}
        <header className=" flex justify-between  items-center w-full ">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-800  p-2 rounded-md"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div className="flex flex-col flex-1 item-center">
            <nav
              aria-label="Breadcrumb"
              className="flex border-b md:justify-between justify-end  px-4 py-2 "
            >
              <ol role="list" className="hidden space-x-4  lg:flex w-full">
                <li className="flex">
                  <div className="flex items-center">
                    <a
                      href="#"
                      className="text-gray-800 hover:text-gray-800/85"
                    >
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
                      className="flex-shrink-0 w-6 h-full text-gray-800 hover:text-gray-800/85"
                    >
                      <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                    </svg>
                    <a className="ml-4 text-base font-medium text-gray-800 hover:text-gray-800/85">
                      <span className="block text-sm">
                        {" "}
                        {singleuser?.fullname}
                      </span>
                      <span className="block text-xs">
                        {" "}
                        {singleuser?.email}
                      </span>
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
                      className="flex-shrink-0 w-6 h-full text-gray-800 hover:text-gray-800/85"
                    >
                      <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                    </svg>
                    <a className="ml-4 text-base font-medium text-gray-800 hover:text-gray-800/85">
                      {singleuser?.username}
                    </a>
                  </div>
                </li>
                <li className="flex justify-end">
                  <div className="hidden md:flex space-x-3">
                    <div className="flex items-center bg-blue-50 rounded-lg px-4 py-2 shadow-sm border border-blue-100 hover:bg-blue-100 transition-colors">
                      <Briefcase size={18} className="text-blue-600" />
                      <div className="ml-2">
                        <p className="font-medium text-blue-900">
                          ${singleuser?.business || "0.00"}
                        </p>
                        <p className="text-xs text-blue-600">Active Wallet</p>
                      </div>
                    </div>

                    <div className="flex items-center bg-yellow-50 rounded-lg px-4 py-2 shadow-sm border border-yellow-100 hover:bg-yellow-100 transition-colors">
                      <Briefcase size={18} className="text-yellow-600" />
                      <div className="ml-2">
                        <p className="font-medium text-yellow-900">
                          $ {singleuser?.non_working}
                        </p>
                        <p className="text-xs text-yellow-600">Rent Wallet</p>
                      </div>
                    </div>

                    <div className="flex items-center bg-purple-50 rounded-lg px-4 py-2 shadow-sm border border-purple-100 hover:bg-purple-100 transition-colors">
                      <Briefcase size={18} className="text-purple-600" />
                      <div className="ml-2">
                        <p className="font-medium text-purple-900">
                          $ {singleuser?.working}
                        </p>
                        <p className="text-xs text-purple-600">Income Wallet</p>
                      </div>
                    </div>
                  </div>
                </li>
              </ol>
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="flex items-center p-3 text-sm font-medium rounded-full text-gray-400 border border-white/20 bg-[#5c8ad5]">
                  <FaUserAlt
                    aria-hidden="true"
                    className="size-4 text-[#e8d139]"
                  />
                </Menu.Button>

                <Menu.Items className="absolute right-0 z-50 mt-2 min-w-48 max-w-96 break-all origin-top-right rounded-sm bg-black py-1 shadow-lg ring-1 focus:outline-none">
                  <div className="flex items-center px-4 pb-1 border-b border-gray-400">
                    <div className="shrink-0 border bg-[#1c1a0e] p-2 rounded-full">
                      {/* <img alt="" className="size-8 rounded-full border" /> */}
                      <FaUserAlt
                        aria-hidden="true"
                        className="size-4 text-gray-300"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-300">
                        {singleuser?.fullname}
                      </div>
                      <div className="text-sm font-medium text-gray-300">
                        {singleuser?.email}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 px-2">
                    <Link to={`/user/profile/${auth?.id}`}>
                      <button
                        className={`group flex w-full text-gray-100 items-center px-4 py-2 text-sm font-medium ${
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

        <header className="">
          <div className="max-w-7xl mx-auto px-4 my-4">
            <div className="flex justify-between ">
              <h2 className="text-base font-semibold text-[#0a3e91]  tracking-wide">
                {handleGreeting()},
                <span className="text-transparent text-base bg-clip-text bg-gradient-to-r from-[#eda041] to-[#0a3e91]">
                  &nbsp;{singleuser?.fullname}
                </span>
              </h2>
              <nav aria-label="Breadcrumb" className="flex">
                <ol role="list" className="flex items-center space-x-2">
                  <li>
                    <div>
                      <Link
                        to="/"
                        className="text-[#0a3e91] hover:text-[#eda041]"
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
                        className="size-5 shrink-0 text-[#0a3e91]"
                      />
                      <p className="ml-2 text-sm font-medium text-[#eda041] ">
                        {PageName === "Trade" ? (
                          <Link to="/user/transaction/roi_transaction/invest" className="text-blue-400 animate-pulse">View History</Link>
                        ) : (
                          PageName
                        )}
                      </p>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 text-white">
          <div className="max-w-full">
            {/* <h1 className="text-2xl font-semibold ">{PageName}</h1> */}
            {Children}
          </div>
        </main>
      </div>
    </div>
  );
}
